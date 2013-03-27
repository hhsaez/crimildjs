define(function() {
	"use strict";

	var vertexFormat = {};

	Object.defineProperties(vertexFormat, {
		positions: {
			get: function() {
				return this._positions;
			},
			set: function(value) {
				this._positions = value;
			}
		},
		normals: {
			get: function() {
				return this._normals;
			},
			set: function(value) {
				this._normals = value;
			}
		},
		colors: {
			get: function() {
				return this._colors;
			},
			set: function(value) {
				this._colors = value;
			}
		},
		textureCoords: {
			get: function() {
				return this._textureCoords;
			},
			set: function(value) {
				this._textureCoords = value;
			}
		},
		tangents: {
			get: function() {
				return this._tangents;
			},
			set: function(value) {
				this._tangents = value;
			}
		},
		weights: {
			get: function() {
				return this._weights;
			},
			set: function(value) {
				this._weights = value;
			}
		},
	});

	vertexFormat.getPositionsOffset = function() {
		return 0;
	},

	vertexFormat.getPositionsOffsetInBytes = function() {
		return 4 * this.getPositionsOffset();
	},

	vertexFormat.getNormalsOffset = function() {
		return this.getPositionsOffset() + this.positions;
	};

	vertexFormat.getNormalsOffsetInBytes = function() {
		return 4 * this.getNormalsOffset();
	};

	vertexFormat.getColorsOffset = function() {
		return this.getNormalsOffset() + this.normals;
	},

	vertexFormat.getColorsOffsetInBytes = function() {
		return 4 * this.getColorsOffset();
	},

	vertexFormat.getTextureCoordsOffset = function() {
		return this.getColorsOffset() + this.colors;
	};

	vertexFormat.getTextureCoordsOffsetInBytes = function() {
		return 4 * this.getTextureCoordsOffset();
	};

	vertexFormat.getTangentsOffset = function() {
		return this.getTextureCoordsOffset() + this.textureCoords;
	};

	vertexFormat.getTangentsOffsetInBytes = function() {
		return 4 * this.getTangentsOffset();
	};

	vertexFormat.getWeightsOffset = function() {
		return this.getTangentsOffset() + this.tangents;
	};

	vertexFormat.getWeightsOffsetInBytes = function() {
		return 4 * this.getWeightsOffset();
	};

	vertexFormat.getVertexSize = function() {
		return this.positions + this.normals + this.colors + this.textureCoords + this.tangents + this.weights;
	};

	vertexFormat.getVertexSizeInBytes = function() {
		// sizeof(float) == 4
		return 4 * this.getVertexSize();
	};

	vertexFormat.set = function(spec) {
		spec = spec || {};

		this._positions = spec.positions || 3;
		this._normals = spec.normals || 0;
		this._colors = spec.colors || 0;
		this._textureCoords = spec.textureCoords || 0;
		this._tangents = spec.tangents || 0;
		this._weights = spec.weights || 0;

		return this;
	};

	vertexFormat.destroy = function() {

	};

	return vertexFormat;	
});

