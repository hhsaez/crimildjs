define(["../core/nodeComponent", "../simulation/input", "../traversal/worldStateUpdate"], function(nodeComponent, input, worldStateUpdate) {
	"use strict";

	var trackpadComponent = Object.create(nodeComponent);

	Object.defineProperties(trackpadComponent, {
		sensitivity: {
			get: function() {
				return this._sensitivity
			},
			set: function(value) {
				this._sensitivity = value;
			}
		}
	});

	trackpadComponent.update = function(time) {
		var mousePos = input.mousePos;
		var mouseDelta = input.mouseDelta;

		if (input.isMouseButtonDown()) {
			this.node.local.computeWorldUp(this._vUp);
			this.node.local.computeWorldRight(this._vRight);

			var yaw = mouseDelta[0] * this.sensitivity * Math.PI / 180.0;
			var pitch = mouseDelta[1] * this.sensitivity * Math.PI / 180.0;

            quat4.fromAngleAxis(pitch, this._vRight, this._qPitch);
            quat4.inverse(this._qPitch, this._qTemp);
            quat4.multiplyVec3(this._qTemp, this._vUp, this._vUp);
            quat4.fromAngleAxis(yaw, this._vUp, this._qYaw);

            quat4.multiply(this._qPitch, this._qYaw, this._qTemp);
            quat4.multiply(this.node.local.rotate, this._qTemp, this.node.local.rotate);
		}

		this.node.perform(worldStateUpdate);
	};

	trackpadComponent.set = function(spec) {
		spec = spec || {};

		nodeComponent.set.call(this, spec);

		this._sensitivity = spec.sensitivity || 0.1;
		this._vUp = vec3.create();
		this._vRight = vec3.create();
		this._qPitch = quat4.create();
		this._qTemp = quat4.create();
		this._qYaw = quat4.create();

		return this;
	};

	trackpadComponent.destroy = function() {
		nodeComponent.destroy.call(this);
	};

	return trackpadComponent;
})