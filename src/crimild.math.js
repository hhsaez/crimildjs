define(["../lib/glMatrix-1.3.7.min.js"], function(glMatrix) {
	"use strict";

	var transformation = function(spec) {
		var that = {};

		var _translate = vec3.create();
		var _rotate = mat3.create();
		var _identity = true;

		Object.defineProperties(that,{
			translate: {
				get: function() {
					return _translate;
				},
				set: function(value) {
					_translate = value;
					_identity = false;
				}
			},
			rotate: {
				get: function() {
					return _rotate;
				},
				set: function(value) {
					_rotate = value;
					_identity = false;
				}	
			}
		});

		that.isIdentity = function() {
			return _identity;
		}

		that.makeIdentity = function() {
			that.translate = vec3.create();
			that.rotate = mat3.create();

			_identity = true;
		};

		return that;
	};

	var boundingVolume = function(spec) {
		var that = {};

		return that;
	};

	return {
		transformation: transformation,
		boundingVolume: boundingVolume,
	}

});

