const CATEGORY_LABELS: Record<number, string> = {
  0: "Unknown",
  1: "Light aircraft",
  2: "Small aircraft",
  3: "Large aircraft",
  4: "High vortex large",
  5: "Heavy aircraft",
  6: "High performance",
  7: "Rotorcraft",
  8: "Glider",
  9: "Lighter-than-air",
  10: "Parachutist",
  11: "Ultralight",
  12: "Reserved",
  13: "UAV",
  14: "Space vehicle",
  15: "Emergency vehicle",
  16: "Service vehicle",
  17: "Point obstacle",
  18: "Cluster obstacle",
  19: "Line obstacle",
};

export function getCategoryLabel(category: number | null): string {
  if (category === null) return "N/A";
  return CATEGORY_LABELS[category] ?? "Unknown";
}