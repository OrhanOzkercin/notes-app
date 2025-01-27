import { tokens } from '@/styles/design-tokens'

export function useDesignTokens() {
  return tokens
}

// Type helpers
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}`
          : K
        : never
    }[keyof T]
  : never

export type ColorToken = NestedKeyOf<typeof tokens.colors>
export type SpacingToken = keyof typeof tokens.spacing
export type BreakpointToken = keyof typeof tokens.breakpoints
export type RadiusToken = keyof typeof tokens.radii
export type ShadowToken = keyof typeof tokens.shadows
export type TransitionToken = keyof typeof tokens.transitions
export type TypographySizeToken = keyof typeof tokens.typography.sizes
export type TypographyWeightToken = keyof typeof tokens.typography.weights
export type TypographyLineHeightToken = keyof typeof tokens.typography.lineHeights 