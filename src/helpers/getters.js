module.exports = function(obj, prop) {
    return function () {
    	let count = arguments.length;
    	let callback = arguments[count - 1] && typeof arguments[count - 1] === 'function' ? arguments[count - 1] : null;
    	let properties = obj[prop][arguments[0]];

    	if (callback && Array.isArray(properties)){
    		return properties.forEach(item => {
				callback(item);
			});
    	}

    	if(callback && typeof properties === 'object'){
	    	return Object.keys(properties).forEach(name => {
	        	callback(properties[name]);
	        });
        }

        if (count > 1){
        	return properties[arguments[1]]
        }

        return properties;
    }
}
