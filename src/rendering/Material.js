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

	var Base = require("foundation/CrimildObject");

	function Material(spec) {
		spec = spec || {};
		Base.call(this, spec);

		this._ambient = vec3.create(spec.ambient || [0.0, 0.0, 0.0]);
		this._diffuse = vec3.create(spec.diffuse || [1.0, 1.0, 1.0]);
		this._specular = vec3.create(spec.specular || [1.0, 1.0, 1.0]);
		this._shininess = spec.shininess || 50;
	}

	Material.prototype = Object.create(Base.prototype);

	Object.defineProperties(Material.prototype, {
		program: {
			get: function() { return this._program; },
			set: function(value) { this._program = value; }
		},
		ambient: {
			get: function() { return this._ambient; },
			set: function(value) { vec3.set(value, this._ambient); }
		},
		diffuse: {
			get: function() { return this._diffuse; },
			set: function(value) { vec3.set(value, this._diffuse); }
		},
		specular: {
			get: function() { return this._specular; },
			set: function(value) { vec3.set(value, this._specular); }
		},
		shininess: {
			get: function() { return this._shininess; },
			set: function(value) { vec3.set(value, this._shininess); }
		},
	});

	Material.prototype.destroy = function() {
		Base.prototype.destroy.call(this);
	};

	return Material;

});

