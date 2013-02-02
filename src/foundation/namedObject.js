define(function() {
	"use strict";

	var namedObject = {};

	Object.defineProperties(namedObject, {
		name: {
			get: function() {
				return this._name;
			},
			set: function(value) {
				this._name = value;
			}
		},
	});

	namedObject.set = function(spec) {
		spec = spec || {};

		this._name = spec.name || "";

		return this;
	};

	namedObject.destroy = function() {
		this.name = null;
	};

	return namedObject;
});

