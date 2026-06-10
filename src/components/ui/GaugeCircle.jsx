const strokeColorMap = {
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
};

const textColorMap = {
  green: "text-green-600",
  yellow: "text-yellow-600",
  red: "text-red-600",
};

export function GaugeCircle({
  percentage,
  size = 64,
  color = "green",
}) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColorMap[color]}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className={`absolute text-sm font-bold ${textColorMap[color]}`}>
        {percentage}%
      </span>
    </div>
  );
}
