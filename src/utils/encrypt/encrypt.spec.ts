import { describe, it, expect } from 'vitest';
import { encrypt, decrypt, encryptObject, decryptObject } from './encrypt';

describe('encrypt utils', () => {
  const secretKey = 'test-secret-key';

  describe('encrypt / decrypt', () => {
    it('should encrypt and decrypt a string', () => {
      const originalString = 'hello world';
      const encrypted = encrypt(originalString, secretKey);

      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toBe(originalString);

      const decrypted = decrypt(encrypted, secretKey);
      expect(decrypted).toBe(originalString);
    });

    it('should handle empty strings', () => {
      const originalString = '';
      const encrypted = encrypt(originalString, secretKey);
      const decrypted = decrypt(encrypted, secretKey);
      expect(decrypted).toBe(originalString);
    });
  });

  describe('encryptObject / decryptObject', () => {
    it('should encrypt and decrypt a plain object', () => {
      const originalObj = {
        name: 'John Doe',
        age: 30,
        active: true,
      };

      const encrypted = encryptObject(originalObj, secretKey);
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toBe(JSON.stringify(originalObj));

      const decrypted = decryptObject(encrypted, secretKey);
      expect(decrypted).toEqual(originalObj);
    });

    it('should handle complex nested objects', () => {
      const originalObj = {
        user: {
          id: 1,
          roles: ['admin', 'user'],
          meta: {
            lastLogin: '2023-01-01',
          }
        },
        settings: null,
      };

      const encrypted = encryptObject(originalObj, secretKey);
      const decrypted = decryptObject(encrypted, secretKey);
      expect(decrypted).toEqual(originalObj);
    });

    it('should handle arrays', () => {
      const originalArr = [1, 2, 'three', { four: 4 }];
      const encrypted = encryptObject(originalArr, secretKey);
      const decrypted = decryptObject(encrypted, secretKey);
      expect(decrypted).toEqual(originalArr);
    });
  });
});
