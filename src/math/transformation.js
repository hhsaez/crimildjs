define(["../third-party/gl-matrix"], function(glMatrix) {
	"use strict";

	var transformation = {
		_translate: vec3.create([0, 0, 0]),
		_rotate: quat4.fromAngleAxis(0.0, [0, 1, 0]),
		_inverseRotate: quat4.fromAngleAxis(0.0, [0, 1, 0]),
		_scale: 1.0,
		_identity: true,
	};

	Object.defineProperties(transformation, {
		translate: {
			get: function() {
				return this._translate;
			},
			set: function(value) {
				vec3.set(value, this._translate);
				this._identity = false;
			}
		},
		rotate: {
			get: function() {
				return this._rotate;
			},
			set: function(value) {
				quat4.set(value, this._rotate);
				quat4.inverse(this._rotate, this.inverseRotate);
				this._identity = false;
			}	
		},
		inverseRotate: {
			get: function() {
				return this._inverseRotate;
			},
			set: function(value) {
				quat.set(value, this._inverseRotate);
				this._identity = false;
			}
		},
		scale: {
			get: function() {
				return this._scale;
			},
			set: function(value) {
				this._scale = value;
				this._identity = false;
			}
		},
	});

	transformation.isIdentity = function() {
		return this._identity;
	};

	transformation.makeIdentity = function() {
		vec3.set([0, 0, 0], this._translate);
		quat4.identity(this._rotate);
		this.scale = 1.0;
		this._identity = true;
	};

	transformation.applyToPoint = function(p, dest) {
		if (!dest) {
			dest = vec3.create();
		}

		quat4.multiplyVec3(this.rotate, p, dest);
		vec3.add(dest, this.translate, dest);
		return dest;
	};

	transformation.applyInverseToPoint = function(p, dest) {
		if (!dest) {
			dest = vec3.create();
		}

		vec3.subtract(p, this.translate, dest);
		quat4.multiplyVec3(this.inverseRotate, dest, dest);
		return dest;
	};

	transformation.applyToVector = function(v, dest) {
		if (!dest) {
			dest = vec3.create();
		}

		quat4.multiplyVec3(this.rotate, v, dest);
		return dest;
	};

	transformation.applyInverseToVector = function(v, dest) {
		if (!dest) {
			dest = vec3.create();
		}

		quat4.multiplyVec3(this.inverseRotate, v, dest);
		return dest;
	};

	transformation.applyToUnitVector = function(v, dest) {
		return this.applyToVector(v, dest);
	};

	transformation.applyInverseToUnitVector = function(v, dest) {
		//return this.applyInverseToVector(v, dest);
		//vec3.set(v, dest);
		//return dest;
	};

	transformation.applyToPlane = function(p) {

	};

	transformation.applyInverseToPlane = function(p) {

	};

	transformation.computeDirection = function(dest) {
		if (!dest) {
			dest = vec3.create();
		}

		quat4.multiplyVec3(this.rotate, [0, 0, -1], dest);
		return dest;
	};

	transformation.computeWorldDirection = function(dest) {
		if (!dest) {
			dest = vec3.create();
		}

		quat4.multiplyVec3(this.inverseRotate, [0, 0, -1], dest);
		return dest;
	};

	transformation.computeUp = function(dest) {
		if (!dest) {
			dest = vec3.create();
		}

		quat4.multiplyVec3(this.rotate, [0, 1, 0], dest);
		return dest;
	};

	transformation.computeWorldUp = function(dest) {
		if (!dest) {
			dest = vec3.create();
		}

		// why not using this.inverseRotate instead?
		var invRotate = quat4.create();
		quat4.inverse(this._rotate, invRotate);
		quat4.multiplyVec3(invRotate, [0, 1, 0], dest);

		return dest;
	};

	transformation.computeRight = function(dest) {			
		if (!dest) {
			dest = vec3.create();
		}

		quat4.multiplyVec3(this.rotate, [1, 0, 0], dest);
		return dest;
	};

	transformation.computeWorldRight = function(dest) {
		if (!dest) {
			dest = vec3.create();
		}

		quat4.multiplyVec3(this.inverseRotate, [1, 0, 0], dest);
		return dest;
	};

	transformation.computeFrom = function(a, b) {
		if (a.isIdentity()) {
			this.set(b);
		}
		else if (b.isIdentity()) {
			this.set(a);
		}
		else {
			var tempVec3 = [0, 0, 0];
			quat4.multiplyVec3(a.rotate, b.translate, tempVec3);
			vec3.add(tempVec3, a.translate, this.translate);

			quat4.identity(this.rotate);
			quat4.multiply(a.rotate, b.rotate, this.rotate);

			this.scale = a.scale * b.scale;
			this._identity = false;
		}
	};

	transformation.lookAt = function(target, upReference) {

	};

	transformation.toMat4 = function(dest) {
		if (!dest) { 
			dest = mat4.create(); 
		}

		mat4.identity(dest);
		if (!this._identity) {
            mat4.fromRotationTranslation(this._rotate, this._translate, dest);
		}

		return dest;
	};

	transformation.set = function(spec) {
		spec = spec || {};

		this._translate = vec3.create(spec.translate || [0, 0, 0]);
		this._rotate = quat4.create(spec.rotate || quat4.fromAngleAxis(0, [0, 1, 0]));
		this._scale = spec.scale || 1;
		this._identity = spec.isIdentity ? spec.isIdentity() : false;

		return this;
	};

	transformation.destroy = function() {

	};

	return transformation;
});
