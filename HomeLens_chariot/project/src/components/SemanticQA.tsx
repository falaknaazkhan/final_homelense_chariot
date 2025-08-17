import { useState } from "react";

function SemanticQA() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([
    {
      question: "What are recent trends in London?",
      answer: "In recent months, average home prices in London have been steadily increasing, with a 3.2% rise compared to the previous quarter. The market shows strong demand in zones 2-4."
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockAnswer = "Based on current market data, I can provide insights about UK housing trends. This would connect to a RAG model for real semantic search capabilities.";
      
      setConversation(prev => [...prev, {
        question: question,
        answer: mockAnswer
      }]);
      
      setQuestion("");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-lg rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Semantic Q&A</h3>
            <p className="text-slate-400 text-sm">Ask questions about housing data</p>
          </div>
        </div>

        {/* Conversation */}
        <div className="space-y-4 max-h-48 overflow-y-auto">
          {conversation.map((item, index) => (
            <div key={index} className="space-y-3">
              {/* Question */}
              <div className="flex justify-end">
                <div className="bg-violet-600/20 border border-violet-500/30 rounded-2xl rounded-br-md px-4 py-3 max-w-xs">
                  <p className="text-slate-200 text-sm">{item.question}</p>
                </div>
              </div>
              
              {/* Answer */}
              <div className="flex justify-start">
                <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs">
                  <p className="text-slate-300 text-sm">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about housing trends..."
              className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SemanticQA;