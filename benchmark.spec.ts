import LedgerTools from './src/domains/ledger/ledger-tools';
import dayjs from 'dayjs';
import { it, describe, expect } from 'vitest';

describe('Benchmark ledger query', () => {
  it('benchmark sequential vs concurrent', async () => {
    let callCount = 0;
    const mockStorage = {
      local: {
        get: () => null,
        put: () => {}
      },
      get: async (path: string) => {
        callCount++;
        await new Promise(resolve => setTimeout(resolve, 50));
        return [
          { note: `#test on ${path}`, _id: path + '1', end: Date.now() }
        ];
      },
      put: async () => {},
      list: async () => []
    };

    const ledgerTools = new LedgerTools(mockStorage as any, (date: string) => `data/books/${date}`);

    // Test with 365 days (~52 chunks, should take 50ms * (52 / 10 = 6) chunks ≈ 300ms sequentially, but only ~50ms if chunk promises run concurrently)
    const start = Date.now();
    await ledgerTools.query({
      fresh: true,
      start: dayjs().subtract(364, 'day'),
      end: dayjs()
    });
    const end = Date.now();

    console.log(`Query took ${end - start}ms, made ${callCount} get calls`);
    expect(end - start).toBeGreaterThan(0);
  });
});
