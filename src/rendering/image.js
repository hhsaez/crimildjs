define(["foundation/namedObject"], function(namedObject) {
	"use strict";

	var image = Object.create(namedObject);

	Object.defineProperties(image, {
		width: {
			get: function() {
				return this._width;
			}
		},
		height: {
			get: function() {
				return this._height;
			}
		},
		data: {
			get: function() {
				return this._data;
			}
		},
	});

	image.set = function(spec) {
		spec = spec || {};

		namedObject.set.call(this, spec);

		this._width = spec.width || 0;
		this._heigth = spec.height || 0;
		this._data = spec.data;

		return this;
	};

	image.destroy = function() {
		namedObject.destroy.call(this);
	};

	return image;
});

