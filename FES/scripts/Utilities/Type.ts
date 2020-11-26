let class2type = {};
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(s => {
	class2type["[ object " + s + " ]"] = s.toLowerCase();
})
export let ToString = class2type.toString;
export let Type = (obj) => {
	if (obj == null) {
		return String(obj);
	}
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ToString.call(obj)] || "object" :
		typeof obj;
}
