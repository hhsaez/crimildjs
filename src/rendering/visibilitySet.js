define(function() {
	"use strict";

	var visibilitySet = {};

	Object.defineProperties(visibilitySet, {
		camera: {
			get: function() {
				return this._camera;
			}
		},
	});

	visibilitySet.eachGeometry = function(callback) {
		for (var g in this._geometries) {
			callback(this._geometries[g]);
		}
	};

	visibilitySet.set = function(spec) {
		spec = spec || {};

		this._geometries = spec.geometries || [];
		this._camera = spec.camera || null;

		return this;
	};

	visibilitySet.destroy = function() {

	};

	return visibilitySet;
});

