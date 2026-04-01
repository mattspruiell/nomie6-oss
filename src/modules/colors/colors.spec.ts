import { hex2rgba } from './colors'
import { it, describe, expect } from 'vitest'

describe('modules/colors/hex2rgba', () => {
  it('should convert 6-character hex correctly', () => {
    expect(hex2rgba('#ffffff')).toEqual('rgba(255,255,255,1)')
    expect(hex2rgba('#000000')).toEqual('rgba(0,0,0,1)')
    expect(hex2rgba('#ff0000')).toEqual('rgba(255,0,0,1)')
    expect(hex2rgba('#00ff00')).toEqual('rgba(0,255,0,1)')
    expect(hex2rgba('#0000ff')).toEqual('rgba(0,0,255,1)')
    expect(hex2rgba('#1a2b3c')).toEqual('rgba(26,43,60,1)')
  })

  it('should convert 3-character hex correctly', () => {
    expect(hex2rgba('#fff')).toEqual('rgba(255,255,255,1)')
    expect(hex2rgba('#000')).toEqual('rgba(0,0,0,1)')
    expect(hex2rgba('#f00')).toEqual('rgba(255,0,0,1)')
    expect(hex2rgba('#0f0')).toEqual('rgba(0,255,0,1)')
    expect(hex2rgba('#00f')).toEqual('rgba(0,0,255,1)')
    expect(hex2rgba('#123')).toEqual('rgba(17,34,51,1)')
  })

  it('should handle custom alpha values', () => {
    expect(hex2rgba('#ffffff', 0.5)).toEqual('rgba(255,255,255,0.5)')
    expect(hex2rgba('#000000', 0)).toEqual('rgba(0,0,0,0)')
    expect(hex2rgba('#ff0000', 1)).toEqual('rgba(255,0,0,1)')
    expect(hex2rgba('#00ff00', 0.123)).toEqual('rgba(0,255,0,0.123)')
    expect(hex2rgba('#fff', 0.5)).toEqual('rgba(255,255,255,0.5)')
  })

  it('should handle uppercase hex characters', () => {
    expect(hex2rgba('#FFFFFF')).toEqual('rgba(255,255,255,1)')
    expect(hex2rgba('#FFF')).toEqual('rgba(255,255,255,1)')
    expect(hex2rgba('#1A2B3C')).toEqual('rgba(26,43,60,1)')
  })

  it('should handle invalid input formats', () => {
    expect(hex2rgba('ffffff')).toEqual('rgba(155,155,155,1)') // Missing #
    expect(hex2rgba('#ffff')).toEqual('rgba(155,155,155,1)') // 4 characters
    expect(hex2rgba('#fffff')).toEqual('rgba(155,155,155,1)') // 5 characters
    expect(hex2rgba('#fffffff')).toEqual('rgba(155,155,155,1)') // 7 characters
    expect(hex2rgba('#zzzzzz')).toEqual('rgba(155,155,155,1)') // Invalid characters
    expect(hex2rgba('invalid')).toEqual('rgba(155,155,155,1)') // Non-hex string
    expect(hex2rgba('')).toEqual('rgba(155,155,155,1)') // Empty string
  })

  it('should handle invalid input formats with custom alpha', () => {
    expect(hex2rgba('ffffff', 0.5)).toEqual('rgba(155,155,155,0.5)') // Missing #
    expect(hex2rgba('#zzzzzz', 0.2)).toEqual('rgba(155,155,155,0.2)') // Invalid characters
  })
})
