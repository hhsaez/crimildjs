define([], function() {
	"use strict";

	var input = {};

	Object.defineProperties(input, {
		grabInput: {
			get: function() {
				return this._grabInput;
			},
			set: function(value) {
				this._grabInput = value;
			}
		},
		mousePos: {
			get: function() {
				return this._mousePos;
			},
		},
		mouseDelta: {
			get: function() {
				return this._mouseDelta;
			}
		},
	});

	input.isKeyDown = function(code) {
		return this._currentState[code] == true;
	};

	input.isKeyUp = function(code) {
		return this._currentState[code] == false;
	};

	input.isMouseButtonDown = function() {
		return this._mouseButtonDown == true;
	};

	input.isMouseButtonUp = function() {
		return this._mouseButtonDown == false;
	};

	input.set = function(spec) {
		spec = spec || {};

		this._grabInput = spec.grabInput || false;
		this._mouseButtonDown = false;
		this._mousePos = vec2.create([0, 0]);
		this._mouseDelta = vec2.create([0, 0]);
		this._currentState = {};

		document.onkeydown = function(ev) {
			if (this.grabInput) {
				ev.preventDefault();
			}

			input._currentState[ev.keyCode] = true;
		};

		document.onkeyup = function(ev) {
			if (this.grabInput) {
				ev.preventDefault();
			}

			input._currentState[ev.keyCode] = false;
		};

		spec.canvas.onmousedown = function(ev) {
			input._mouseButtonDown = true;
		};

		document.onmousemove = function(ev) {
			input._mouseDelta[0] = ev.clientX - input._mousePos[0];
			input._mouseDelta[1] = ev.clientY - input._mousePos[1];
			input._mousePos[0] = ev.clientX;
			input._mousePos[1] = ev.clientY;
		};

		document.onmouseup = function(ev) {
			input._mouseButtonDown = false;
		};

		return this;
	};

	input.destroy = function() {

	};

	return input;
});

