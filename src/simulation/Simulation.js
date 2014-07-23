/*
 * Copyright (c) 2013, Hugo Hernan Saez
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: 
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer. 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution. 
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

define(function(require) {

	"use strict";

	var Base = require("foundation/CrimildObject");

	var webgl = require("third-party/webgl-utils");
	var Renderer = require("rendering/Renderer");
	
	var BeginRenderTask = require("simulation/tasks/BeginRenderTask");
	var EndRenderTask = require("simulation/tasks/EndRenderTask");
	var RenderSceneTask = require("simulation/tasks/RenderSceneTask");
	var UpdateSceneTask = require("simulation/tasks/UpdateSceneTask");
	
	var StartComponents = require("visitors/StartComponents");
	var UpdateWorldState = require("visitors/UpdateWorldState");
	var FetchCameras = require("visitors/FetchCameras");

	function Simulation(spec) {
		spec = spec || {}
		Base.call(this, spec);

		this.scene = spec.scene || new Group({ name: "Dummy scene" });
		
		this.renderer = spec.renderer || new Renderer(spec);
		this.renderer.configure();
		
		this.tasks = [];	// TODO: allow user to add tasks in constructor
		this.startTask(new BeginRenderTask());
		this.startTask(new UpdateSceneTask());
		this.startTask(new RenderSceneTask());
		this.startTask(new EndRenderTask());
	}

	Simulation.prototype = Object.create(Base.prototype);

	Simulation.prototype.destroy = function() {
		Base.apply(this);
	};

	Object.defineProperties(Simulation.prototype, {
		scene: {
			get: function() { return this._scene; },
			set: function(value) { this._scene = value; this.setupScene(); }
		},
		mainCamera: {
			get: function() { return this._mainCamera; },
			set: function(value) { this._mainCamera = value; }
		},
		renderer: {
			get: function() { return this._renderer; },
			set: function(value) { this._renderer = value; }
		},
		tasks: {
			get: function() { return this._tasks; },
			set: function(value) { this._tasks = value; }
		}
	});

	Simulation.prototype.setupScene = function() {
		if (this.scene) {
			var fetchCameras = new FetchCameras();
			this.scene.perform(fetchCameras);
			this.mainCamera = fetchCameras.results[0];

			this.scene.perform(new StartComponents());
			this.scene.perform(new UpdateWorldState());
		}
	};

	Simulation.prototype.startTask = function(task) {
		// TODO: implement priorities
		this.tasks.push(task);
	};

	Simulation.prototype.step = function() {
		var that = this;
		requestAnimFrame(function() {
			that.step();
		});

		for (var t in this.tasks) {
			this.tasks[t].update(this);
		}
	};

	Simulation.prototype.run = function() {
		this.log.debug("Starting tasks");
		for (var i in this.tasks) {
			this.tasks[i].start(this);
		}

		this.step();
	};

	return Simulation;

});

