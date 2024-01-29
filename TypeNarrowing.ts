//https://www.vb-net.com/TsLecture/Index.htm#Narrowing
// 1. JS Typeof Guard
// 2. Truthiness guard (check by IF). These values {0, NaN, "" (the empty string), 0n (the bigint version of zero), null, undefined} - always get False on IF checking. Other get True on IF checking.
// 3. Equality narrowing. Comparing without transformation to one type (===, !==) or with transformation to one type (==, !=).
// 4. IN narrowing - check if object of prototype has property
// 5. InstanceOf narrowing - check prototype chain, and object created with New
// 6. Type predicates AS - TypeScript will narrow that variable to that specific type if the original type is compatible
// 7. Discriminated unions - store literal as one of property
// 8. Using Never type to receive exception if type is wrong
// 9. Non-null Assertion Operator (Postfix !)

//https://www.typescriptlang.org/docs/handbook/2/narrowing.html#handbook-content

console.log(`
--- 1 --- JS Typeof Guard.
`)

//js TypeOf return https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
// "string", "number", "bigint", "boolean", "symbol", "undefined", "object", "function",  (typeof null === "object";)

function padLeft(padding: number | string, input: string) {
    if (typeof padding === "number") {
        return " ".repeat(padding) + input;
    }
    return padding + input;
}

console.log(`
--- 2 --- Truthiness guard (check by IF). These values {0, NaN, "" (the empty string), 0n (the bigint version of zero), null, undefined} - always get False on IF checking. Other get True on IF checking.
`)

function multiplyAll(
    values: number[] | undefined,
    factor: number
): number[] | undefined {
    if (!values) {
        return values;
    } else {
        return values.map((x) => x * factor);
    }
}

console.log(`
--- 3 --- Equality narrowing. Comparing without transformation to one type (===, !==) or with transformation to one type (==, !=).
`)

function printAll(strs: string | string[] | null) {
    if (strs !== null) {
        if (typeof strs === "object") {
            for (const s of strs) {
                console.log(s);
            }
        } else if (typeof strs === "string") {
            console.log(strs);
        }
    }
}

console.log(`
--- 4 --- IN narrowing - check if object of prototype has property
`)

type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
    if ("swim" in animal) {
        return animal.swim();
    }

    return animal.fly();
}

console.log(`
--- 5 --- InstanceOf narrowing - check prototype chain, and object created with New
`)

function logValue(x: Date | string) {
    if (x instanceof Date) {
        console.log(x.toUTCString());
    } else {
        console.log(x.toUpperCase());
    }
}

console.log(`
--- 6 --- Type predicates AS - TypeScript will narrow that variable to that specific type if the original type is compatible
`)

function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}

console.log(`
--- 7 --- Discriminated unions - store literal as one of property
`)

interface Circle {
    kind: "circle";
    radius: number;
}

interface Square {
    kind: "square";
    sideLength: number;
}

type Shape2 = Circle | Square;

console.log(`
--- 8 --- Using Never type to receive exception if type is wrong
`)

type Shape3 = Circle | Square;

function getArea2(shape: Shape3) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
        default:
            const _exhaustiveCheck: never = shape;
            return _exhaustiveCheck;
    }
}

console.log(`
--- 9--- non-null assertion (!) to say that radius is definitely present.
`)

function getArea(shape: Shape) {
    if (shape.kind === "circle") {
        return Math.PI * shape.radius! ** 2;
    }
}