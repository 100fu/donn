import { Type } from './Type';
export function Extend<T,U>(first: T, second: U): T & U {
	let result = <T & U>{};
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<any>result)[id] = (<any>second)[id];
        }
    }
    return result;
}
// export let Extend = (target: Object | boolean, ...e: any[]): any => {
// 	let src, copyIsArray, copy, name, options, clone,
// 		i = 1,
// 		length = e.length + 1,
// 		deep = false;

// 	// Handle a deep copy situation
// 	if (typeof target === "boolean") {
// 		deep = target;
// 		target = e[1] || {};
// 		// skip the boolean and the target
// 		i = 2;
// 	}

// 	// Handle case when target is a string or something (possible in deep copy)
// 	if (typeof target !== "object" && Type(target) !== "function") {
// 		target = {};
// 	}


// 	for (; i < length; i++) {
// 		// Only deal with non-null/undefined values
// 		if ((options = e[i]) != null) {
// 			// Extend the base object
// 			for (name in options) {
// 				src = target[name];
// 				copy = options[name];

// 				// Prevent never-ending loop
// 				if (target === copy) {
// 					continue;
// 				}

// 				// Recurse if we're merging plain objects or arrays
// 				if (deep && copy || (copyIsArray = (Type(src) === "array"))) {
// 					if (copyIsArray) {
// 						copyIsArray = false;
// 						clone = src && (Type(src) === "array") ? src : [];

// 					} else {
// 						clone = src || {};
// 					}

// 					// Never move original objects, clone them
// 					target[name] = Extend(deep, clone, copy);

// 					// Don't bring in undefined values
// 				} else if (copy !== undefined) {
// 					target[name] = copy;
// 				}
// 			}
// 		}
// 	}

// 	// Return the modified object
// 	return target;
// };
