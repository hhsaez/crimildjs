define(["foundation/namedObject", "foundation/objectFactory"], function(namedObject, objectFactory) {
	"use strict";

	var primitive = Object.create(namedObject);

	primitive.types = {
		POINTS: 1,
		LINES: 10,
		LINE_LOOP: 11,
		LINE_STRIP: 12, 
		TRIANGLES: 20,
		TRIANGLE_LOOP: 21,
		TRIANGLE_STRIP: 22
	};

	Object.defineProperties(primitive, {
		type: {
			get: function() {
				return this._type;
			},
			set: function(value) {
				this._type = value;
			}
		},
		vertexBuffer: {
			get: function() {
				return this._vertexBuffer;
			},
			set: function(value) {
				if (this._vertexBuffer) {
					this._vertexBuffer.destroy();
				}
				this._vertexBuffer = value;
			}
		},
		indexBuffer: {
			get: function() {
				return this._indexBuffer;
			},
			set: function(value) {
				if (this._indexBuffer) {
					this._indexBuffer.destroy();
				}
				this._indexBuffer = value;
			}
		}
	});

	primitive.set = function(spec) {
		spec = spec || {};
		
		namedObject.set.call(this, spec);

		this._type = spec.type || primitive.types.TRIANGLES;
		this._vertexBuffer = spec.vertexBuffer ? objectFactory.inflate(spec.vertexBuffer) : null;
		this._indexBuffer = spec.indexBuffer ? objectFactory.inflate(spec.indexBuffer) : null;

		return this;
	};

	primitive.destroy = function() {
		if (this.vertexBuffer) {
			this.vertexBuffer.destroy();
		}

		if (this.indexBuffer) {
			this.indexBuffer.destroy();
		}

		namedObject.destroy.call(this);
	};

	return primitive;
});

