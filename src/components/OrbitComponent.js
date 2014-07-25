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

	var Base = require("components/NodeComponent");

	function OrbitComponent(spec) {
		spec = spec || {};
		spec.name = OrbitComponent.NAME;
		Base.call(this, spec);

		this._x0 = spec._x0 || 0;
        this._y0 = spec._y0 || 0;
        this._major = spec.major || 20;
        this._minor = spec.minor || 20;
        this._t = 0;
        this._speed = spec.speed || 1;
        this._gamma = spec.gamma || 0;
	}

	OrbitComponent.NAME = "update";

	OrbitComponent.prototype = Object.create(Base.prototype);

	OrbitComponent.prototype.destroy = function() {
		Base.prototype.destroy.call(this);
	};

	OrbitComponent.prototype.update = function(dt) {
        this.node.local.translate[0] = this._x0 + this._major * Math.cos(this._t) * Math.cos(this._gamma) - this._minor * Math.sin(this._t) * Math.sin(this._gamma);
        this.node.local.translate[1] = this._y0 + this._major * Math.cos(this._t) * Math.sin(this._gamma) + this._minor * Math.sin(this._t) * Math.cos(this._gamma);

        this._t += this._speed * dt;
	};

	return OrbitComponent;

});

