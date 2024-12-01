class Utitlities {
    static cloneObject(source) {
        if (Object.prototype.toString.call(source) === '[object Array]') {
            const clone = [];
            for (var i = 0; i < source.length; i++) {
                clone[i] = Utitlities.cloneObject(source[i]);
            }
            return clone;
        }
        else if (typeof (source) == "object") {
            const clone = {};
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    //@ts-ignore
                    clone[prop] = Utitlities.cloneObject(source[prop]);
                }
            }
            return clone;
        }
        else {
            return source;
        }
    }
    static sortObject(unordered) {
        if (typeof unordered !== 'object') {
            return unordered;
        }
        return Object.keys(unordered).sort().reduce((obj, key) => {
            //@ts-ignore
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                //@ts-ignore
                obj[key] = sortObject(unordered[key]);
                return obj;
            }
            //@ts-ignore
            obj[key] = unordered[key];
            return obj;
        }, {});
    }
}
export default Utitlities;
