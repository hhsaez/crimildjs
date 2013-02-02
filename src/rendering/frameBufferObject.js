define(["./renderResource", "./texture"], function(renderResource, texture) {
	"use strict";

	var frameBufferObject = Object.create(renderResource);

	Object.defineProperties(frameBufferObject, {
		texture: {
			get: function() {
				return this._texture;
			},
			set: function(value) {
				this._texture = value;
			}
		},
		width: {
			get: function() {
				return this._width;
			},
			set: function(value) {
				this._width = width;
			}
		},
		height: {
			get: function() {
				return this._height
			},
			set: function(value) {
				this._height = value;
			}
		},
		clearColor: {
			get: function() {
				return this._clearColor;
			},
			set: function(value) {
				this._clearColor = value;
			}
		},
	});

	frameBufferObject.set = function(spec) {
		spec = spec || {};

		renderResource.set.call(this, spec);

		this._texture = spec.texture || Object.create(texture).set();
		this._width = spec.width || 512;
		this._height = spec.height || 512;
		this._clearColor = vec4.create(spec.clearColor || [0, 0, 0, 1]);

		return this;
	};

	frameBufferObject.destroy = function() {
		renderResource.destroy.call(this);
	};

	return frameBufferObject;

});