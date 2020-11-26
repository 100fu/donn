//interface Math {
//    minInArrary(array: Array<number | string>): number|string
//}
///Array distinct very very good, admir myself
if (!Array.prototype.distinct)
    Array.prototype.distinct = function (fn) {
        var o = {}, a = [], i, e;
        for (i = 0; e = this[i]; i++) {
            o[fn ? fn(e) : this[i]] = e;
        }
        for (i in o) {
            if (o.hasOwnProperty(i))
                a.push(o[i]);
        }
        return a;
    };
//if (!Array.prototype.select)  请使用map
//    Array.prototype.select = function (fn: (obj) => any) {
//        let a = [], i, e;
//        for (i = 0; e = this[i] && fn ? fn(this[i]) : undefined; i++) a.push(e);
//        return a;
//    }
if (!Array.prototype.where)
    Array.prototype.where = function (fn) {
        if (!fn)
            return this;
        var a = [], i, e, s;
        for (i = 0; e = this[i]; i++) {
            s = fn(e);
            if (s)
                a.push(e);
        }
        return a;
    };
if (!Array.prototype.group)
    Array.prototype.group = function (fn) {
        var a = [], i, e, s, o = {};
        for (i = 0; e = this[i]; i++) {
            s = fn(e);
            if (o[s])
                o[s].push(e);
            else
                o[s] = [e];
        }
        for (i in o) {
            if (o.hasOwnProperty(i)) {
                o[i].Key = i;
                a.push(o[i]);
            }
        }
        return a;
    };
if (!Array.prototype.firstOrDefault)
    Array.prototype.firstOrDefault = function (fn) {
        var i, e;
        for (i = 0; e = this[i]; i++)
            if (fn(e))
                return e;
    };
// if (!Array.prototype.extends)
//     Array.prototype.extends = function (targets, fn, extendsMathod?) {
//         let o: Object = {}, a = [], i, e, all = this.concat(targets);
//         for (i = 0; e = all[i]; i++) {
//             let n = fn ? fn(e) : all[i];
//             o[n] = o[n] ? (extendsMathod || Extend)(o[n], e) : e
//         }
//         for (i in o) { if (o.hasOwnProperty(i)) a.push(o[i]) }
//         return a;
//     }
if (!Array.prototype.sum)
    Array.prototype.sum = function (fn) {
        var sum = 0, i, e;
        for (i = 0; e = this[i]; i++)
            sum += fn(this[i]);
        return sum;
    };
if (!Array.prototype.findIndex)
    Array.prototype.findIndex = function (predicate) {
        var i, e;
        for (i = 0; e = this[i]; i++)
            if (predicate(e))
                return i;
        return -1;
    };
