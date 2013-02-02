define(["./renderResource", "./vertexFormat"], function(renderResource, vertexFormat) {
	"use strict";

	var vertexBufferObject = Object.create(renderResource);

	Object.defineProperties(vertexBufferObject, {
		data: {
			get: function() {
				return this._data;
			},
		},
		vertexCount: {
			get: function() {
				return this._vertexCount;
			}
		},
		vertexFormat: {
			get: function() {
				return this._vertexFormat;
			}
		},
	});

	vertexBufferObject.set = function(spec) {
		spec = spec || {};

		renderResource.set.call(this, spec);

		this._data = new Float32Array(spec.data || []);
		this._vertexCount = spec.vertexCount || 0;
		this._vertexFormat = Object.create(vertexFormat).set(spec.vertexFormat);

		return this;
	};

	vertexBufferObject.destroy = function() {
		renderResource.destroy.call(this);
	};

	return vertexBufferObject;
});
