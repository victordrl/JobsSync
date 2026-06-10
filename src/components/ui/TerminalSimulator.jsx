import { useTerminalSimulation } from "@/hooks/useTerminalSimulation";

export function TerminalSimulator({ onDone }) {
  const { visibleLogs, done, run } = useTerminalSimulation();

  return (
    <div className="bg-slate-800 rounded-lg p-6 font-mono text-sm shadow-2xl border border-slate-700 h-64 overflow-hidden flex flex-col justify-end">
      <div className="text-green-400 space-y-1">
        {visibleLogs.map((log, i) => (
          <div key={i}>{`> ${log}`}</div>
        ))}
      </div>
      <div className="mt-2 text-white typing-cursor">_</div>
    </div>
  );
}
