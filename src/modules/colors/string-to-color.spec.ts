import { describe, it, expect } from 'vitest'
import { strToColor, Hash } from './string-to-color'
import colors from './colors'

describe('string-to-color', () => {
  describe('strToColor', () => {
    it('should return a valid color from the colors array', () => {
      const color = strToColor('hello')
      expect(colors).toContain(color)
    })

    it('should consistently return the same color for the same string', () => {
      const color1 = strToColor('nomie')
      const color2 = strToColor('nomie')
      expect(color1).toBe(color2)
    })

    it('should return different colors for different strings', () => {
      const color1 = strToColor('apple')
      const color2 = strToColor('banana')
      // Note: while hash collisions are possible, 'apple' and 'banana' should produce different hashes
      expect(color1).not.toBe(color2)
    })

    it('should handle empty strings', () => {
      const color = strToColor('')
      expect(colors).toContain(color)
    })

    it('should handle strings with special characters', () => {
      const color = strToColor('!@#$%^&*()')
      expect(colors).toContain(color)
    })
  })

  describe('Hash class', () => {
    it('should calculate a hash using the fh5 algorithm', () => {
      const hash1 = new Hash('test1')
      const hash2 = new Hash('test1')
      const hash3 = new Hash('test2')

      expect(hash1.hash).toBe(hash2.hash)
      expect(hash1.hash).not.toBe(hash3.hash)
      expect(typeof hash1.hash).toBe('number')
    })

    describe('xor()', () => {
      it('should return 0 or 1 based on hash modulo 2', () => {
        const hash = new Hash('test')
        const xorValue = hash.xor()
        expect([0, 1]).toContain(xorValue)
      })
    })

    describe('pick()', () => {
      it('should return an element from the provided array', () => {
        const arr = ['a', 'b', 'c']
        const hash = new Hash('test')
        const picked = hash.pick(arr)
        expect(arr).toContain(picked)
      })

      it('should return null if the provided array is empty', () => {
        const arr: any[] = []
        const hash = new Hash('test')
        const picked = hash.pick(arr)
        expect(picked).toBeNull()
      })

      it('should return the same element for the same array and seed', () => {
        const arr = ['a', 'b', 'c', 'd', 'e']
        const hash = new Hash('consistency')
        const picked1 = hash.pick(arr, 'seed1')
        const picked2 = hash.pick(arr, 'seed1')
        expect(picked1).toBe(picked2)
      })

      it('should potentially return different elements with different seeds length', () => {
        // We'll test this behavior by trying a few different seeds with significantly different parsing lengths
        const arr = Array.from({ length: 100 }, (_, i) => i) // array of 0 to 99
        const hash = new Hash('seed-test')

        const results = new Set()
        results.add(hash.pick(arr, 'a'))
        results.add(hash.pick(arr, '10'))
        results.add(hash.pick(arr, '100'))
        results.add(hash.pick(arr, '1000'))
        results.add(hash.pick(arr, '10000'))

        // It's highly probable that we get more than 1 distinct result with different length seeds
        expect(results.size).toBeGreaterThan(1)
      })
    })
  })
})
