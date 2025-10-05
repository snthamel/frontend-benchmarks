export const generateRowData = (count) => {
    const adjectives = ['Amazing', 'Brilliant', 'Creative', 'Dynamic', 'Elegant', 'Fantastic', 'Gorgeous', 'Incredible'];
    const nouns = ['Widget', 'Component', 'Element', 'Module', 'System', 'Framework', 'Library', 'Package'];
    return Array.from({ length: count }, (_, i) => ({
        id: `row-${i}`,
        label: `${adjectives[i % adjectives.length]} ${nouns[i % nouns.length]} ${i}`,
        value: Math.floor(Math.random() * 1000)
    }));
};
export const formatDuration = (ms) => {
    if (ms < 1)
        return `${(ms * 1000).toFixed(2)}μs`;
    if (ms < 1000)
        return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
};
export const formatMemory = (bytes) => {
    if (bytes < 1024)
        return `${bytes}B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(2)}KB`;
    if (bytes < 1024 * 1024 * 1024)
        return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
};
export const calculateStatistics = (values) => {
    if (values.length === 0)
        return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0 };
    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return {
        mean,
        median,
        stdDev,
        min: sorted[0],
        max: sorted[sorted.length - 1]
    };
};
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};
export const throttle = (func, delay) => {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    };
};
//# sourceMappingURL=index.js.map