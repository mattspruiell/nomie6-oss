import text, { initials, replaceTextAt, textToId } from './text'
import { it, describe, expect } from 'vitest'
describe('text tests', () => {
  it('should truncate', () => {
    expect(text.truncate('aaaaaaaaaa', 5)).toBe('aaaaa...')
  })
  it('should truncate with the end', () => {
    let _txt = 'abcdefghijklmnopqrstuvwxyz.gif'
    expect(text.truncate(_txt, 10, 5)).toBe('abcde...z.gif')
  })
  it('should truncate with the end', () => {
    let _txt = 'abcdefghijklmnopqrstuvwxyz.gif'
    expect(text.truncate(_txt, 10, 4)).toBe('abcdef....gif')
  })

  it('should generate initials', () => {
    expect(initials('brandon corbin')).toBe('BC')
    expect(initials('Abraham Bart McSweeny McNight')).toBe('AM')
    expect(initials('Jacob B Smith')).toBe('JS')
    expect(initials('poooolboy')).toBe('PO')
    expect(initials('p')).toBe('P')
    expect(initials('')).toBe('NA')
  })
  
})


describe("Replace text at position", ()=>{
  it('should replace the right part', ()=>{
    const base = "Today my #mood ";
    const pos = 9;
    const replaceThis = '#mood'
    const withThis = '#mood(40)';
    const final = replaceTextAt(base, replaceThis, withThis, pos);
    expect(final).toEqual('Today my #mood(40) ');
  })
});

describe('textToId tests', () => {
  it('should handle simple strings', () => {
    expect(textToId('Hello World')).toBe('id-helloWorld')
  })

  it('should handle strings with special characters', () => {
    expect(textToId('My-Special_String!')).toBe('id-mySpecialString')
  })

  it('should handle numbers', () => {
    expect(textToId('123 test')).toBe('id-123Test')
  })

  it('should handle empty strings', () => {
    expect(textToId('')).toBe('id-')
  })
})
