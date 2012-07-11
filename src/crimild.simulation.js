define(["./crimild.core", "./crimild.rendering", "../lib/webgl-utils"], function(core, rendering, webgl) {
	var simulator = {};

	var task = function(spec) {
		var that = {};
		var priority = 0;
		
		if (spec) {
			if (spec.priority) {
				priority = spec.priority;
			}
		}

		that.getPriority = function() {
			return priority;
		};
		that.setPriority = function(value) {
			priority = value;
		}

		that.onStart = function() {

		};
		that.onUpdate = function() {

		};
		that.onStop = function() {

		};
		that.onSuspend = function() {

		}
		that.onResume = function() {

		};

		return that;
	};

	var taskManager = function(spec) {
		var that = {};
		var activeTasks = [];
		var suspendedTasks = [];

		that.startTask = function(task) {
			activeTasks.push(task);
		};

		that.stopTask = function(task) {

		};

		that.suspendTask = function(task) {

		};

		that.resumeTask = function(task) {

		};

		that.updateAll = function() {
			for (var i in activeTasks) {
				var task = activeTasks[i];
				task.onUpdate();
			}

			return true;
		};

		return that;
	};

	var videoTask = function(spec) {
		var that = task(spec);

		that.onStart = function() {
			console.log("start video");
		};

		return that;
	};

	var updateSceneTask = function(spec) {
		var that = task(spec);

		that.onUpdate = function() {
			var scene = simulator.getScene();
			if (scene) {
				scene.perform(core.updateScene());
			}
		};

		return that;
	};

	var renderSceneTask = function(spec) {
		var that = task(spec);

		that.onUpdate = function() {
			simulator.getRenderer().clearBuffers();

			var visibilitySet = rendering.visibilitySet();
			simulator.getScene().perform(rendering.computeVisibilitySet({result: visibilitySet}));
			simulator.getRenderer().renderVisibilitySet(visibilitySet);
		};

		return that;
	}

	var run = function(spec) {
		var renderer = rendering.renderer();
		var scene = null;
		var tasks = taskManager();

		simulator.setScene = function(aScene) {
			scene = aScene;

			scene.perform(core.worldStateUpdate());
			scene.perform(rendering.renderStateUpdate());
		};

		simulator.getScene = function() {
			return scene;
		};

		simulator.getTasks = function() {
			return tasks;
		};

		simulator.getRenderer = function() {
			return renderer;
		};

		simulator.tick = function() {
			requestAnimFrame(simulator.tick);
			simulator.getTasks().updateAll();
		};

		console.log("Starting " + core.getFullVersion());

		simulator.getTasks().startTask(videoTask({priority: 0}));
		simulator.getTasks().startTask(updateSceneTask({priority: 100}));
		simulator.getTasks().startTask(renderSceneTask({priority: 200}));

		if (spec) {
			var canvas = spec.canvas;
			if (!canvas) {
				alert("No canvas provided");
				return null;
			}

    		try {
    			gl = canvas.getContext("experimental-webgl");
    		}
    		catch(e) {
    			console.log("Error initializing GL Context:", e);	
    		}
    		
    		if (!gl) {
    			alert("Could not initialize WebGL, sorry :(");
				return null;
    		}

			renderer.configure(gl, canvas.width, canvas.height);

			if (spec.scene) {
				simulator.setScene(spec.scene);
			}
		}

		simulator.tick();

		return simulator;
	};

	return {
		run: run,
		simulator: simulator
	}

});

