console.log(`
--- 1 --- Creating Types from Types  https://www.typescriptlang.org/docs/handbook/2/types-from-types.html 
`)

//Generics - Types which take parameters
//Keyof Type Operator - Using the keyof operator to create new types
//Typeof Type Operator - Using the typeof operator to create new types
//Indexed Access Types - Using Type['a'] syntax to access a subset of a type
//Conditional Types - Types which act like if statements in the type system
//Mapped Types - Creating types by mapping each property in an existing type
//Template Literal Types - Mapped types which change properties via template literal strings

console.log(`
--- 1 --- note about Keyof
`)

//https://www.typescriptlang.org/docs/handbook/2/keyof-types.html

type Point = { x: number; y: number };
type P = keyof Point;
//The following type P is the same type as type P = "x" | "y"

type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
//M is string | number — this is because JavaScript object keys are always coerced to a string, so obj[0] is always the same as obj["0"]

let k1: M = "1";
let k2: M = 1
console.log(k1, k2)

console.log(`
--- 2 --- js typeOf
`)
//https://www.typescriptlang.org/docs/handbook/2/typeof-types.html


//JavaScript already has a typeof operator you can use in an expression context, TypeScript adds a typeof operator you can use in a type context 
let chars = "111"
let ns: typeof chars = '111'
console.log(ns)

// simple onplace type declaration
let P1: () => {
    x: number;
    y: number
} = () => ({
    x: 5,
    y: 10
})

// the same declaration with type
function fn() {
    return { x: 10, y: 3 };
}

type Pn = typeof fn;
let P2: Pn = () => ({
    x: 5,
    y: 10
})

//ReturnType
type Pm = ReturnType<typeof fn>;
let P3: Pm = { x: 1, y: 2 }

console.log(P1(), P2(), P3)


console.log(`
--- 3 --- Indexed Access Types
`)

type Person1 = { age: number; name: string; alive: boolean };
type Age1 = Person1["age"];

let P4: Age1 = 10
console.log(P4)

const MyArray1 = [
    { name: "Alice", age: 15 },
    { name: "Bob", age: 23 },
    { name: "Eve", age: 38 },
];

type Person2 = typeof MyArray1[number];

type Age2 = typeof MyArray1[number]["age"];

type Age3 = Person2["age"];

let P5: Person2 = { name: "A", age: 1 }
let P6: Age2 = 1
let P7: Age3 = 2

console.log(P5, P6, P7)

console.log(`
--- 4 --- Conditional Types ( SomeType extends OtherType ? TrueType : FalseType; )
`)

interface IdLabel {
    id: number /* some fields */;
}
interface NameLabel {
    name: string /* other fields */;
}

//overloading function
function createLabel1(id: number): IdLabel;
function createLabel1(name: string): NameLabel;
function createLabel1(nameOrId: string | number): IdLabel | NameLabel;
function createLabel1(nameOrId: string | number): IdLabel | NameLabel {
    throw "unimplemented";
}

// the same as below:
//The extends keyword on an interface allows us to effectively copy members from other named types, and add whatever new members we want

type NameOrId<T extends number | string> = T extends number
    ? IdLabel
    : NameLabel;

function createLabel2<T extends number | string>(idOrName: T): NameOrId<T> {
    throw "unimplemented";
}

console.log(`
--- 5 --- Inferring Within Conditional Types
`)

//https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types
//we used the infer keyword to declaratively introduce a new generic type variable named Item instead of specifying how to retrieve the element type of Type within the true branch.
//For example, for simple cases, we can extract the return type out from function types:

type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
    ? Return
    : never;

type Nm = GetReturnType<() => number>;

type Str = GetReturnType<(x: string) => string>;

type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;

console.log(`
--- 6 --- Distributive Conditional Types
`)
//https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
//When conditional types act on a generic type, they become distributive when given a union type.
//If we plug a union type into ToArray, then the conditional type will be applied to each member of that union.

type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;

console.log(`
--- 7 --- Mapped Types
`)


//https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
//When you don’t want to repeat yourself, sometimes a type needs to be based on another type
//Mapped types build on the syntax for index signatures,

type OnlyBoolsAndPerson = {
    [key: string]: boolean | Person1;
};

const conforms: OnlyBoolsAndPerson = {
    del: true,
    rodney: false,
};

//A mapped type is a generic type which uses a union of PropertyKeys (frequently created via a keyof) to iterate through keys to create a type:

