# 🚀 Frontend Framework Benchmarks

A comprehensive visual benchmarking tool for comparing performance across modern frontend frameworks. Inspired by [js-framework-benchmark](https://krausest.github.io/js-framework-benchmark/current.html), this project provides real-time performance comparison with visual output.

## 🎯 Features

- **Multi-Framework Support**: React, Vue 3, Svelte, SolidJS, Qwik, and Vanilla JS
- **Real-Time Performance Measurement**: DOM manipulation speed and memory usage
- **Visual Comparison Dashboard**: Interactive charts and statistical analysis
- **Standard Benchmark Suite**: Consistent test operations across all frameworks
- **Extensible Architecture**: Easy to add new frameworks and test cases

## 🏗️ Architecture

### Monorepo Structure

```
frontend-benchmarks/
├── packages/
│   ├── core/              # Shared benchmark engine
│   ├── react-impl/        # React implementation
│   ├── vue-impl/          # Vue 3 implementation
│   ├── svelte-impl/       # Svelte implementation
│   ├── solid-impl/        # SolidJS implementation
│   ├── qwik-impl/         # Qwik implementation
│   ├── vanilla-impl/      # Vanilla JS baseline ✅
│   └── dashboard/         # Results visualization
├── apps/
│   └── web/               # Main orchestrator app
├── shared/
│   ├── types/             # TypeScript definitions ✅
│   └── utils/             # Common utilities ✅
└── index.html             # Quick test interface ✅
```

### Core Components

- **Benchmark Engine**: Framework-agnostic performance measurement
- **Performance Monitor**: Memory usage and execution time tracking
- **Framework Implementations**: Standardized interface for each framework
- **Results Dashboard**: Visual comparison and statistical analysis

## 📊 Benchmark Tests

The tool measures performance across these standard operations:

| Test | Description | Row Count |
|------|-------------|-----------|
| **Create Rows** | Create 1,000 rows in a table | 1,000 |
| **Replace All** | Replace all existing rows with new data | 1,000 |
| **Partial Update** | Update every 10th row | 1,000 |
| **Select Row** | Highlight a specific row | - |
| **Swap Rows** | Swap positions of two rows | - |
| **Remove Row** | Remove a single row | - |
| **Create Many** | Create large table | 10,000 |
| **Append Rows** | Add rows to existing large table | +1,000 |
| **Clear Rows** | Remove all rows from table | - |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 8+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend-benchmarks

# Install dependencies
npm install

# Build all packages
npm run build
```

### Running the Demo

**Quick Start - Browser Test:**
```bash
# Serve with a local server (required for ES modules)
python -m http.server 8000
# or
npx serve .
```

Then visit `http://localhost:8000/index.html` or `http://localhost:8000/test.html`

**Full Demo Interface:**
```bash
# Open the full demo in your browser  
open index.html
```

## 🛠️ Development

### Building Packages

```bash
# Build all packages (TypeScript compilation fixed ✅)
npm run build

# Build specific package
cd packages/core && npm run build
```

### Recent Fixes Applied

**TypeScript Build System:**
- ✅ Fixed `"noEmit": true` preventing JavaScript generation
- ✅ Updated all package tsconfigs to override with `"noEmit": false`
- ✅ Added `.js` extensions to ES module imports for browser compatibility
- ✅ All packages now compile successfully to `dist/` directories

**Import Path Resolution:**
- ✅ Fixed relative import paths in demo files
- ✅ Updated demo.js to use correct dist paths: `./packages/core/dist/packages/core/src/index.js`
- ✅ Added browser-compatible ES module imports

### Adding a New Framework

1. Create a new package directory:
   ```bash
   mkdir packages/your-framework-impl
   ```

2. Implement the `FrameworkImplementation` interface:
   ```typescript
   import type { FrameworkImplementation } from '@benchmark/core';
   
   export class YourFrameworkImplementation implements FrameworkImplementation {
     name = 'Your Framework';
     version = '1.0.0';
     
     async createRows(count: number): Promise<void> {
       // Implementation
     }
     
     // ... other required methods
   }
   ```

3. Register with the benchmark runner:
   ```typescript
   import { BenchmarkRunner } from '@benchmark/core';
   import { YourFrameworkImplementation } from '@benchmark/your-framework-impl';
   
   const runner = new BenchmarkRunner();
   const impl = new YourFrameworkImplementation('container-id');
   runner.registerImplementation(impl);
   ```

### Running Tests

```bash
# Run all tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📈 Framework Comparison

### Performance Characteristics

| Framework | Strengths | Key Features |
|-----------|-----------|--------------|
| **React** | Virtual DOM, Ecosystem | Reconciliation, Hooks |
| **Vue 3** | Reactivity System | Proxy-based, Composition API |
| **Svelte** | Compile-time Optimization | No runtime overhead |
| **SolidJS** | Fine-grained Reactivity | No virtual DOM |
| **Qwik** | Resumability | Lazy execution, SSR |
| **Vanilla** | Raw Performance | Direct DOM manipulation |

### Benchmark Focus Areas

- **DOM Manipulation Speed**: Raw performance comparison
- **Memory Efficiency**: Heap usage and garbage collection
- **Bundle Size Impact**: Runtime vs compile-time optimizations
- **Reactivity Overhead**: Fine-grained vs coarse-grained updates
- **Hydration Performance**: SSR and resumability (Qwik)

## 🔧 API Reference

### BenchmarkRunner

```typescript
import { BenchmarkRunner } from '@benchmark/core';

const runner = new BenchmarkRunner();

// Register framework implementation
runner.registerImplementation(implementation);

// Run single test
const result = await runner.runSingleTest('React', test);

// Run full benchmark suite
const results = await runner.runBenchmarkSuite('React');

// Compare multiple frameworks
const comparison = await runner.runComparison(['React', 'Vue', 'Svelte']);
```

### FrameworkImplementation Interface

```typescript
interface FrameworkImplementation {
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
```

## 📋 Current Status

### ✅ Completed
- [x] Monorepo structure with Turbo
- [x] Core benchmark engine with TypeScript build system
- [x] Performance monitoring utilities  
- [x] TypeScript type definitions with proper ES module support
- [x] Vanilla JS implementation (baseline) - **Working**
- [x] Demo interface with quick test HTML
- [x] **Fixed TypeScript compilation issues** (noEmit configs)
- [x] **Fixed ES module import paths** (.js extensions)
- [x] **Working build system** - all packages compile successfully

### 🚧 In Progress  
- [x] React implementation - **Started**
- [ ] Vue 3 implementation
- [ ] Svelte implementation
- [ ] SolidJS implementation
- [ ] Qwik implementation

### 📅 Planned
- [ ] Complete React implementation
- [ ] Visual dashboard with charts
- [ ] Framework switcher UI  
- [ ] Results export functionality
- [ ] Memory profiling visualization
- [ ] Bundle size analysis
- [ ] CI/CD benchmark automation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-framework`
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

### Framework Implementation Guidelines

- Follow the `FrameworkImplementation` interface exactly
- Use framework-specific best practices and optimizations
- Include proper error handling
- Add comprehensive comments for complex optimizations
- Ensure cleanup method properly destroys components

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Inspired by [js-framework-benchmark](https://krausest.github.io/js-framework-benchmark/) by Stefan Krause
- Thanks to all framework maintainers for their excellent work
- Performance testing methodology based on industry best practices

## 🔧 Troubleshooting

### Common Issues

**TypeScript Build Errors:**
- All TypeScript build issues have been resolved ✅
- Packages now generate JavaScript files in `dist/` directories
- ES module imports use `.js` extensions for browser compatibility

**Demo Not Loading:**
- Ensure you're serving files via HTTP (not `file://` protocol)
- Use `python -m http.server 8000` or `npx serve .`
- Check browser console for any import/module errors

**Import Path Issues:**
- All import paths have been updated to use the correct dist structure
- Demo files use direct paths: `./packages/core/dist/packages/core/src/index.js`

---

**Ready to benchmark? Start a local server and visit `http://localhost:8000/index.html`!** 🎯
