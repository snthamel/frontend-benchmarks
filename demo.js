import { BenchmarkRunner } from './packages/core/dist/packages/core/src/index.js';
import { VanillaImplementation } from './packages/vanilla-impl/dist/packages/vanilla-impl/src/index.js';

// Global variables
let benchmarkRunner;
let vanillaImpl;
let isRunning = false;

// Initialize the benchmark system
async function initializeBenchmarks() {
    try {
        benchmarkRunner = new BenchmarkRunner();
        vanillaImpl = new VanillaImplementation('vanilla-container');
        
        benchmarkRunner.registerImplementation(vanillaImpl);
        
        console.log('Benchmark system initialized');
        updateUI();
    } catch (error) {
        console.error('Failed to initialize benchmarks:', error);
        document.getElementById('results-content').innerHTML = 
            `<p style="color: red;">Failed to initialize benchmarks: ${error.message}</p>`;
    }
}

function updateUI() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.disabled = isRunning;
    });
}

async function runSingleTest(operation) {
    if (isRunning) return;
    
    isRunning = true;
    updateUI();
    
    try {
        const test = {
            name: operation.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: `Test ${operation}`,
            operation: operation,
            expectedRows: operation.includes('many') ? 10000 : 1000
        };

        document.getElementById('results-content').innerHTML = 
            '<p class="loading">Running benchmark...</p>';

        const result = await benchmarkRunner.runSingleTest('Vanilla JS', test);
        displayResults([result]);
        
    } catch (error) {
        console.error('Benchmark failed:', error);
        document.getElementById('results-content').innerHTML = 
            `<p style="color: red;">Benchmark failed: ${error.message}</p>`;
    } finally {
        isRunning = false;
        updateUI();
    }
}

async function runFullSuite() {
    if (isRunning) return;
    
    isRunning = true;
    updateUI();
    
    try {
        document.getElementById('results-content').innerHTML = 
            '<p class="loading">Running full benchmark suite...</p>';

        const results = await benchmarkRunner.runBenchmarkSuite('Vanilla JS');
        displayResults(results);
        
    } catch (error) {
        console.error('Full suite failed:', error);
        document.getElementById('results-content').innerHTML = 
            `<p style="color: red;">Full suite failed: ${error.message}</p>`;
    } finally {
        isRunning = false;
        updateUI();
    }
}

function displayResults(results) {
    if (!results || results.length === 0) {
        document.getElementById('results-content').innerHTML = 
            '<p>No results to display</p>';
        return;
    }

    const tableHTML = `
        <table class="results-table">
            <thead>
                <tr>
                    <th>Test</th>
                    <th>Framework</th>
                    <th>Duration (ms)</th>
                    <th>Memory (KB)</th>
                    <th>Iterations</th>
                </tr>
            </thead>
            <tbody>
                ${results.map(result => `
                    <tr>
                        <td>${result.testName}</td>
                        <td>${result.framework}</td>
                        <td>${result.duration.toFixed(2)}</td>
                        <td>${result.memoryUsed ? (result.memoryUsed / 1024).toFixed(2) : 'N/A'}</td>
                        <td>${result.iterations}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    document.getElementById('results-content').innerHTML = tableHTML;
}

function clearResults() {
    if (isRunning) return;
    
    benchmarkRunner?.clearResults();
    document.getElementById('results-content').innerHTML = 
        '<p class="loading">Run a benchmark to see results...</p>';
}

// Make functions global for onclick handlers
window.runSingleTest = runSingleTest;
window.runFullSuite = runFullSuite;
window.clearResults = clearResults;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeBenchmarks);