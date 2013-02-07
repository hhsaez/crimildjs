define(["core/nodeComponent", "./camera"], function(nodeComponent, camera) {
	"use strict";

	var cameraComponent = Object.create(nodeComponent);

	Object.defineProperties(cameraComponent, {
		camera: {
			get: function() {
				return this._camera;
			}
		}
	});

	cameraComponent.update = function() {
		this.camera.transformation.set(this.node.world);
	};

	cameraComponent.set = function(spec) {
		spec = spec || {};

		spec.name = "camera";
		nodeComponent.set.call(this, spec);

		this._camera = Object.create(camera).set(spec);

		return this;
	};

	cameraComponent.destroy = function() {
		this.camera.destroy();

		nodeComponent.destroy.call(this);
	};

	return cameraComponent;
});

