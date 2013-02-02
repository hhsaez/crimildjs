define(["./renderResource"], function(renderResource) {
	"use strict";

	var shader = Object.create(renderResource);

	Object.defineProperties(shader, {
		text: {
			get: function() {
				return this._text;
			},
			set: function(value) {
				this._text = value;
			}
		}
	});

	shader.set = function(spec) {
		spec = spec || {};

		renderResource.set.call(this, spec);

		this._text = spec.text || "";

		return this;
	};

	shader.destroy = function() {
		renderResource.destroy.call(this);
	};

	return shader;
});

