import type { 
  BenchmarkResult, 
  BenchmarkSuite, 
  BenchmarkTest, 
  FrameworkImplementation, 
  BenchmarkMetrics,
  ComparisonResult,
  RowData
} from '@benchmark/types';
import { generateRowData, calculateStatistics } from '@benchmark/utils';

export class PerformanceMonitor {
  private memorySupported: boolean;
  private observer?: PerformanceObserver;
  private measurements: PerformanceEntry[] = [];

  constructor() {
    this.memorySupported = 'measureUserAgentSpecificMemory' in performance;
    this.setupPerformanceObserver();
  }

  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        this.measurements.push(...list.getEntries());
      });
      
      try {
        this.observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
      } catch (e) {
        console.warn('Performance Observer not fully supported', e);
      }
    }
  }

  async measureMemory(): Promise<number | undefined> {
    if (!this.memorySupported) return undefined;
    
    try {
      // @ts-ignore - This is experimental API
      const result = await performance.measureUserAgentSpecificMemory?.();
      return result?.bytes || (performance as any).memory?.usedJSHeapSize;
    } catch (e) {
      // Fallback to legacy API
      return (performance as any).memory?.usedJSHeapSize;
    }
  }

  async measureOperation<T>(
    operation: () => Promise<T> | T,
    label: string
  ): Promise<{ result: T; metrics: BenchmarkMetrics }> {
    const memoryBefore = await this.measureMemory();
    
    performance.mark(`${label}-start`);
    const startTime = performance.now();
    
    const result = await operation();
    
    const endTime = performance.now();
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const memoryAfter = await this.measureMemory();
    const duration = endTime - startTime;

    return {
      result,
      metrics: {
        duration,
        memoryBefore,
        memoryAfter,
        memoryPeak: memoryAfter && memoryBefore ? Math.max(memoryAfter, memoryBefore) : undefined
      }
    };
  }

  clearMeasurements() {
    this.measurements = [];
    if (performance.clearMarks) performance.clearMarks();
    if (performance.clearMeasures) performance.clearMeasures();
  }

  destroy() {
    this.observer?.disconnect();
    this.clearMeasurements();
  }
}