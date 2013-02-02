define(function() {
	"use strict";

	return {
		create: function(obj, spec) {
			return Object.create(obj).set(spec);
		},

		destroy: function(obj) {
			return obj.destroy();
		},

		inflate: function(obj) {
			if (obj.hasOwnProperty("_prototype")) {
				return this.create(obj._prototype, obj);
			}
			else {
				return obj;
			}
		},
	}
	
});

