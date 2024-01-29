//https://www.Tscriptlang.org/docs/handbook/utility-Ts.html#recordkeys-type
//TypeScript provides several utility types to facilitate common type transformations.
// Awaited<T>
// Partial<T>
// Required<T>
// Readonly<T>
// Record<Keys, T>
// Pick<T, Keys>
// Omit<T, Keys>
// Exclude<UnionT, ExcludedMembers>
// Extract<T, Union>
// NonNullable<T>
// Parameters<T>
// ConstructorParameters<T>
// ReturnType<T>
// InstanceT<T>
// ThisParameterT<T>
// OmitThisParameter<T>
// ThisType<T>
// Intrinsic String Manipulation Ts
//     Uppercase<StringT>
//     Lowercase<StringT>
//     Capitalize<StringT>
//     Uncapitalize<StringT>

console.log(`
--- Awaited<Type> --- This type is meant to model operations like await in async functions, or the .then() method on Promise
`)

type A1 = Awaited<Promise<string>>;

type B1 = Awaited<Promise<Promise<number>>>;

type C1 = Awaited<boolean | Promise<number>>;

console.log(`
--- Partial<Type> --- Constructs a type with all properties of Type set to optional. This utility will return a type that represents all subsets of a given type.
`)

interface Todo {
    title: string;
    description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
    return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
    title: "organize desk",
    description: "clear clutter",
};

const todo2 = updateTodo(todo1, {
    description: "throw out trash",
});

console.log(`
--- Required<Type> --- Constructs a type consisting of all properties of Type set to required.The opposite of Partial.
`)

interface Props1 {
    a?: number;
    b?: string;
}

const obj1: Props1 = { a: 5 };

const obj2: Required<Props1> = { a: 5, b: '' };

console.log(`
--- Readonly<Type> --- Constructs a type with all properties of Type set to readonly, meaning the properties of the constructed type cannot be reassigned.
`)

interface Todo1 {
    title: string;
}

const todo3: Readonly<Todo1> = {
    title: "Delete inactive users",
};

//todo3.title = "Hello"; impossible

console.log(`
--- Record<Keys, Type> --- Constructs an object type whose property keys are Keys and whose property values are Type. 
`)

interface CatInfo {
    age: number;
    breed: string;
}

type CatName = "miffy" | "boris" | "mordred";

const cats: Record<CatName, CatInfo> = {
    miffy: { age: 10, breed: "Persian" },
    boris: { age: 5, breed: "Maine Coon" },
    mordred: { age: 16, breed: "British Shorthair" },
};

console.log(cats.boris);

console.log(`
--- Pick<Type, Keys> --- Constructs a type by picking the set of properties Keys (string literal or union of string literals) from Type
`)

interface Todo2 {
    title: string;
    description: string;
    completed: boolean;
}

type TodoPreview = Pick<Todo2, "title" | "completed">;

const todo4: TodoPreview = {
    title: "Clean room",
    completed: false,
};

console.log(todo4);

console.log(`
--- Omit<Type, Keys> --- Constructs a type by picking all properties from Type and then removing Keys (string literal or union of string literals). The opposite of Pick.
`)

interface Todo5 {
    title: string;
    description: string;
    completed: boolean;
    createdAt: number;
}

type TodoPreview5 = Omit<Todo5, "description">;

const todo5: TodoPreview5 = {
    title: "Clean room",
    completed: false,
    createdAt: 1615544252770,
};

console.log(todo5);

type TodoInfo5 = Omit<Todo5, "completed" | "createdAt">;

const todoInfo5: TodoInfo5 = {
    title: "Pick up kids",
    description: "Kindergarten closes at 5pm",
};

console.log(todoInfo5);

console.log(`
--- Exclude<UnionType, ExcludedMembers> --- Constructs a type by excluding from UnionType all union members that are assignable to ExcludedMembers.
`)

type T0 = Exclude<"a" | "b" | "c", "a">;

type T6 = Exclude<"a" | "b" | "c", "a" | "b">;

