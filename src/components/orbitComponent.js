define(["../core/nodeComponent", "../traversal/worldStateUpdate"], function(nodeComponent, worldStateUpdate) {
	"use strict";

	var orbitComponent = Object.create(nodeComponent);

	orbitComponent.update = function(time) {
        this.node.local.translate[0] = this._x0 + this._major * Math.cos(this._t) * Math.cos(this._gamma) - this._minor * Math.sin(this._t) * Math.sin(this._gamma);
        this.node.local.translate[1] = this._y0 + this._major * Math.cos(this._t) * Math.sin(this._gamma) + this._minor * Math.sin(this._t) * Math.cos(this._gamma);

        this._t += this._speed * time.deltaTimeInSec;

        this.node.perform(worldStateUpdate);
	};

	orbitComponent.set = function(spec) {
		spec = spec || {};

        spec.name = spec.name || "orbit";
		nodeComponent.set.call(this, spec);

		this._x0 = spec._x0 || 0;
        this._y0 = spec._y0 || 0;
        this._major = spec.major || 20;
        this._minor = spec.minor || 20;
        this._t = 0;
        this._speed = spec.speed || 1;
        this._gamma = spec.gamma || 0;

		return this;
	};

	return orbitComponent;
});

