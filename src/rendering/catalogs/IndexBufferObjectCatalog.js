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

	var Base = require("rendering/RenderObjectCatalog");

	function IndexBufferObjectCatalog(spec) {
		Base.call(this, spec);
	}

	IndexBufferObjectCatalog.prototype = Object.create(Base.prototype);

	IndexBufferObjectCatalog.prototype.destroy = function() {
		Base.prototype.destroy.call(this);
	};

	IndexBufferObjectCatalog.prototype.generateId = function(renderer) {
		return renderer.gl.createBuffer();
	};

	IndexBufferObjectCatalog.prototype.load = function(renderer, ibo) {
		Base.prototype.load.call(this, renderer, ibo);

		renderer.gl.bindBuffer(renderer.gl.ELEMENT_ARRAY_BUFFER, ibo.renderObjectId);
		renderer.gl.bufferData(renderer.gl.ELEMENT_ARRAY_BUFFER, ibo.data, renderer.gl.STATIC_DRAW);
	};

	IndexBufferObjectCatalog.prototype.unload = function(renderer, ibo) {
		renderer.gl.deleteBuffer(ibo.renderObjectId);

		Base.prototype.unload.call(this, renderer, ibo);
	};

	IndexBufferObjectCatalog.prototype.bind = function(renderer, ibo, program) {
		Base.prototype.bind.call(this, renderer, ibo);

		renderer.gl.bindBuffer(renderer.gl.ELEMENT_ARRAY_BUFFER, ibo.renderObjectId);
	};

	IndexBufferObjectCatalog.prototype.unbind = function(renderer, ibo, program) {
		Base.prototype.unbind.call(this, renderer, ibo);

		renderer.gl.bindBuffer(renderer.gl.ELEMENT_ARRAY_BUFFER, null);
	};

	return IndexBufferObjectCatalog;

});

