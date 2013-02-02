define(function() {
	"use strict";

	var renderState = {};

	Object.defineProperties(renderState, {
		enabled: {
			get: function() {
				return this._enabled;
			},
			set: function(value) {
				this._enabled = value;
			}
		}
	})

	renderState.isEnabled = function() {
		return this.enabled;
	};

	renderState.set = function(spec) {
		spec = spec || {};

		this._enabled = spec.enabled || true;

		return this;
	};

	renderState.destroy = function() {

	};

	return renderState;
});

