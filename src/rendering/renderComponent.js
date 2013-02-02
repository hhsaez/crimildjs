define(["core/nodeComponent"], function(nodeComponent) {
	"use strict";

	var renderComponent = Object.create(nodeComponent);

	renderComponent.hasEffects = function() {
		return this._effects.length > 0;
	}

	renderComponent.eachEffect = function(callback) {
		if (callback) {
			for (var e in this._effects ) {
				var effect = this._effects[e];
				if (effect) {
					callback(effect);
				}
			}
		}
	};

	renderComponent.hasLights = function() {
		return this._lights.length > 0;
	}

	renderComponent.getLightCount = function() {
		return this._lights.length;
	};

	renderComponent.eachLight = function(callback) {
		if (callback) {
			for (var l in this._lights ) {
				var light = this._lights[l];
				if (light) {
					callback(light);
				}
			}
		}
	}

	renderComponent.hasUniforms = function() {
		return this._uniforms.length > 0;
	}

	renderComponent.eachUniform = function(callback) {
		if (callback) {
			for (var u in this._uniforms ) {
				var uniform = this._uniforms[u];
				if (uniform) {
					callback(uniform);
				}
			}
		}
	}

	renderComponent.set = function(spec) {
		spec = spec || {};

		spec.name = "render";
		nodeComponent.set.call(this, spec);

		this._effects = [];
		for (var e in spec.effects) {
			this._effects.push(spec.effects[e]);
		}

		this._lights = [];
		for (var l in spec.lights) {
			this._lights.push(spec.lights[l]);
		}

		this._uniforms = [];
		for (var u in spec.uniforms) {
			this._uniforms.push(spec.uniforms[u]);
		}

		return this;
	};

	renderComponent.destroy = function() {
		this._effects = [];
		this._lights = [];
		this._uniforms = [];

		nodeComponent.destroy.call(this);
	};

	return renderComponent;
});

