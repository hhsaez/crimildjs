define(["./renderResource"], function(renderResource) {
	"use strict";

	var indexBufferObject = Object.create(renderResource);

	Object.defineProperties(indexBufferObject, {
		data: {
			get: function() {
				return this._data;
			}
		},
		indexCount: {
			get: function() {
				return this._indexCount;
			}
		},
	});

	indexBufferObject.set = function(spec) {
		spec = spec || {};
		
		renderResource.set.call(this, spec);

		this._data = new Uint16Array(spec.data || []);
		this._indexCount = spec.indexCount || [];

		return this;
	};

	return indexBufferObject;
});

