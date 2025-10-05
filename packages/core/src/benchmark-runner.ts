import type { 
  BenchmarkResult, 
  BenchmarkSuite, 
  BenchmarkTest, 
  FrameworkImplementation, 
  ComparisonResult,
  RowData
} from '@benchmark/types';
import { generateRowData, calculateStatistics } from '@benchmark/utils';
import { PerformanceMonitor } from './performance-monitor.js';

export class BenchmarkRunner {
  private monitor: PerformanceMonitor;
  private results: Map<string, BenchmarkResult[]> = new Map();
  private implementations: Map<string, FrameworkImplementation> = new Map();

  constructor() {
    this.monitor = new PerformanceMonitor();
  }

  registerImplementation(impl: FrameworkImplementation) {
    this.implementations.set(impl.name, impl);
  }

  getRegisteredFrameworks(): string[] {
    return Array.from(this.implementations.keys());
  }

  private createStandardSuite(): BenchmarkSuite {
    return {
      name: 'DOM Manipulation Benchmark',
      description: 'Standard benchmark suite for frontend frameworks',
      iterations: 3,
      tests: [
        {
          name: 'Create 1,000 rows',
          description: 'Create 1,000 rows in a table',
          operation: 'create-rows',
          expectedRows: 1000
        },
        {
          name: 'Replace all 1,000 rows',
          description: 'Replace all existing rows with new data',
          operation: 'replace-all',
          expectedRows: 1000
        },
        {
          name: 'Partial update (every 10th)',
          description: 'Update every 10th row in a 1,000 row table',
          operation: 'partial-update',
          expectedRows: 1000
        },
        {
          name: 'Select row',
          description: 'Select and highlight a specific row',
          operation: 'select-row'
        },
        {
          name: 'Swap rows',
          description: 'Swap the position of two rows',
          operation: 'swap-rows'
        },
        {
          name: 'Remove row',
          description: 'Remove a single row from the table',
          operation: 'remove-row'
        },
        {
          name: 'Create 10,000 rows',
          description: 'Create a large table with 10,000 rows',
          operation: 'create-many-rows',
          expectedRows: 10000
        },
        {
          name: 'Append to large table',
          description: 'Append 1,000 rows to an existing 10,000 row table',
          operation: 'append-rows',
          expectedRows: 1000
        },
        {
          name: 'Clear rows',
          description: 'Clear all rows from the table',
          operation: 'clear-rows'
        }
      ]
    };
  }

  async runSingleTest(
    frameworkName: string, 
    test: BenchmarkTest,
    testData?: RowData[]
  ): Promise<BenchmarkResult> {
    const impl = this.implementations.get(frameworkName);
    if (!impl) {
      throw new Error(`Framework implementation not found: ${frameworkName}`);
    }

    const data = testData || generateRowData(test.expectedRows || 1000);
    let operation: () => Promise<void>;

    switch (test.operation) {
      case 'create-rows':
        operation = () => impl.createRows(test.expectedRows || 1000);
        break;
      case 'replace-all':
        operation = () => impl.replaceAll(data);
        break;
      case 'partial-update':
        const partialData = data.map((row, i) => 
          i % 10 === 0 ? { ...row, label: `Updated ${row.label}` } : row
        );
        operation = () => impl.partialUpdate(partialData);
        break;
      case 'select-row':
        operation = () => impl.selectRow(data[0]?.id || 'row-0');
        break;
      case 'swap-rows':
        operation = () => impl.swapRows(data[0]?.id || 'row-0', data[1]?.id || 'row-1');
        break;
      case 'remove-row':
        operation = () => impl.removeRow(data[0]?.id || 'row-0');
        break;
      case 'create-many-rows':
        operation = () => impl.createRows(10000);
        break;
      case 'append-rows':
        operation = () => impl.appendRows(generateRowData(1000));
        break;
      case 'clear-rows':
        operation = () => impl.clearRows();
        break;
      default:
        throw new Error(`Unknown test operation: ${test.operation}`);
    }

    const { metrics } = await this.monitor.measureOperation(operation, `${frameworkName}-${test.name}`);

    return {
      testName: test.name,
      framework: frameworkName,
      duration: metrics.duration,
      memoryUsed: metrics.memoryAfter && metrics.memoryBefore 
        ? metrics.memoryAfter - metrics.memoryBefore 
        : undefined,
      timestamp: Date.now(),
      iterations: 1,
      metadata: {
        operation: test.operation,
        expectedRows: test.expectedRows,
        memoryBefore: metrics.memoryBefore,
        memoryAfter: metrics.memoryAfter
      }
    };
  }

