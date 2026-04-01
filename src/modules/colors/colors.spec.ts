import { test, describe, expect } from 'vitest'
import { hex2rgb } from './colors'

describe('colors', () => {
  describe('hex2rgb', () => {
    test('converts 6-character hex to rgb', () => {
      expect(hex2rgb('#ffffff')).toBe('255,255,255')
      expect(hex2rgb('#000000')).toBe('0,0,0')
      expect(hex2rgb('#f44336')).toBe('244,67,54')
    })

    test('converts 3-character hex to rgb', () => {
      expect(hex2rgb('#fff')).toBe('255,255,255')
      expect(hex2rgb('#000')).toBe('0,0,0')
      expect(hex2rgb('#f00')).toBe('255,0,0')
    })

    test('ignores alpha parameter since hex2rgb only returns rgb', () => {
      expect(hex2rgb('#ffffff', 0.5)).toBe('255,255,255')
    })

    test('returns default color for invalid hex strings', () => {
      expect(hex2rgb('invalid')).toBe('155,155,155')
      expect(hex2rgb('#ff')).toBe('155,155,155')
      expect(hex2rgb('#fffffff')).toBe('155,155,155')
      expect(hex2rgb('ffffff')).toBe('155,155,155')
    })
  })
})
