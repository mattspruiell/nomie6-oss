import text, { initials, replaceTextAt, isEmail } from './text'
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

  it('should validate emails correctly', () => {
    // Valid emails
    expect(isEmail('test@example.com')).toBe(true);
    expect(isEmail('user.name+tag+sorting@example.com')).toBe(true);
    expect(isEmail('test@[123.123.123.123]')).toBe(true);
    expect(isEmail('a@b.cc')).toBe(true);

    // Invalid emails
    expect(isEmail('plainaddress')).toBe(false);
    expect(isEmail('@example.com')).toBe(false);
    expect(isEmail('email@example@example.com')).toBe(false);
    expect(isEmail('.email@example.com')).toBe(false);
    expect(isEmail('email.@example.com')).toBe(false);
    expect(isEmail('email..email@example.com')).toBe(false);

    // Edge cases
    expect(isEmail('')).toBe(false);
    expect(isEmail(undefined as any)).toBe(false);
    expect(isEmail(null as any)).toBe(false);
    expect(isEmail(' ')).toBe(false);
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