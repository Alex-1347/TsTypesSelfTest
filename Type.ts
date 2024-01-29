console.log(`
--- 1 --- enum definition
`)
enum Color { red, blue };

console.log(`
--- 2 --- TS types: literal, enum, js bigint, arrow function type, tuple, reference to function, online function reference definition, readonly, three more types see later
`)
//An object in JavaScript is a key/value map, type is describe it
type T = {
    sarr: string[],
    lit: 'a' | 'b',          // literal type
    c: Color,                // enum type
    num: bigint,             // js bigint
    opt?: Date,              // Ts Date is not the same as JS date, question mark is optional property
    arr: (x: Date) => Date,  // arrow function type
    tupl: [number, string],  // tuple, Tuple Types, A tuple type is another sort of Array type that knows exactly how many elements it contains, and exactly which types it contains at specific positions.
    ref: Function,           // reference to function
    f(z: number[]): void,    // ref to function
    readonly body: string,   // readonly type, it won’t change any behavior at runtime
    // tree more type - anonomus signature, callable, newable mention below
}

console.log(`
--- 3 --- implements types: private props, constructor
`)

class A implements T {
    #private: Function;
    constructor(x: Function) { this.#private = x };
    opt?: Date;
    static opt?: Date;
    sarr: string[] = ['1'];
    lit: 'a' | 'b' = "b";
    c!: Color;
    num!: bigint;
    tupl!: [number, string];
    ref!: Function;
    f(z: number[]): void {
        A.opt = new Date(z[0], z[1], z[2])
    };
    body!: '';
    arr!: (x: Date) => Date;
}

console.log(`
--- 4 --- create class instance, use TS BigInt, set reference to function
`)

const B = new A(() => 1)

B.f = (_el: any): number => { return 1 } //_mean variable not need
B.c = Color.blue
B.tupl = [1, 'w']
B.num = BigInt(true)

console.log(`
--- 5 --- two way object dumping (JSON.stringify + Object.Keys) and replacer function to serialise bigint
`)

console.log(JSON.stringify(B, (_: any, v: any) => typeof v === 'bigint' ? v.toString() : v))

console.log(`
--- 6 --- keyof T as type for computed property type definition, Object.keys().ForEach(()=>{})
`)

Object.keys(B).forEach((v, i) => console.log(i, v, B[v as keyof T]))

console.log(`
--- 7 --- hack using KeyOf with Index Signatures with type Any
`)

type hack = { [key: string]: any; } & T
const H: hack = B
Object.keys(H).forEach((v, i) => console.log(i, v, H[v]))

console.log(`
--- 8 --- using Map and String,Join to colect all object keys
`)

let values = Object.keys(H).map((v, i) => H[v])
console.log(values.join(";"))

console.log(`
--- 9 --- Object.values() is part of ES2017
`)

Object.values(H).forEach((v, i) => console.log(i, Object.keys(H)[i], v))

console.log(`
--- 10 --- assembly array of object properties with Map abd using TypeOf and KeyOf, Type Capturing when object type is unknown
`)

type T1 = typeof B;
const PropArr1: Array<Object> = Object.keys(B).map((v, i) => {
    return { key: v, value: B[v as keyof T1] }
});

PropArr1.forEach((x, i) => console.log(i, x))

console.log(`
--- 11 --- indexed property, this type accept any string as key and any number as value
`)

type T2 = {
    [key: string]: number
}
const Obj: T2 = { 'a': 1, 'b': 2 }
console.log(Obj)

console.log(`
--- 12 --- define type with anonymous function signature, at common type is the same as interface
`)

type Func1 = {
    (x: string, y: string): boolean;
}

interface Func2 {
    (a: number, b: number): bigint;
}

let search: Func1;
let mult: Func2;

search = function (src, sub) {
    let result = src.search(sub);
    return result > -1;
};

mult = (one, two) => BigInt(one * two)

console.log(search('abc', 'a'), mult(20, 30))

console.log(`
--- 13 --- combine two two types with &, Error object, BigInt literals are not available when targeting lower than ES2020
`)

//combine two interface
type Func3 = { m: Error } & T
let f3: Func3 = {
    m: new Error,
    sarr: ['1'],
    lit: "b",
    c: Color.blue,
    num: 1n,             //BigInt literals are not available when targeting lower than ES2020
    tupl: [5, 's'],
    ref: Function,
    f(z: number[]): void {
        A.opt = new Date(z[0], z[1], z[2])
    },
    body: '',
    arr: (x: Date) => new Date(x)
}
console.log(f3)

console.log(`
--- 14 --- callable type mean inteface of arrow function, overloading interface, declare mean external declaration
`)

// callable type + overloading interface + external declaration
type callableType = {
    (foo: string, bar?: number, ...others: boolean[]): number;
    (foo: number, bar?: number, ...others: boolean[]): number; //Overloaded interface
}

const foo1 = (x: string) => 1
const foo2 = (x: number) => 2
const bar1 = foo1('');            //bar is inferred as a string
const bar2 = foo2(1);             //bar is inferred as a number

console.log(bar1, bar2)

console.log(`
--- 15 --- newable type mean inteface require new instance
`)

// newable type - require new
type newableType = {
    new(foo: string, bar?: number, ...others: boolean[]): number;
}
declare const fo: newableType; //declare mean that variable exists already, and therefore can be referenced by external code

const bar3 = new Function("")
console.log(bar3)


console.log(`
--- 16 --- If you want to enforce only certain newables, you can specify the constructor's return type
`)

interface Newable {
    errorConstructor: new (...args: any) => Error; // <- put here whatever Base Class you want
}

class NotError { }
class MyError extends Error { }
/*
const errorCreator1: Newable = {
    errorConstructor: NotError, // Type 'typeof NotError' is missing the following properties from type 'typeof AnyError': captureStackTrace, stackTraceLimitts
};
*/
const errorCreator2: Newable = {
    errorConstructor: MyError, // OK
};

console.log(errorCreator2)

console.log(`
--- 17 --- with infer keyword the compiler ensures that you have declared all type variables explicitly https://stackoverflow.com/questions/60067100/why-is-the-infer-keyword-needed-in-typescript
`)

type MyT<T> = T extends infer R ? R : never;
type Tx = MyT<{ b: string }> // T1 is { b: string; }

//infer R shadows type references of an equally-named type declaration R:

type R = { a: number }
type MyType4<T> = T extends infer R ? R : never;
type T4 = MyType4<{ b: string }> // { b: string; }


console.log(`
--- 18 --- You can't define a static property on an interface in TypeScript. Because Date is an interface in TypeScript, you can't extend it with a class using the extends keyword, but can provide a MinValue property on the prototype. Static properties are usually placed on the (global) constructor for the object, whereas the "interface" keyword applies to instances of the object.
`)

class RichDate {
    public static MinValue = new Date();
}
interface Date {
    MinValue: Date;
}

Date.prototype.MinValue = new Date(0);

var x = new Date();
console.log(x.MinValue);

console.log(`
--- 19 --- Type Inference, When a type inference is made from several expressions, the types of those expressions are used to calculate a “best common type”
`)

let var3 = [0, 1, null];
type T3 = typeof var3

console.log(`
--- 20 --- Type Aliases. Type Aliases can be used for primitives like string or more complex types such as objects and arrays:
`)
type CarYear = number
type CarType = string
type CarModel = string
type Car = {
    year: CarYear,
    type: CarType,
    model: CarModel
}
const carYear: CarYear = 2001
const carType: CarType = "Toyota"
const carModel: CarModel = "Corolla"
const car: Car = {
    year: carYear,
    type: carType,
    model: carModel
};

console.log(`
--- 21 --- Interfaces are similar to type aliases, except they only apply to object types. Interfaces can extend each other's definition.
`)

interface Rectangle {
    height: number,
    width: number
}

const rectangle: Rectangle = {
    height: 20,
    width: 10
};

console.log(`
--- 22 --- TypeScript has special types that may not refer to any specific type of data. any/unknown/never/undefined & null https://www.w3schools.com/typescript/typescript_special_types.php
`)

// 1. any

let v: any = true;
v = "string";
Math.round(v);

// 2. unknown is a similar, but safer alternative to any

let w: unknown = 1;
w = "string"; // no error
w = {
    runANonExistentMethod: () => {
        console.log("I think therefore I am");
    }
} as { runANonExistentMethod: () => void }
// How can we avoid the error for the code commented out below when we don't know the type?
// w.runANonExistentMethod(); // Error: Object is of type 'unknown'.
if (typeof w === 'object' && w !== null) {
    (w as { runANonExistentMethod: Function }).runANonExistentMethod();
}
// Although we have to cast multiple times we can do a check in the if to secure our type and have a safer casting 

// 3. never effectively throws an error whenever it is defined.
let uu: never

// 4. undefined and null are types that refer to the JavaScript primitives undefined and null respectively

let u1: undefined = undefined;
let u2: null = null;

console.log(`
--- 23 --- async function Promise
`)

let gt = async function getFavoriteNumber(): Promise<number> {
    return 26;
}

let tt = typeof gt

console.log(`
--- 24 --- type assetions 
`)

const myCanvas1 = document.getElementById("main_canvas") as HTMLCanvasElement;
const myCanvas2 = <HTMLCanvasElement>document.getElementById("main_canvas");

console.log(`
--- 25 --- Literal Types, In addition to the general types string and number, we can refer to specific strings and numbers in type positions.
`)

function compare(a: string, b: string): -1 | 0 | 1 {
    return a === b ? 0 : a > b ? 1 : -1;
}