type T7 = Exclude<string | number | (() => void), Function>;

type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "square"; x: number }
    | { kind: "triangle"; x: number; y: number };

type T8 = Exclude<Shape, { kind: "circle" }>

console.log(`
--- Extract<Type, Union> --- Constructs a type by extracting from Type all union members that are assignable to Union
`)

type T10 = Extract<"a" | "b" | "c", "a" | "f">;

type T11 = Extract<string | number | (() => void), Function>;

type Shape1 =
    | { kind: "circle"; radius: number }
    | { kind: "square"; x: number }
    | { kind: "triangle"; x: number; y: number };

type T12 = Extract<Shape, { kind: "circle" }>

console.log(`
--- NonNullable<Type> --- Constructs a type by excluding null and undefined from Type.
`)

type T13 = NonNullable<string | number | undefined>;

type T14 = NonNullable<string[] | null | undefined>;

console.log(`
--- Parameters<Type> --- Constructs a tuple type from the types used in the parameters of a function type Type.
`)

declare function f1(arg: { a: number; b: string }): void;
 
type T15 = Parameters<() => string>;
     
type T16 = Parameters<(s: string) => void>;
     
type T17 = Parameters<<T>(arg: T) => T>;
     
type T18 = Parameters<typeof f1>;
     
type T19= Parameters<any>;
     
type T20 = Parameters<never>;

console.log(`
--- ConstructorParameters<Type> --- Constructs a tuple or array type from the types of a constructor function type. It produces a tuple type with all the parameter types (or the type never if Type is not a function).
`)

type T21 = ConstructorParameters<ErrorConstructor>;

type T22 = ConstructorParameters<FunctionConstructor>;

type T23 = ConstructorParameters<RegExpConstructor>;

class C2 {
  constructor(a: number, b: string) {}
}
type T24 = ConstructorParameters<typeof C2>;

type T25 = ConstructorParameters<any>;

console.log(`
--- ReturnType<Type> ---  Constructs a type consisting of the return type of function Type.
`)

declare function f2(): { a: number; b: string };
 
type T26 = ReturnType<() => string>;
 
type T27 = ReturnType<(s: string) => void>;

type T28 = ReturnType<<T>() => T>;

type T29 = ReturnType<<T extends U, U extends number[]>() => T>;

type T30 = ReturnType<typeof f2>;

type T31 = ReturnType<any>;

type T32 = ReturnType<never>;

console.log(`
--- InstanceType<Type> --- Constructs a type consisting of the instance type of a constructor function in Type.
`)

class C3 {
    x = 0;
    y = 0;
}
   
type T33 = InstanceType<typeof C3>;

type T34 = InstanceType<any>;

type T35 = InstanceType<never>;

console.log(`
--- ThisParameterType<Type> --- Extracts the type of the this parameter for a function type, or unknown if the function type has no this parameter.
`)

function toHex(this: Number) {
    return this.toString(16);
}
   
function numberToString(n: ThisParameterType<typeof toHex>) {
    return toHex.apply(n);
}

console.log(`
--- OmitThisParameter<Type> --- Removes the this parameter from Type
`)

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);
 
console.log(fiveToHex());

console.log(`
--- ThisType<Type> --- This utility does not return a transformed type. Instead, it serves as a marker for a contextual this type. noImplicitThis flag must be enabled to use this utility.
`)

type ObjectDescriptor<D, M> = {
    data?: D;
    methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};
   
function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
    let data: object = desc.data || {};
    let methods: object = desc.methods || {};
    return { ...data, ...methods } as D & M;
}
   
let obj3 = makeObject({
    data: { x: 0, y: 0 },
    methods: {
      moveBy(dx: number, dy: number) {
        this.x += dx; // Strongly typed this
        this.y += dy; // Strongly typed this
      },
    },
});
   
obj3.x = 10;
obj3.y = 20;
obj3.moveBy(5, 5);

// Intrinsic String Manipulation Types
// Uppercase<StringType>
// Lowercase<StringType>
// Capitalize<StringType>
// Uncapitalize<StringType>