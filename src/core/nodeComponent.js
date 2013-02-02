define(["foundation/namedObject"], function(namedObject) {
	"use strict";

	var nodeComponent = Object.create(namedObject);

	Object.defineProperties(nodeComponent, {
		node: {
			get: function() {
				return this._node;
			},
			set: function(value) {
				this._node = value;
			}
		},
	});

	nodeComponent.onAttach = function() {

	};

	nodeComponent.onDetach = function() {

	};

	nodeComponent.update = function() {

	};

	nodeComponent.set = function(spec) {
		spec = spec || {};

		namedObject.set.call(this, spec);

		this._node = null;

		return this;
	};

	nodeComponent.destroy = function() {
		namedObject.destroy.call(this);
	};

	return nodeComponent;
});

