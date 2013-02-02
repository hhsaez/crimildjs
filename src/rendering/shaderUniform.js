define(["./renderResource"], function(renderResource) {
	"use strict";

	var shaderUniform = Object.create(renderResource);

	shaderUniform.types = {
		UNKNOWN: 0,
		FLOAT: 1,
		INT: 2,
		MATRIX_3: 3,
		MATRIX_4: 4,
		BOOL: 5
	};

	Object.defineProperties(shaderUniform, {
		type: {
			get: function() {
				return this._type;
			},
			set: function(value) {
				this._type = value;
			}
		},
		data: {
			get: function() {
				return this._data;
			},
			set: function(value) {
				this._data = value;
			}
		},
		count: {
			get: function() {
				return this._count;
			},
			set: function(value) {
				this._count = value;
			}
		}
	});

	shaderUniform.set = function(spec) {
		spec = spec || {};

		renderResource.set.call(this, spec);

		this._type = spec.type || shaderUniform.types.UNKNOWN;
		this._data = spec.data;
		this._count = spec.count || 1;

		return this;
	};

	shaderUniform.destroy = function() {
		renderResource.destroy.call(this);
	};

	return shaderUniform;
});

