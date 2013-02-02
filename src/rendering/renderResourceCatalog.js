define(function() {
	"use strict";

	var renderResourceCatalog = {};

	renderResourceCatalog.contains = function(resource) {
		return resource.catalog === this;
	}

	renderResourceCatalog.register = function(resource) {
		if (!this.contains(resource)) {
			_resources.push(resource);
			resource.catalog = this;
			if (this._onRegisterResource) {
				this._onRegisterResource(resource);
			}
		}
	};

	renderResourceCatalog.unregister = function(resource) {
		if (this.contains(resource)) {
			var index = this._resources.indexOf(resource);
			if (index >= 0) {
				this._resources.splice(index, 1);
				resource.catalog = null;
				if (this._onUnregisterResource) {
					this._onUnregisterResource(resource);
				}
			}
		}
	};

	renderResourceCatalog.each = function(callback) {
		if (callback) {
			for (var r in this._resources) {
				callback(this._resources[r]);
			}
		}
	};

	renderResourceCatalog.clear = function() {
		for (var r in this._resources) {
			var resource = this._resources[r];
			if (resource) {
				resource.catalog = null;
				if (this._onUnregisterResource) {
					this._onRegisterResource(resource);
				}
			}
		}

		this._resources = [];
	};

	renderResourceCatalog.set = function(spec) {
		spec = spec || [];

		this._onRegisterResource = spec.onRegisterResource;
		this._onUnregisterResource = spec.onUnregisterResource;

		return this;
	};

	renderResourceCatalog.destroy = function() {
		this.clear();
	};

	return renderResourceCatalog;

});

