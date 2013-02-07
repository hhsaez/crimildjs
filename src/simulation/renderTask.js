define(["./task", "rendering/visibilitySet", "traversal/computeVisibilitySet", "traversal/fetchCameras"], 
	function(task, visibilitySet, computeVisibilitySet, fetchCameras) {

	"use strict";

	var renderTask = Object.create(task);

	renderTask.onStart = function() {
		this._cameras = [];
		this.simulator.scene.perform(fetchCameras.set({
			result: this._cameras
		}));
	};

	renderTask.onUpdate = function() {
		this.simulator.renderer.beginRender();
		this.simulator.renderer.clearBuffers();

		var visibleObjects = Object.create(visibilitySet).set();

		if (this._cameras.length > 0) {
			for (var c in this._cameras) {
				this.simulator.scene.perform(computeVisibilitySet.set({
					result: visibleObjects,
					camera: this._cameras[c]
				}));
				this.simulator.renderer.renderVisibilitySet(visibleObjects);
			}
		}
		else {
			this.simulator.scene.perform(computeVisibilitySet.set({
				result: visibleObjects
			}));
			this.simulator.renderer.renderVisibilitySet(visibleObjects);
		}

		this.simulator.renderer.endRender();
	};

	return renderTask;
});

