/*
 * Copyright (c) 2014, Hugo Hernan Saez
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: 
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer. 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution. 
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

define(function(require) {

	"use strict";

	var Base = require("foundation/CrimildObject");

	var glMatrix = require("third-party/gl-matrix");

	function Transformation(spec) {
		spec = spec || {};
		Base.call(this, spec);

		this.makeIdentity();

		if (spec) {
			this.copyFrom(spec);
		}
	}

	Transformation.prototype = Object.create(Base.prototype);

	Transformation.prototype.destroy = function() {
		Base.prototype.destroy.call(this);
	};

	Object.defineProperties(Transformation.prototype, {
		translate: {
			get: function() { return this._translate; },
			set: function(value) { this._translate = value; this.identity = false; }
		},
		rotate: {
			get: function() { return this._rotate; },
			set: function(value) { this._rotate = value; this.identity = false; }
		},
		scale: {
			get: function() { return this._scale; },
			set: function(value) { this._scale = value; this.identity = false; }
		},
		identity: {
			get: function() { return this._identity; },
			set: function(value) { this._identity = value; }
		}
	});

	Transformation.prototype.isIdentity = function() {
		return this.identity;
	};

	Transformation.prototype.makeIdentity = function() {
		this.translate = [0, 0, 0];
		this.rotate = quat4.identity();
		this.scale = 1.0;
		this.identity = true;
	};

	Transformation.prototype.copyFrom = function(t) {
		this.translate = t.translate || this.translate;
		this.rotate = t.rotate || this.rotate;
		this.scale = t.scale || this.scale;
		this.identity = t.identity || this.identity;
	};

	Transformation.prototype.computeFrom = function(a, b) {
		if (a.isIdentity()) {
			this.copyFrom(b);
		}
		else if (b.isIdentity()) {
			this.copyFrom(a);
		}
		else {
			var temp = vec3.create([0, 0, 0]);
			quat4.multiplyVec3(a.rotate, b.translate, temp);
			vec3.add(temp, a.translate, this._translate);

			quat4.identity(this._rotate);
			quat4.multiply(a.rotate, b.rotate, this._rotate);

			this.scale = a.scale * b.scale;
			this.identity = false;
		}

		return this;
	};

	Transformation.prototype.toMatrix = function(dest) {
		if (!dest) {
			dest = mat4.create();
		}

		mat4.identity(dest);
		if (!this.isIdentity()) {
			mat4.fromRotationTranslation(this._rotate, this._translate, dest);
		}

		return dest;
	};		

	Transformation.prototype.toMatrixInverse = function(dest) {
		if (!dest) {
			dest = mat4.create();
		}

		this.toMatrix(dest);
		mat4.inverse(dest);

		return dest;
	};

	return Transformation;

});

