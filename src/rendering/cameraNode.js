define(["math/transformation", "foundation/collection", "core/node"], function(transformation, collection, node) {
	"use strict";

	var cameraNode = Object.create(node);

	Object.defineProperties(cameraNode, {
		renderer: {
			get: function() {
				return this._renderer;
			},
			set: function(value) {
				this._renderer = value;
			}
		},
		viewport: {
			get: function() {
				return this._viewport;
			},
			set: function(value) {
				vec4.set(value, this._viewport);
			}
		},
		target: {
			get: function() {
				return this._target;
			},
			set: function(value) {
				this._target = value;
			}
		},
	});

	cameraNode.accept = function(aVisitor) {
		if (aVisitor.visitCamera) {
			aVisitor.visitCamera(this);
		}
		else {
			aVisitor.visitNode(this);
		}
	};

	cameraNode.computeViewMatrix = function(dest) {
		if (!dest) {
			dest = mat4.create();
		}

		this.world.toMat4(dest);
		mat4.inverse(dest);
		return dest;
	};

	cameraNode.computeProjectMatrix = function(dest) {
		if (!dest) {
			dest = mat4.create();
		}

		mat4.set(this._pMatrix, dest);
		return dest;
	};

	cameraNode.unproject = function(x, y, z, result) {
		var wx = (2 * (x - this._viewport[0]) / this._viewport[2]) - 1;
		var wy = (2 * (y - this._viewport[1]) / this._viewport[3]) - 1;
		var wz = 2 * z - 1;

		var m = mat4.create();
		this.computeViewMatrix(m);
		mat4.multiply(this._pMatrix, m, m);
		mat4.inverse(m, m);

		var n = [wx, wy, wz, 1];
		mat4.multiplyVec4(m, n, n);

		if (n[3] === 0) {
			return false;
		}

		result[0] = n[0] / n[3];
		result[1] = n[1] / n[3];
		result[2] = n[2] / n[3];
		return true;
	};

	cameraNode.getPickRay = function(x, y, width, height, origin, direction) {
		var p0 = vec3.create();
		var p1 = vec3.create();

        if (!this.unproject(x / width, (height - y) / height, 0, p0)) {
        	return false;
        }

        if (!this.unproject(x / width, (height - y) / height, 1, p1)) {
        	return false;
        }

       	vec3.subtract(p1, p0, direction);
        vec3.normalize(direction);
        vec3.set(this.world.translate, origin);

        return true;
	};		

	cameraNode.set = function(spec) {
		spec = spec || {};

		node.set.call(this, spec);

		this._viewport = vec4.create(spec.viewport || [0, 0, 1, 1]);
		this._target = spec.target;
		this._renderer = null;

		if (spec.projection) {
			this._pMatrix = mat4.create(spec.projection);
		}
		else {
			this._pMatrix = mat4.create();
			mat4.perspective(
				spec.fov || 45, 
				spec.aspectRatio || (16.0 / 9.0), 
				spec.near || 0.1, 
				spec.far || 1000.0, 
				this._pMatrix);
		}

		return this;
	};

	cameraNode.destroy = function() {
		node.destroy.call(this);
	};

	return cameraNode;
});

