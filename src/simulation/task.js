define(["foundation/namedObject"], function(namedObject) {
	"use strict";

	var task = Object.create(namedObject);

	Object.defineProperties(task, {
		priority: {
			get: function() {
				return this._priority;
			}
		},
		simulator: {
			get: function() {
				return this._simulator;
			},
			set: function(value) {
				this._simulator = value;
			}
		}
	});

	task.onStart = function() {};
	task.onUpdate = function() {};
	task.onStop = function() {};
	task.onSuspend = function() {};
	task.onResume = function() {};

	task.set = function(spec) {
		spec = spec || {};

		namedObject.set.call(this, spec);

		this._priority = spec.priority || 0;
		this._simulator = null;

		return this;
	};

	task.destroy = function() {
		namedObject.destroy.call(this);
	};

	return task;
});

