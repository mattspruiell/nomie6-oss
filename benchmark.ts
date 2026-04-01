import LedgerTools from './src/domains/ledger/ledger-tools.ts';
import dayjs from 'dayjs';

// Mock storage with simulated delay
const mockStorage = {
  local: {
    get: () => null,
    put: () => {}
  },
  get: async (path: string) => {
    // Simulate 50ms network delay
    await new Promise(resolve => setTimeout(resolve, 50));
    return [
      { note: `#test on ${path}`, _id: path + '1', end: Date.now() },
      { note: `#test2 on ${path}`, _id: path + '2', end: Date.now() }
    ];
  },
  put: async () => {},
  list: async () => []
};

const ledgerTools = new LedgerTools(mockStorage, (date: string) => `data/books/${date}`);

async function runBenchmark() {
  console.log('Starting benchmark...');
  const start = Date.now();

  await ledgerTools.query({
    fresh: true,
    start: dayjs().subtract(99, 'day'),
    end: dayjs()
  });

  const end = Date.now();
  console.log(`Query took ${end - start}ms`);
}

runBenchmark().catch(console.error);
