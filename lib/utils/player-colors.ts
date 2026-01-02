const COLORS = [
  "#EF4444", // red
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#14B8A6", // teal
  "#F97316", // orange
];

export function assignPlayerColor(playerIndex: number): string {
  return COLORS[playerIndex % COLORS.length];
}
