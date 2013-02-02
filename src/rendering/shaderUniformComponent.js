define(["core/nodeComponent", "foundation/objectFactory", "./shaderUniform"], function(nodeComponent, objectFactory, shaderUniform) {
	"use strict";

	var shaderUniformComponent = Object.create(nodeComponent);

	shaderUniformComponent.addUniform = function(uniform) {
		if (uniform.name) {
			this._uniforms[uniform.name] = uniform;
		}
	};

	shaderUniformComponent.getUniform = function(name) {
		return this._uniforms[name];
	};

	shaderUniformComponent.eachUniform = function(callback) {
		for (var i in this._uniforms) {
			callback(this._uniforms[i]);
		}
	};

	shaderUniformComponent.set = function(spec) {
		spec = spec || {};

		spec.name = "uniforms";
		nodeComponent.set.call(this, spec);

		this._uniforms = {};
		for (var u in spec.uniforms) {
			this.addUniform(objectFactory.inflate(spec.uniforms[u]));
		}

		return this;
	};

	shaderUniformComponent.destroy = function() {
		nodeComponent.destroy.call(this);
	};

	return shaderUniformComponent;	
});

