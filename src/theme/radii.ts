// Motiva Restrained Corner Radius Scale (Subtle, architectural, never bulbous)
export const radii = {
  none: 0,
  sm: 4,
  base: 8,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export type Radii = typeof radii;
