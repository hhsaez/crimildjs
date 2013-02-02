define(["core/node", "./cameraComponent"], function(node, cameraComponent) {
	"use strict";

	var cameraNode = Object.create(node);

	Object.defineProperties(cameraNode, {
		camera: {
			get: function() {
				return this.getComponent("camera").camera;
			}
		}
	});

	cameraNode.set = function(spec) {
		spec = spec || {};

		node.set.call(this, spec);

		this.attachComponent(Object.create(cameraComponent).set(spec));

		return this;
	};

	cameraComponent.destroy = function() {
		node.destroy.call(this);
	};

	return this;
});

