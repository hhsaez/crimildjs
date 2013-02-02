define(["core/nodeVisitor"], function(nodeVisitor) {
	"use strict";

	/*
		This visitor traverses a scene fetching all lights and shader 
		uniforms attached to nodes. 

		This is a very expensive operation and should be seldom used.
		Usualy, this visitor is only invoked during a render state update
	*/
	var fetchLightsAndUniforms = Object.create(nodeVisitor);

	Object.defineProperties(fetchLightsAndUniforms, {
		lights: {
			get: function() {
				return this._lights;
			},
			set: function(value) {
				this._lights = value;
			}
		},
		uniforms: {
			get: function() {
				return this._uniforms;
			},
			set: function(value) {
				this._uniforms = value;
			}
		}
	})

	fetchLightsAndUniforms.visitNode = function(node) {
		var lc = node.getComponent("lighting");
		if (lc && lc.light) {
			this._lights.push(lc.light);
		}

		var uc = node.getComponent("uniforms");
		if (uc) {
			var that = this;
			uc.eachUniform(function(uniform){
				that._uniforms[uniform.name] = uniform;
			});
		}
	};

	fetchLightsAndUniforms.set = function(spec) {
		spec = spec || {};

		nodeVisitor.set.call(this, spec);

		this._lights = spec.lights || [];
		this._uniforms = spec.uniforms || {};

		return this;
	};

	fetchLightsAndUniforms.destroy = function() {
		nodeVisitor.destroy.call(this);
	};

	return fetchLightsAndUniforms;
});