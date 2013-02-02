define(["third-party/gl-matrix"], function() {
	"use strict";

	var light = {};

	Object.defineProperties(light, {
		position: {
			get: function() {
				return this._position;
			},
			set: function(value) {
				vec3.set(value, this._position);
			}
		},
		attenuation: {
			get: function() {
				return this._attenuation;
			},
			set: function(value) {
				vec3.set(value, this._attenuation);
			}
		},
		direction: {
			get: function() {
				return this._direction;
			},
			set: function(value) {
				vec3.set(value, this._direction);
			}
		},
		color: {
			get: function() {
				return this._color;
			},
			set: function(value) {
				vec3.set(value, this._color);
			}
		},
		outerCutoff: {
			get: function() {
				return this._outerCutoff;
			},
			set: function(value) {
				this._outerCutoff = value;
			}
		},
		innerCutoff: {
			get: function() {
				return this._innerCutoff;
			},
			set: function(value) {
				this._innerCutoff = value;
			},
		},
		exponent: {
			get: function() {
				return this._exponent;
			},
			set: function(value) {
				this._exponent = value;
			}
		}
	});

	light.set = function(spec) {
		spec = spec || {};

		this._position = vec3.create(spec.position || [0, 0, 0]);
		this._attenuation = vec3.create(spec.attenuation || [1.0, 0, 0.01]);
		this._direction = vec3.create(spec.direction || [0, 0, 0]);
		this._color = vec3.create(spec.color || [1, 1, 1]);
		this._outerCutoff = spec.outerCutoff || 0;
		this._innerCutoff = spec.innerCutoff || 0;
		this._exponent = spec.exponent || 0;

		return this;
	};

	light.destroy = function() {

	};

	return light;
});

