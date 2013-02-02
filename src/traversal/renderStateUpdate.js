define(["core/nodeVisitor", "./fetchLightsAndUniforms"], function(nodeVisitor, fetchLightsAndUniforms) {
	"use strict";

	/*
		Updates a render state of a scene or branch

		This is a very expensive operation since it involves
		traversing a scene more than once. Use it only when needed
	*/
	var renderStateUpdate = Object.create(nodeVisitor);

	renderStateUpdate.propagateFromRoot = function(aNode) {
		var that = this;
		if (aNode.parent) {
			that.propagateFromRoot(aNode.parent);
		}
		else {
			// no parent. this is the root node
			aNode.perform(fetchLightsAndUniforms.set({
				lights: that._lights, 
				uniforms: that._uniforms
			}));
		}

		var attachedEffects = aNode.getComponent("effect");
		if (attachedEffects) {
			attachedEffects.eachEffect(function(anEffect) {
				that._effects.push(anEffect);
			});
		}
	};

	renderStateUpdate.traverse = function(aNode) {
		this._effects = [];
		this._lights = [];
		this._uniforms = {};

		if (aNode.parent) {
			that.propagateFromRoot(aNode.parent);
		}
		else {
			// no parent. this is the root node
			var that = this;
			aNode.perform(fetchLightsAndUniforms.set({
				lights: that._lights, 
				uniforms: that._uniforms
			}));
		}

		nodeVisitor.traverse.call(this, aNode);
	};

	renderStateUpdate.visitNode = function(node) {
		var tempEffects = this._effects.slice();
		var that = this;

		var attachedEffects = node.getComponent("effects");
		if (attachedEffects) {
			attachedEffects.effects.each(function(anEffect) {
				that._effects.push(anEffect);
			})
		}

		// override uniforms
		var attachedUniforms = node.getComponent("uniforms");
		if (attachedUniforms) {
			attachedUniforms.eachUniform(function(uniform) {
				that._uniforms[uniform.name] = uniform;
			});
		}

		var renderComponent = node.getComponent("render");
		if (renderComponent) {
			renderComponent.set({
				effects: this._effects,
				lights: this._lights,
				uniforms: this._uniforms,
			})
		}

		this._effects = tempEffects;
	};

	renderStateUpdate.visitGroupNode = function(group) {
		var tempEffects = this._effects.slice();
		var that = this;

		var attachedEffects = group.getComponent("effects");
		if (attachedEffects) {
			attachedEffects.effects.each(function(anEffect) {
				that._effects.push(anEffect);
			})
		}

		// override uniforms
		var attachedUniforms = group.getComponent("uniforms");
		if (attachedUniforms) {
			attachedUniforms.eachUniform(function(uniform) {
				that._uniforms[uniform.name] = uniform;
			});
		}

		group.nodes.each(function(aNode) {
			aNode.accept(that);
		})

		this._effects = tempEffects;
	};

	renderStateUpdate.set = function(spec) {
		spec = spec || {};

		nodeVisitor.set.call(this, spec);

		this._effects = [];
		this._lights = [];
		this._uniforms = {};

		return this;
	};

	renderStateUpdate.destroy = function() {
		nodeVisitor.destroy.call(this);
	};

	return renderStateUpdate;	
});

