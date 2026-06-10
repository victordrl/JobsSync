export function cn(...classes) {
  return classes
    .flat()
    .filter((c) => typeof c === "string" && c.length > 0)
    .join(" ");
}

export function formatScore(score) {
  return `${score}%`;
}
