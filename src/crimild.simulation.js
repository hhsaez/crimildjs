define(["./crimild.core", "./crimild.rendering", "../lib/webgl-utils"], function(core, rendering, webgl) {
	var simulator = {};

	var fetchCameras = function(spec) {
		spec = spec || {};

		var that = core.nodeVisitor(spec);
		var result = spec.result || [];

		that.visitNode = function(aNode) {
			var cc = aNode.getComponent("camera");
			if (cc && cc.camera) {
				result.push(cc.camera);
			}
		};

		that.visitGroupNode = function(aGroup) {
			that.visitNode(aGroup);

			for (var i = 0; i < aGroup.getNodeCount(); i++) {
				aGroup.getNodeAt(i).accept(that);
			}
		};

		that.visitGeometryNode = function(aGeometry) {
			that.visitNode(aGeometry);
		};

		that.getResults = function() {
			return results;
		};

		return that;
	}

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
			for (var i = 0; i < simulator.getSceneCount(); i++) {
				var scene = simulator.getSceneAt(i);
				if (scene.root) {
					scene.root.perform(core.updateScene());
				}
			}
		};

		return that;
	};

	var renderSceneTask = function(spec) {
		var that = task(spec);

		that.onUpdate = function() {
			simulator.getRenderer().clearBuffers();

			var visibilitySet = rendering.visibilitySet();
			for (var i = 0; i < simulator.getSceneCount(); i++) {
				var scene = simulator.getSceneAt(i);

				if (scene.cameras.length > 0) {
					for (var c in scene.cameras) {
						scene.root.perform(rendering.computeVisibilitySet({result: visibilitySet, camera: scene.cameras[c]}));
						simulator.getRenderer().renderVisibilitySet(visibilitySet);
					}
				}
				else {
					scene.root.perform(rendering.computeVisibilitySet({result: visibilitySet}));
					simulator.getRenderer().renderVisibilitySet(visibilitySet);
				}
			}
		};

		return that;
	};

	var input = function(spec) {
		spec = spec || {};
		
		var that = {};
		
		var _grabInput = spec.grabInput || false;
		var _mouseButtonDown = false;
		var _mousePos = vec2.create();
		var _mouseDelta = vec2.create();

		Object.defineProperties(that, {
			grabInput: {
				get: function() {
					return _grabInput;
				},
				set: function(value) {
					_grabInput = value;
				}
			},
		});

		var currentState = {};

		document.onkeydown = function(ev) {
			if (_grabInput) {
				ev.preventDefault();
			}
			currentState[ev.keyCode] = true;
		};

		document.onkeyup = function(ev) {
			if (_grabInput) {
				ev.preventDefault();
			}
			currentState[ev.keyCode] = false;
		};

		spec.canvas.onmousedown = function(ev) {
			_mouseButtonDown = true;
		};

		document.onmouseup = function(ev) {
			_mouseButtonDown = false;
		};

		document.onmousemove = function(ev) {
			_mouseDelta[0] = ev.clientX - _mousePos[0];
			_mouseDelta[1] = ev.clientY - _mousePos[1];
			_mousePos[0] = ev.clientX;
			_mousePos[1] = ev.clientY;
		};

		that.isKeyDown = function(code) {
			return currentState[code] == true;
		};

		that.isKeyUp = function(code) {
			return currentState[code] == false;
		};

		that.isMouseButtonDown = function() {
			return _mouseButtonDown == true;
		};

		that.isMouseButtonUp = function() {
			return _mouseButtonDown == false;
		};

		that.getMousePos = function(dest) {
			if (!dest) {
				dest = vec2.create;
			}
			vec2.set(_mousePos, dest);
			return dest;
		};

		that.getMouseDelta = function(dest) {
			if (!dest) {
				dest = vec2.create;
			}
			vec2.set(_mouseDelta, dest);
			return dest;
		};

		return that;
	};

	var run = function(spec) {
		spec = spec || {};

		var renderer = rendering.renderer();
		var tasks = taskManager();
		var scenes = [];

		simulator.addScene = function(root) {
			root.perform(core.worldStateUpdate());
			root.perform(rendering.renderStateUpdate());

			var cameras = [];
			root.perform(fetchCameras({result: cameras}));

			scenes.push({root: root, cameras: cameras});
		};

		simulator.getSceneCount = function() {
			return scenes.length;
		};

		simulator.getSceneAt = function(index) {
			return scenes[index];
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

		simulator.getTasks().startTask(videoTask({priority: 0}));
		simulator.getTasks().startTask(updateSceneTask({priority: 100}));
		simulator.getTasks().startTask(renderSceneTask({priority: 200}));

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

		if (spec.scenes) {
			for (var i in spec.scenes) {
				simulator.addScene(spec.scenes[i]);
			}
		}

		simulator.input = input(spec);

		simulator.tick();

		return simulator;
	};

	return {
		run: run,
		simulator: simulator
	}

});