  async runBenchmarkSuite(frameworkName: string, suite?: BenchmarkSuite): Promise<BenchmarkResult[]> {
    const testSuite = suite || this.createStandardSuite();
    const results: BenchmarkResult[] = [];

    console.log(`Running benchmark suite for ${frameworkName}...`);

    if (testSuite.setup) {
      await testSuite.setup();
    }

    for (const test of testSuite.tests) {
      console.log(`  Running: ${test.name}`);
      
      const testResults: BenchmarkResult[] = [];
      
      for (let i = 0; i < testSuite.iterations; i++) {
        try {
          const result = await this.runSingleTest(frameworkName, test);
          testResults.push(result);
          
          // Small delay between iterations
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error in ${test.name} (iteration ${i + 1}):`, error);
        }
      }

      if (testResults.length > 0) {
        // Calculate average result for multiple iterations
        const durations = testResults.map(r => r.duration);
        const stats = calculateStatistics(durations);
        
        const avgResult: BenchmarkResult = {
          ...testResults[0],
          duration: stats.mean,
          iterations: testSuite.iterations,
          metadata: {
            ...testResults[0].metadata,
            stdDev: stats.stdDev,
            min: stats.min,
            max: stats.max,
            allResults: testResults
          }
        };
        
        results.push(avgResult);
      }
    }

    if (testSuite.teardown) {
      await testSuite.teardown();
    }

    // Store results
    if (!this.results.has(frameworkName)) {
      this.results.set(frameworkName, []);
    }
    this.results.get(frameworkName)!.push(...results);

    return results;
  }

  async runComparison(frameworkNames: string[], suite?: BenchmarkSuite): Promise<ComparisonResult> {
    const allResults = new Map<string, BenchmarkResult[]>();
    
    for (const framework of frameworkNames) {
      if (!this.implementations.has(framework)) {
        console.warn(`Framework ${framework} not registered, skipping...`);
        continue;
      }
      
      const results = await this.runBenchmarkSuite(framework, suite);
      allResults.set(framework, results);
    }

    // Calculate statistics across frameworks
    const testNames = Array.from(allResults.values())[0]?.map(r => r.testName) || [];
    let fastest = '';
    let slowest = '';
    let fastestTime = Infinity;
    let slowestTime = 0;

    for (const [framework, results] of allResults) {
      const totalTime = results.reduce((sum, result) => sum + result.duration, 0);
      if (totalTime < fastestTime) {
        fastestTime = totalTime;
        fastest = framework;
      }
      if (totalTime > slowestTime) {
        slowestTime = totalTime;
        slowest = framework;
      }
    }

    return {
      frameworks: Array.from(allResults.keys()),
      results: allResults,
      statistics: {
        fastest,
        slowest
      }
    };
  }

  getResults(frameworkName?: string): BenchmarkResult[] {
    if (frameworkName) {
      return this.results.get(frameworkName) || [];
    }
    
    const allResults: BenchmarkResult[] = [];
    for (const results of this.results.values()) {
      allResults.push(...results);
    }
    return allResults;
  }

  clearResults(frameworkName?: string) {
    if (frameworkName) {
      this.results.delete(frameworkName);
    } else {
      this.results.clear();
    }
    this.monitor.clearMeasurements();
  }

  destroy() {
    this.monitor.destroy();
    this.results.clear();
    
    // Cleanup all implementations
    for (const impl of this.implementations.values()) {
      impl.cleanup();
    }
    this.implementations.clear();
  }
}