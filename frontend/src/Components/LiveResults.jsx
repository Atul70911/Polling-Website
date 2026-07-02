import React from "react";
import { useApp } from "../ContextProvider/AppContext";
import { BarChart2, ShieldCheck, RefreshCw } from "lucide-react";

export default function LiveResults() {
  const { selectedPoll } = useApp();
  if (!selectedPoll) return null;

  const options    = selectedPoll.options    || [];
  const totalVotes = selectedPoll.totalVotes ?? 0;

  const withStats = options.map((opt) => {
    const votes = opt.votes ?? 0;
    const pct   = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
    return { ...opt, votes, pct };
  });

  return (
    <div className="flex flex-col gap-4 pt-2">
      {/* Live Results card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900 text-base">Live Results</h3>
          <BarChart2 size={20} className="text-blue-600" />
        </div>

        <div className="flex flex-col gap-5">
          {withStats.map((opt, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-800">
                  {opt.text || opt.label || opt.option}
                </span>
                <span className={`text-sm font-bold ${opt.pct > 0 ? "text-blue-700" : "text-gray-400"}`}>
                  {opt.pct}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${opt.pct}%`,
                    background: opt.pct > 0 ? "#1a2744" : "#e5e7eb",
                  }}
                />
              </div>

              <p className="text-xs text-gray-400 mt-1 text-right">
                {opt.votes.toLocaleString()} votes
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 mt-5 pt-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={13} className="text-gray-400 shrink-0" />
            Blockchain verified results
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <RefreshCw size={13} className="text-gray-400 shrink-0" />
            Updates every 30 seconds
          </div>
        </div>
      </div>

      {/* Why this matters card */}
      {selectedPoll.context && (
        <div className="bg-[#1a2744] rounded-xl p-5">
          <h4 className="text-sm font-bold text-white mb-2">Why this matters?</h4>
          <p className="text-sm text-blue-200 leading-relaxed">{selectedPoll.context}</p>
        </div>
      )}
    </div>
  );
}