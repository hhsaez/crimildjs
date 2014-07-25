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

	var Base = require("rendering/renderPasses/RenderPass");

	var RenderComponent = require("components/RenderComponent");

	function ForwardRenderPass(spec) {
		Base.call(this, spec);
	}

	ForwardRenderPass.prototype = Object.create(Base.prototype);

	ForwardRenderPass.prototype.destroy = function() {
		Base.apply(this);
	};

	ForwardRenderPass.prototype.render = function(renderer, renderQueue) {
		var defaultProgram = renderer.getProgram("forwardPass");
		var camera = renderQueue.camera;

		renderQueue.geometries.each(function(geometry) {
			var renderComponent = geometry.components.get(RenderComponent.NAME);

			var material = renderComponent.material;

			var program = material.program || defaultProgram;

			renderer.bindProgram(program);
			renderer.bindCamera(program, camera);
			renderer.bindMaterial(program, material);
			renderer.applyTransformations(program, geometry);

			renderer.renderPrimitive(program, geometry.primitive);

			renderer.restoreTransformations(program, geometry);
			renderer.unbindMaterial(program, material);
			renderer.unbindCamera(program, camera);
			renderer.unbindProgram(program);
		});
	};

	return ForwardRenderPass;

});

