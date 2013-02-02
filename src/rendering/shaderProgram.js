define(["./renderResource", "./shader"], function(renderResource, shader) {

	"use strict";

	var shaderProgram = Object.create(renderResource);

	Object.defineProperties(shaderProgram, {
		vertexShader: {
			get: function() {
				return this._vertexShader;
			}
		},
		fragmentShader: {
			get: function() {
				return this._fragmentShader;
			}
		}
	});

	shaderProgram.set = function(spec) {
		spec = spec || {};

		renderResource.set.call(this, spec);

		this._vertexShader = Object.create(shader).set({ text: spec.vertexShader });
		this._fragmentShader = Object.create(shader).set({ text: spec.fragmentShader });

		return this;
	};

	shaderProgram.destroy = function() {
		this.vertexShader.destroy();
		this.fragmentShader.destroy();

		renderResource.destroy.call(this);
	};

	return shaderProgram;
});

