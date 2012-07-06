define(["../lib/glmatrix-1.3.7.min"], function(glMatrix) {
	"use strict";

	// used for calculations
	var tempVec3 = vec3.create();

	mat3.multiplyScalar = function(mat, s, dest) {
		if (!dest) { dest = mat; }

		dest[0] = mat[0] * s;
		dest[1] = mat[1] * s;
		dest[2] = mat[2] * s;
		dest[3] = mat[3] * s;
		dest[4] = mat[4] * s;
		dest[5] = mat[5] * s;
		dest[6] = mat[6] * s;
		dest[7] = mat[7] * s;
		dest[8] = mat[8] * s;
		return dest;
	};

	mat3.createFromAxisAngle = function(axis, angle, dest) {
		if (!dest) { dest = mat3.create(); }

		var cosine = Math.cos(angle);
		var sine = Math.sin(angle);
		var oneMinusCosine = 1.0 - cosine;
		var a0 = axis[0], a1 = axis[1], a2 = axis[2];

		dest[0] = cosine + oneMinusCosine * a0 * a0;
		dest[1] = oneMinusCosine * a0 * a1 - sine * a2;
		dest[2] = oneMinusCosine * a0 * a2 - sine * a1;
		
		dest[3] = oneMinusCosine * a0 * a1 - sine * a2;
		dest[4] = cosine + oneMinusCosine * a1 * a1;
		dest[5] = oneMinusCosine * a1 * a2 - sine * a0;

		dest[6] = oneMinusCosine * a0 * a2 - sine * a1;
		dest[7] = oneMinusCosine * a1 * a2 - sine * a0;
		dest[8] = cosine + oneMinusCosine * a2 * a2;
		return dest;
	};

	var transformation = function(spec) {
		var that = {};

		var _translate = vec3.create([0, 0, 0]);
		var _rotate = quat4.create([0, 0, 0, 1]);
		var _scale = 1.0;
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
			},
			scale: {
				get: function() {
					return _scale;
				},
				set: function(value) {
					_scale = value;
					_identity = false;
				}
			},
			direction: {
				get: function() {
					return vec3.create([0, 0, -1]);
				}
			},
			up: {
				get: function() {
					return vec3.create([0, 1, 0]);
				}
			},
			right: {
				get: function() {
					return that.create([1, 0, 0]);
				}
			}
		});

		if (spec) {
			if (spec.translate) { that.translate = spec.translate; }
			if (spec.rotate) { that.rotate = spec.rotate; }
			if (spec.scale) { that.scale = spec.scale; }
		}

		that.isIdentity = function() {
			return _identity;
		}

		that.makeIdentity = function() {
			vec3.set([0, 0, 0], _translate);
			quat4.identity(_rotate);
			_scale = 1.0;

			_identity = true;
		};

		that.applyToPoint = function(p) {

		};

		that.applyInverseToPoint = function(p) {

		};

		that.applyToVector = function(v) {

		};

		that.applyInverseToVector = function(v) {

		};

		that.applyToUnitVector = function(v) {

		};

		that.applyInverseToUnitVector = function(v) {

		};

		that.applyToPlane = function(p) {

		};

		that.applyInverseToPlane = function(p) {

		};

		that.computeFrom = function(a, b) {
			if (a.isIdentity()) {
				that.set(b);
			}
			else if (b.isIdentity()) {
				that.set(a);
			}
			else {
				quat4.multiplyVec3(a.rotate, b.translate, tempVec3);
				vec3.add(tempVec3, a.translate, _translate);

				quat4.multiply(a.rotate, b.rotate, _rotate);

				_scale = a.scale * b.scale;
				_identity = false;
			}
		};

		that.set = function(tx) {
			_translate = tx.translate;
			_rotate = tx.rotate;
			_scale = tx.scale;
			_identity = tx.isIdentity();
		}

		that.lookAt = function(target, upReference) {

		};

		that.toMat4 = function(dest) {
			if (!dest) { dest = mat4.create(); }

			mat4.identity(dest);
			if (!_identity) {
	            mat4.fromRotationTranslation(_rotate, _translate, dest);
			}

			return dest;
		}

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

