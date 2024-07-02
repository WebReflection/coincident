export const TypedArray: object | null;
export function augment(descriptor: any, how: any): any;
export function asEntry(transform: any): (value: any) => any;
export function symbol(value: any): any;
export function transform(o: any): any;
export const assign: {
    <T extends {}, U>(target: T, source: U): T & U;
    <T extends {}, U, V>(target: T, source1: U, source2: V): T & U & V;
    <T extends {}, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    (target: object, ...sources: any[]): any;
};
export const create: {
    (o: object | null): any;
    (o: object | null, properties: PropertyDescriptorMap & ThisType<any>): any;
};
export const defineProperty: typeof Reflect.defineProperty;
export const deleteProperty: typeof Reflect.deleteProperty;
export const getOwnPropertyDescriptor: typeof Reflect.getOwnPropertyDescriptor;
export const getPrototypeOf: typeof Reflect.getPrototypeOf;
export const isExtensible: typeof Reflect.isExtensible;
export const ownKeys: typeof Reflect.ownKeys;
export const preventExtensions: typeof Reflect.preventExtensions;
export const set: typeof Reflect.set;
export const setPrototypeOf: typeof Reflect.setPrototypeOf;
