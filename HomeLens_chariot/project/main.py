
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import sqlite3
import pandas as pd
import os

# --- Config ---
HP_DB = os.getenv("HP_DB", "/mnt/data/house_prices.db")
OX_DB = os.getenv("OX_DB", "/mnt/data/final_oxfordshire.db")
SUPERMARKETS_CSV = os.getenv("SUPERMARKETS_CSV", "/mnt/data/osm_supermarkets.csv")

app = FastAPI(title="HomeLens Backend", version="0.1.0")

# CORS for local Vite/React dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_conn(path: str):
    if not os.path.exists(path):
        raise HTTPException(status_code=500, detail=f"DB not found: {path}")
    con = sqlite3.connect(path, check_same_thread=False)
    con.row_factory = sqlite3.Row
    return con

hp_con = get_conn(HP_DB)
ox_con = get_conn(OX_DB)

# Load supermarkets CSV once
if not os.path.exists(SUPERMARKETS_CSV):
    supermarkets_df = pd.DataFrame(columns=["city","name","lat","lon","brand","operator","postcode"])
else:
    supermarkets_df = pd.read_csv(SUPERMARKETS_CSV)
    supermarkets_df["postcode_norm"] = supermarkets_df["postcode"].astype(str).str.replace(" ", "").str.upper()

@app.get("/health")
def health():
    return {"status": "ok"}

# --- House Prices (national DB) ---
@app.get("/api/house/avg_price_by_month")
def avg_price_by_month(
    postcode: Optional[str] = Query(None, description="Full postcode to filter"),
    district: Optional[str] = Query(None, description="District name filter"),
    from_month: Optional[str] = Query(None, description="YYYY-MM"),
    to_month: Optional[str] = Query(None, description="YYYY-MM"),
):
    sql = """
    SELECT 
        strftime('%Y-%m', Date) AS y_m,
        AVG(Price) AS avg_price,
        COUNT(*) AS transactions
    FROM house_prices
    WHERE 1=1
    """
    params = []
    if postcode:
        sql += " AND REPLACE(UPPER(Postcode),' ','') = REPLACE(UPPER(?),' ','')"
        params.append(postcode)
    if district:
        sql += " AND District = ?"
        params.append(district)
    if from_month:
        sql += " AND Date >= date(?, '-01')"
        params.append(from_month)
    if to_month:
        sql += " AND Date < date(?, '+1 month', 'start of month')"
        params.append(to_month)
    sql += " GROUP BY 1 ORDER BY 1"
    df = pd.read_sql_query(sql, hp_con, params=params)
    return {"series": df.to_dict(orient="records")}

# --- Oxfordshire DB helpers ---
def postcode_to_ids(pc: str) -> Optional[dict]:
    q = "SELECT district_id, ward_id, area_id FROM PostCode WHERE REPLACE(UPPER(postcode),' ','') = REPLACE(UPPER(?),' ','') LIMIT 1"
    cur = ox_con.execute(q, (pc,))
    row = cur.fetchone()
    if row:
        return dict(row)
    return None

@app.get("/api/oxford/price_by_quarter")
def ox_price_by_quarter(
    postcode: Optional[str] = Query(None),
    district_id: Optional[str] = Query(None),
):
    if postcode:
        ids = postcode_to_ids(postcode)
        if not ids:
            raise HTTPException(status_code=404, detail="Postcode not found in Oxfordshire mapping")
        district_id = ids["district_id"]
    if not district_id:
        raise HTTPException(status_code=400, detail="Provide postcode or district_id")

    sql = """
    SELECT year, quarter, AVG(price) AS avg_price, COUNT(*) AS n
    FROM HousePrice
    WHERE district_id = ?
    GROUP BY year, quarter
    ORDER BY year, quarter
    """
    df = pd.read_sql_query(sql, ox_con, params=(district_id,))
    return {"district_id": district_id, "series": df.to_dict(orient="records")}

@app.get("/api/oxford/broadband")
def ox_broadband(postcode: str = Query(...)):
    ids = postcode_to_ids(postcode)
    if not ids:
        raise HTTPException(status_code=404, detail="Postcode not found in Oxfordshire mapping")
    sql = """
    SELECT a.area_name, b.*
    FROM Broadband b
    JOIN Area a ON a.area_id = b.area_id
    WHERE b.area_id = ?
    """
    df = pd.read_sql_query(sql, ox_con, params=(ids["area_id"],))
    return {"postcode": postcode, "area_id": ids["area_id"], "records": df.to_dict(orient="records")}

@app.get("/api/oxford/district_lookup")
def ox_district_lookup(district_id: Optional[str] = None, ward_id: Optional[str] = None):
    sql = "SELECT DISTINCT district_id, district_name, ward_id, ward_name FROM District WHERE 1=1"
    params = []
    if district_id:
        sql += " AND district_id = ?"; params.append(district_id)
    if ward_id:
        sql += " AND ward_id = ?"; params.append(ward_id)
    df = pd.read_sql_query(sql, ox_con, params=params)
    return {"results": df.to_dict(orient="records")}

# --- Supermarkets ---
@app.get("/api/supermarkets")
def supermarkets(
    city: Optional[str] = Query(None),
    postcode: Optional[str] = Query(None, description="Full postcode to filter"),
    limit: int = Query(100, ge=1, le=1000),
):
    df = supermarkets_df.copy()
    if city:
        df = df[df["city"].str.contains(city, case=False, na=False)]
    if postcode:
        norm = str(postcode).replace(" ", "").upper()
        df = df[df["postcode_norm"] == norm]
    df = df.head(limit)
    cols = ["city","name","brand","operator","lat","lon","postcode"]
    return {"count": len(df), "items": df[cols].to_dict(orient="records")}

# --- Join example: supermarkets + Oxfordshire area ---
@app.get("/api/oxford/supermarkets_by_postcode")
def supermarkets_by_postcode(postcode: str):
    norm = postcode.replace(" ", "").upper()
    ids = postcode_to_ids(postcode)
    if not ids:
        return {"postcode": postcode, "items": []}
    df = supermarkets_df[supermarkets_df["postcode_norm"] == norm].copy()
    df["district_id"] = ids["district_id"]
    df["ward_id"] = ids["ward_id"]
    return {"postcode": postcode, "district_id": ids["district_id"], "ward_id": ids["ward_id"], "items": df[["city","name","brand","lat","lon","postcode","district_id","ward_id"]].to_dict(orient="records")}
