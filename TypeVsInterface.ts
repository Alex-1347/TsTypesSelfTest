console.log(`
--- 1 --- interface vs type
`)

//interface vs types (2018)
//https://stackoverflow.com/questions/37233735/interfaces-vs-types-in-typescript/52682220#52682220
//
//Type  Interface 
//✅    ✅      Can describe functions 	
//✅    ✅      Can describe constructors 	
//✅    ✅      Can describe tuples 	
//✅    ✅      Can be mapped over with mapped types 	
//✅    ⚠️      Can intersect another one of its kind 	
//✅    🚫      Can create a union with another one of its kind 	
//✅    🚫      Can be used to create mapped types 	
//✅    🚫      Expands in error messages and logs 	
//⚠️ 	✅      Classes can implement it (implements) 	
//⚠️ 	✅      Can be recursive 	
//⚠️ 	✅      Interfaces can extend it 	
//🚫 	✅      Classes can extend it 	
//🚫 	✅      Can be augmented 	
//
//for 2021 version (summary)
//
//When to use type:
//
//    Use type when defining an alias for primitive types (string, boolean, number, bigint, symbol, etc)
//    Use type when defining tuple types
//    Use type when defining function types
//    Use type when defining a union
//    Use type when trying to overload functions in object types via composition
//    Use type when needing to take advantage of mapped types
//
//When to use interface:
//
//    Use interface for all object types where using type is not required (see above)
//    Use interface when you want to take advantage of declaration merging.


//Only type can be used to alias a primitive:
type Primitive = number | string | boolean | null | undefined
type Nullish = null | undefined;
type Fruit = 'apple' | 'pear' | 'orange';
type Num = number | bigint;

//Tuples can only be typed via the type keyword:
type row = [colOne: number, colTwo: string];

//Functions can be typed by both the type and interface keywords:
interface Point1 {
    x: number;
    y: number;
}

interface SetPoint1 {
    (x: number, y: number): void;
}

type Point2 = {
    x: number;
    y: number;
};

type SetPoint2 = (x: number, y: number) => void;

//Union types can only be achieved with the type keyword:
type Vegetable = 'broccoli' | 'carrot' | 'lettuce';
type HealthyFoods = Fruit | Vegetable;

//types and inerface composition vith the same JS key/value , declaration can Merging (see above example of hacking keyof)

interface NumLogger {
    log: (val: number) => void;
}
type StrAndNumLogger1 = NumLogger & {
    log: (val: string) => void;
}

const logger: StrAndNumLogger1 = {
    log: (val: string | number) => console.log(val)
}

logger.log(1)
logger.log('hi')

console.log(`
--- 2 --- Use the type when you are transforming multiple types into a single generic type. Nullable<T> ,  NonNull<T>, Never type and ternary operator with types
`)

//Generic Transformations. Use the type when you are transforming multiple types into a single generic type.
type Nullable<T> = T | null | undefined
type NonNull<T> = T extends (null | undefined) ? never : T

console.log(`
--- 3 --- Mapped object types possible obly with Type
`)

type FruitCount = {
    [key in Fruit]: number;
}

const fruits: FruitCount = {
    apple: 2,
    orange: 3,
    pear: 0
};

console.log(fruits)

console.log(`
--- 4 --- The key difference pointed out in the documentation is that Interface can be reopened to add new property but Type alias cannot be reopened to add new property 
`)

interface I1 {
    name: string
}

interface I1 {
    age: number
}

let var1: I1 = { name: 'a', age: 10 }
console.log(var1)

console.log(`
--- 5 --- Difference types and intefaces in indexing.  https://stackoverflow.com/questions/37233735/interfaces-vs-types-in-typescript
`)

interface MyInterface {
    foobar: string;
}

type MyType = {
    foobar: string;
}

const exampleInterface: MyInterface = { foobar: 'hello world' };
const exampleType: MyType = { foobar: 'hello world' };

//Construct a type with a set of properties K of type T
//type Record<K extends string | number | symbol, T> = { [P in K]: T; }
let record: Record<string, string> = {};

record = exampleType;      // Compiles
//record = exampleInterface; // Index signature is missing

console.log(`
--- 6 --- Index signature is missing in type (only on interfaces, not on type alias)  https://github.com/microsoft/TypeScript/issues/15300
`)

interface IndexType {
    [key: string]: string;
}

interface doesNotWork {
    hola: string;
}
type doWorks = { hola: string };

let y: IndexType;

const correctA = { hola: "hello" };
const correctB: doWorks = { hola: "hello" };

//error should be assignable to y
const error: doesNotWork = { hola: "hello " };

y = correctA;
y = correctB;
/**
/* y = error; //Index signature is missing in type 'doesNotWork'
*/
y = { ...error }; //workaround but not equivalent since the instance is not the same
console.log(y, correctA, correctB, error)

console.log(`
--- 7 --- Difference in evaluation 
`)

/**
 * When FirstLevelType is interface 
 */

interface FirstLevelType1<A, Z> {
    _: "typeCheck";
};

type TestWrapperType1<T, U> = FirstLevelType1<T, U>;


const a1: TestWrapperType1<{ cat: string }, { dog: number }> = {
    _: "typeCheck",
};

// {  cat: string; }
type ExtendFirst1 = typeof a1 extends FirstLevelType1<infer T, infer _>
    ? T
    : "not extended";

const a11: ExtendFirst1 = { cat: '' }

console.log(a1, a11)

/**
 * When FirstLevelType is type
 */
type FirstLevelType2<A, Z> = {
    _: "typeCheck";
};

type TestWrapperType2<T, U> = FirstLevelType2<T, U>;


const a2: TestWrapperType2<{ cat: string }, { dog: number }> = {
    _: "typeCheck",
};

// unknown
type ExtendFirst2 = typeof a2 extends FirstLevelType2<infer T, infer _>
    ? T
    : "not extended";

const a21: ExtendFirst2 = { cat: '' }

console.log(a2, a21)