type OptionsFlags<T> = {
    [Property in keyof T]: boolean;
};

type Features = {
    darkMode: () => void;
    newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<Features>;

console.log(`
--- 8 --- Mapping Modifiers, readonly and ?
`)

// Removes 'readonly' attributes from a type's properties
type CreateMutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
    readonly id: string;
    readonly name: string;
};

type UnlockedAccount = CreateMutable<LockedAccount>;

// Removes 'optional' attributes from a type's properties
type Concrete<Type> = {
    [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
    id: string;
    name?: string;
    age?: number;
};

type User = Concrete<MaybeUser>;

console.log(`
--- 9 --- Key Remapping via as
`)

type MappedTypeWithNewProperties<T> = {
    [Properties in keyof T as P]: T[Properties]
}

//You can leverage features like template literal types to create new property names from prior ones
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};

interface Person {
    name: string;
    age: number;
    location: string;
}

type LazyPerson = Getters<Person>;


//You can map over arbitrary unions, not just unions of string | number | symbol, but unions of any type:

type EventConfig<Events extends { kind: string }> = {
    [E in Events as E["kind"]]: (event: E) => void;
}

type SquareEvent = { kind: "square", x: number, y: number };
type CircleEvent = { kind: "circle", radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>


console.log(`
--- 9 --- Template Literal Types
`)

type World = "world";

type Greeting = `hello ${World}`;

type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;

type AllLocaleID = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = "en" | "ja" | "pt";

type LocaleMessageIDs = `${Lang}_${AllLocaleID}`;


console.log(`
--- 10 --- Intrinsic String Manipulation Types : Uppercase<StringType>, Lowercase<StringType>, Capitalize<StringType>, Uncapitalize<StringType>
`)

type Greeting1 = "Hello, world"
type ShoutyGreeting = Uppercase<Greeting1>

type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`
type MainID = ASCIICacheKey<"my_app">

console.log(`
--- 11 --- Intersection Types
`)

interface Colorful {
    color: string;
}
interface Circle {
    radius: number;
}

type ColorfulCircle = Colorful & Circle;

function draw(circle: Colorful & Circle) {
    console.log(`Color was ${circle.color}`);
    console.log(`Radius was ${circle.radius}`);
}

// okay
//draw({ color: "blue", radius: 42 });

console.log(`
--- 12 --- type aliases, unlike interfaces, can describe more than just object types, we can also use them to write other kinds of generic helper types.
`)

type OrNull<T> = T | null;

type OneOrMany<T> = T | T[];

type OneOrManyOrNull1<T> = OrNull<OneOrMany<T>>;

type OneOrManyOrNull2<T> = OneOrMany<T> | null

type OneOrManyOrNullStrings1 = OneOrManyOrNull1<string>;

type OneOrManyOrNullStrings2 = OneOrManyOrNull2<string>;

console.log(`
--- 13 --- Readonly Array Type and readonly tuple type
`)

function doStuff(values: ReadonlyArray<string>) {
    // We can read from 'values'...
    const copy = values.slice();
    console.log(`The first value is ${values[0]}`);

    // ...but we can't mutate 'values'.
    // values.push("hello!");
}

const roArray: ReadonlyArray<string> = ["red", "green", "blue"];

function doSomething(pair: readonly [string, number]) {
    // ...
  }

console.log(`
--- 14 --- 
`)



console.log(`
--- 15 --- Template Literal Types examples
`)

const person = makeWatchedObject({
    firstName: "Saoirse",
    lastName: "Ronan",
    age: 26,
});

// makeWatchedObject has added `on` to the anonymous Object
person.on("firstNameChanged", (newValue) => {
    console.log(`firstName was changed to ${newValue}!`);
});

type PropEventSource<Type> = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};

/// Create a "watched object" with an `on` method, so that you can watch for changes to properties.
declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;

console.log(`
--- 16 --- Inference with Template Literals
`)
//https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#inference-with-template-literals

type PropEventSource1<Type> = {
    on<Key extends string & keyof Type>
        (eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void): void;
};

declare function makeWatchedObject1<Type>(obj: Type): Type & PropEventSource1<Type>;

const person1 = makeWatchedObject1({
    firstName: "Saoirse",
    lastName: "Ronan",
    age: 26
});

person1.on("firstNameChanged", newName => {
    console.log(`new name is ${newName.toUpperCase()}`);
});

person1.on("ageChanged", newAge => {

    if (newAge < 0) {
        console.warn("warning! negative age");
    }
})