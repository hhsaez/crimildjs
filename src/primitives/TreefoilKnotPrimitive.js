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

	require("third-party/gl-matrix");

	var Base = require("primitives/ParametricPrimitive");

	var IndexBufferObject = require("rendering/IndexBufferObject");
	var VertexFormat = require("rendering/VertexFormat");
	var VertexBufferObject = require("rendering/VertexBufferObject");

	function TreefoilKnotPrimitive(spec) {
		spec = spec || {};

		this._scale = spec.scale || 1.0;

		spec.divisions = vec2.create(spec.divisions || [60, 15]);
		spec.upperBound = vec2.create(spec.upperBound || [2.0 * Math.PI, 2.0 * Math.PI]);
		spec.textureCount = vec2.create(spec.textureCount || [1, 1]);

		Base.call(this, spec);
	}

	TreefoilKnotPrimitive.prototype = Object.create(Base.prototype);

	TreefoilKnotPrimitive.prototype.destroy = function() {
		Base.prototype.destroy.call(this);
	};

	TreefoilKnotPrimitive.prototype.evaluate = function(domain, dest) {
		if (!dest) {
			dest = vec3.create();
		}

		var a = 0.5;
	    var b = 0.3;
	    var c = 0.5;
	    var d = 0.1;
	    var u = (Math.PI * 2.0 - domain[0]) * 2.0;
	    var v = domain[1];
	    
	    var r = a + b * Math.cos(1.5 * u);
	    var x = r * Math.cos(u);
	    var y = r * Math.sin(u);
	    var z = c * Math.sin(1.5 * u);
	    
	    var dv = vec3.create();
	    dv[ 0 ] = -1.5 * b * Math.sin(1.5 * u) * Math.cos(u) - (a + b * Math.cos(1.5 * u)) * Math.sin(u);
	    dv[ 1 ] = -1.5 * b * Math.sin(1.5 * u) * Math.sin(u) + (a + b * Math.cos(1.5 * u)) * Math.cos(u);
	    dv[ 2 ] = 1.5 * c * Math.cos(1.5 * u);
	    
	    var q = vec3.createFrom(dv[0], dv[1], dv[2]);
	    vec3.normalize(q);
	    var qvn = vec3.createFrom(q[1], -q[0], 0.0)
	    vec3.normalize(qvn);
	    var ww = vec3.create();
	    vec3.cross(q, qvn, ww);
	    
	    dest[0] = this._scale * (x + d * (qvn[0] * Math.cos(v) + ww[0] * Math.sin(v)));
	    dest[1] = this._scale * (y + d * (qvn[1] * Math.cos(v) + ww[1] * Math.sin(v)));
	    dest[2] = this._scale * (z + d * ww[2] * Math.sin(v));

		return dest;
	};

	return TreefoilKnotPrimitive;

});

