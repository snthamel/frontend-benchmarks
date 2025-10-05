export interface BenchmarkResult {
  testName: string;
  framework: string;
  duration: number;
  memoryUsed?: number;
  timestamp: number;
  iterations: number;
  metadata?: Record<string, any>;
}

export interface BenchmarkSuite {
  name: string;
  description: string;
  iterations: number;
  setup?: () => void;
  teardown?: () => void;
  tests: BenchmarkTest[];
}

export interface BenchmarkTest {
  name: string;
  description: string;
  operation: BenchmarkOperation;
  expectedRows?: number;
}

export type BenchmarkOperation = 
  | 'create-rows'
  | 'replace-all'
  | 'partial-update'
  | 'select-row'
  | 'swap-rows'
  | 'remove-row'
  | 'create-many-rows'
  | 'append-rows'
  | 'clear-rows';

export interface FrameworkImplementation {
  name: string;
  version: string;
  createRows: (count: number) => Promise<void>;
  replaceAll: (newData: RowData[]) => Promise<void>;
  partialUpdate: (data: RowData[]) => Promise<void>;
  selectRow: (id: string) => Promise<void>;
  swapRows: (id1: string, id2: string) => Promise<void>;
  removeRow: (id: string) => Promise<void>;
  appendRows: (data: RowData[]) => Promise<void>;
  clearRows: () => Promise<void>;
  cleanup: () => void;
}

export interface RowData {
  id: string;
  label: string;
  value: number;
}

export interface BenchmarkMetrics {
  duration: number;
  memoryBefore?: number;
  memoryAfter?: number;
  memoryPeak?: number;
  gcCount?: number;
}

export interface ComparisonResult {
  frameworks: string[];
  results: Map<string, BenchmarkResult[]>;
  statistics: {
    fastest: string;
    slowest: string;
    memoryEfficient?: string;
    memoryHeavy?: string;
  };
}