"use client";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#1a1b2e] w-full text-white">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="bg-[#2a2c42] rounded-lg p-4 md:p-6 mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2">
            Portfolio
          </h1>
          <p className="text-base sm:text-lg text-gray-400">
            Track your trading performance and positions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#2a2c42] rounded-lg p-4 md:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Portfolio Summary
            </h2>
            <p className="text-sm sm:text-base text-gray-400">
              Portfolio tracking features coming soon. Stay tuned for:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-sm sm:text-base text-gray-300">
              <li>Portfolio performance metrics</li>
              <li>Asset allocation overview</li>
              <li>Risk analysis</li>
              <li>Profit/Loss tracking</li>
            </ul>
          </div>

          <div className="bg-[#2a2c42] rounded-lg p-4 md:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Open Positions
            </h2>
            <p className="text-sm sm:text-base text-gray-400">
              Position management features coming soon. Stay tuned for:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-sm sm:text-base text-gray-300">
              <li>Real-time position tracking</li>
              <li>Position sizing tools</li>
              <li>Stop-loss management</li>
              <li>Take-profit management</li>
            </ul>
          </div>

          <div className="bg-[#2a2c42] rounded-lg p-4 md:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Trade History
            </h2>
            <p className="text-sm sm:text-base text-gray-400">
              Trade history features coming soon. Stay tuned for:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-sm sm:text-base text-gray-300">
              <li>Historical trade analysis</li>
              <li>Performance metrics</li>
              <li>Trade journal</li>
              <li>Trading statistics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
