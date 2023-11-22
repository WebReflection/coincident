export const TypedArray: object | null;
export function augment(descriptor: any, how: any): any;
export function asEntry(transform: any): (value: any) => any;
export function symbol(value: any): any;
export function transform(o: any): any;
export const assign: {
    <T extends {}, U>(target: T, source: U): T & U;
    <T_1 extends {}, U_1, V>(target: T_1, source1: U_1, source2: V): T_1 & U_1 & V;
    <T_2 extends {}, U_2, V_1, W>(target: T_2, source1: U_2, source2: V_1, source3: W): T_2 & U_2 & V_1 & W;
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
