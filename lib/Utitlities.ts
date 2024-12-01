class Utitlities {

    static cloneObject(source:any):any{
        if (Object.prototype.toString.call(source) === '[object Array]') {
            const clone = [];
            for (var i=0; i<source.length; i++) {
                clone[i] = Utitlities.cloneObject(source[i]);
            }
            return clone;
        } else if (typeof(source)=="object") {
            const clone = {};
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    //@ts-ignore
                    clone[prop] = Utitlities.cloneObject(source[prop]);
                }
            }
            return clone;
        } else {
            return source;
        }
    }
}

export default Utitlities;