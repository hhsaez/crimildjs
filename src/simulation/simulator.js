define([
		"third-party/webgl-utils", 
		"./updateTask", 
		"./renderTask", 
		"./input",
		"foundation/objectFactory", 
		"rendering/renderer",
	], 
	function(
		webgl, 
		updateTask, 
		renderTask, 
		input,
		objectFactory, 
		renderer
	) {

	"use strict";

	var simulator = {};

	Object.defineProperties(simulator, {
		scene: {
			get: function() {
				return this._scene;
			}
		},
		renderer: {
			get: function() {
				return this._renderer;
			}
		},
		input: {
			get: function() {
				return this._input;
			}
		},
	});

	simulator.startTask = function(aTask) {
		this._tasks.push(aTask);
		aTask.simulator = this;
		aTask.onStart();
	};

	simulator.update = function() {
		var that = this;
		requestAnimFrame(function() {
			that.update();
		})

		for (var t in this._tasks) {
			this._tasks[t].onUpdate();
		}
	};

	simulator.set = function(spec) {
		spec = spec || {};

		this._scene = objectFactory.inflate(spec.scene);
		if (!this.scene) {
			alert("Cannot start simulation because no scene was provided");
			return null;
		}
		
		this._renderer = Object.create(renderer).set(spec.renderer);
		if (!this.renderer) {
			return null;
		}

		this._tasks = [];
		this.startTask(Object.create(updateTask).set());
		this.startTask(Object.create(renderTask).set());

		this._input = input;
		this.input.set({
			grabInput: spec.grabInput
		});

		// start the update cycle
		this.update();

		return this;
	};

	simulator.destroy = function() {

	};

	return simulator;
});

