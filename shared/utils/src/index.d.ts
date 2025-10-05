export declare const generateRowData: (count: number) => Array<{
    id: string;
    label: string;
    value: number;
}>;
export declare const formatDuration: (ms: number) => string;
export declare const formatMemory: (bytes: number) => string;
export declare const calculateStatistics: (values: number[]) => {
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
};
export declare const debounce: <T extends (...args: any[]) => any>(func: T, delay: number) => ((...args: Parameters<T>) => void);
export declare const throttle: <T extends (...args: any[]) => any>(func: T, delay: number) => ((...args: Parameters<T>) => void);
//# sourceMappingURL=index.d.ts.map