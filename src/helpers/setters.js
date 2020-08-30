module.exports = function(obj, prop) {
    return function (name, value) {
        if (obj[prop].hasOwnProperty(name) && Array.isArray(obj[prop][name])){
            obj[prop][name].push(value);
        }else{
            obj[prop][name] = value
        }
    }
}