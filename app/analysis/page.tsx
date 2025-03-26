"use client";

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-[#1a1b2e] w-full text-white">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="bg-[#2a2c42] rounded-lg p-4 md:p-6 mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2">
            Market Analysis
          </h1>
          <p className="text-base sm:text-lg text-gray-400">
            Technical and fundamental analysis tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#2a2c42] rounded-lg p-4 md:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Market Overview
            </h2>
            <p className="text-sm sm:text-base text-gray-400">
              Detailed market analysis features coming soon. Stay tuned for:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-sm sm:text-base text-gray-300">
              <li>Advanced technical indicators</li>
              <li>Market sentiment analysis</li>
              <li>Price action patterns</li>
              <li>Volume profile analysis</li>
            </ul>
          </div>

          <div className="bg-[#2a2c42] rounded-lg p-4 md:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Trading Insights
            </h2>
            <p className="text-sm sm:text-base text-gray-400">
              Trading insights features coming soon. Stay tuned for:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-sm sm:text-base text-gray-300">
              <li>AI-powered trade suggestions</li>
              <li>Risk management tools</li>
              <li>Position sizing calculator</li>
              <li>Market correlation analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
