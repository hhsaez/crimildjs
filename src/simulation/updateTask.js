define(["./task", "traversal/updateComponents", "traversal/worldStateUpdate", "traversal/renderStateUpdate"], 
	function(task, updateComponents, worldStateUpdate, renderStateUpdate) {
	
	"use strict";

	var updateTask = Object.create(task);

	updateTask.onStart = function() {
		this._startTime = new Date().getTime();
		this._lastTime = this._startTime;

		this.simulator.scene.perform(worldStateUpdate.set());
		this.simulator.scene.perform(renderStateUpdate.set());
	};

	updateTask.onUpdate = function() {
		var appTime = new Date().getTime() - this._startTime;
		var deltaTime = appTime - this._lastTime;
		if (deltaTime < 0) {
			deltaTime = 0;
		}
		this._lastTime = appTime;

		this.simulator.scene.perform(updateComponents.set({ 
			appTime: appTime, 
			appTimeInSec: appTime * 0.001,
			deltaTime: deltaTime,
			deltaTimeInSec: deltaTime * 0.001,
		}));
	};

	return updateTask;	
});

