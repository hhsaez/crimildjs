define(["./renderResource"], function(renderResource) {
	"use strict";

	var texture = Object.create(renderResource);

	Object.defineProperties(texture, {
		image: {
			get: function() {
				return this._image;
			},
			set: function(value) {
				this._image = value;
			}
		}
	});

	texture.set = function(spec) {
		spec = spec || {};

		renderResource.set.call(this, spec);

		this._image = spec.image;

		return this;
	};

	texture.destroy = function() {
		if (this.image) this.image.destroy();

		renderResource.destroy.call(this);
	};

	return texture;
});

