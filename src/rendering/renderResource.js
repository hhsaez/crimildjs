define(["foundation/namedObject"], function(namedObject) {
	"use strict";

	var renderResource = Object.create(namedObject);

	Object.defineProperties(renderResource, {
		catalog: {
			get: function() {
				return this._catalog;
			},
			set: function(value) {
				this._catalog = value;
			}
		},
		renderCache: {
			get: function() {
				return this._renderCache;
			},
			set: function(value) {
				this._renderCache = value;
			}
		},
	});

	renderResource.set = function(spec) {
		spec = spec || {};

		namedObject.set.call(this, spec);

		this._catalog = null;
		this._renderCache = null;

		return this;
	};

	renderResource.destroy = function() {
		if (this.catalog) {
			this.catalog.unregister(this);
		}

		namedObject.destroy.call(this);
	};

	return renderResource;
});

