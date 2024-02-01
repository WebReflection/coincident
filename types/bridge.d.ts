export let SharedArrayBuffer: SharedArrayBufferConstructor;
export const isArray: (arg: any) => arg is any[];
export let notify: {
    (typedArray: Int32Array, index: number, count?: number | undefined): number;
    (typedArray: BigInt64Array, index: number, count?: number | undefined): number;
};
export let postPatched: any;
export let wait: {
    (typedArray: Int32Array, index: number, value: number, timeout?: number | undefined): "ok" | "not-equal" | "timed-out";
    (typedArray: BigInt64Array, index: number, value: bigint, timeout?: number | undefined): "ok" | "not-equal" | "timed-out";
};
export let waitAsync: {
    (typedArray: Int32Array, index: number, value: number, timeout?: number | undefined): {
        async: false;
        value: "not-equal" | "timed-out";
    } | {
        async: true;
        value: Promise<"ok" | "timed-out">;
    };
    (typedArray: BigInt64Array, index: number, value: bigint, timeout?: number | undefined): {
        async: false;
        value: "not-equal" | "timed-out";
    } | {
        async: true;
        value: Promise<"ok" | "timed-out">;
    };
};
