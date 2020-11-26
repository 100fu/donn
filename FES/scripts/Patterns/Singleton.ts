
/**
* singleton
* @param fn {Function|ObjectConstructor} 
* @param isClass
* @param classArgs
*/
export let Singleton = (fn: Function | ObjectConstructor, isClass?: boolean, ...classArgs: Array<any>): any => {
    let result;
    if (isClass)
        return function () {
            return result || (result = new (fn as ObjectConstructor)(classArgs));
        }
    return function () { //不能改写成 ()=> 形式
        return result || (result = (fn as Function).apply(this, classArgs));
    }
}
