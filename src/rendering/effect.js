define([
		"foundation/namedObject", 
		"foundation/collection",
		"./alphaState",
		"./depthState",
		"./cullState",
		"./polygonOffsetState",
		"./shaderProgram",
	], function(
		namedObject, 
		collection,
		alphaState,
		depthState,
		cullState,
		polygonOffsetState,
		shaderProgram
	) {

	"use strict";

	var effect = Object.create(namedObject);

	Object.defineProperties(effect, {
		shaderProgram: {
			get: function() {
				return this._shaderProgram;
			},
		},
		textures: {
			get: function() {
				return this._textures;
			}
		},
		ambient: {
			get: function() {
				return this._ambient;
			},
			set: function(value) {
				vec3.set(value, this._ambient);
			}
		},
		diffuse: {
			get: function() {
				return this._diffuse;
			},
			set: function (value) {
				vec3.set(value, this._diffuse);
			}
		},
		specular: {
			get: function() {
				return this._specular;
			},
			set: function(value) {
				vec3.set(value, this._specular);
			}
		},
		shininess: {
			get: function() {
				return this._shininess;
			},
			set: function(value) {
				this._shininess = value;
			}
		},
		alphaState: {
			get: function() {
				return this._alphaState;
			},
			set: function(vaue) {
				this._alphaState = alphaState;
			}
		},
		depthState: {
			get: function() {
				return this._depthState;
			},
			set: function(value) {
				this._depthState = value;
			}
		},
		cullState: {
			get: function() {
				return this._cullState;
			},
			set: function(value) {
				this._cullState = value;
			}
		},
		polygonOffsetState: {
			get: function() {
				return this._polygonOffsetState;
			},
			set: function(value) {
				this._polygonOffsetState = value;
			}
		},
	});

	effect.set = function(spec) {
		spec = spec || {};

		namedObject.set.call(this, spec);

		if (spec.shaderProgram) {
			this._shaderProgram = Object.create(shaderProgram).set(spec.shaderProgram);	
		}
		else {
			this._shaderProgram = null;
		}

		this._ambient = vec3.create(spec.ambient || [0.2, 0.2, 0.2]);
		this._diffuse = vec3.create(spec.diffuse || [0.8, 0.8, 0.8]);
		this._specular = vec3.create(spec.specular || [0.8, 0.8, 0.8]);
		this._shininess = spec.shininess || 50;
		
		this._alphaState = Object.create(alphaState).set(spec.alphaState);
		this._depthState = Object.create(depthState).set(spec.depthState);
		this._cullState = Object.create(cullState).set(spec.cullState);
		this._polygonOffsetState = Object.create(polygonOffsetState).set(spec.polygonOffsetState);

		this._textures = Object.create(collection).set({
			destroyElementsOnClear: false,
			elements: spec.textures
		});

		return this;
	};

	effect.destroy = function() {
		this.textures.destroy();
		this.program.destroy();
		this.alphaState.destroy();
		this.depthState.destroy();
		this.cullState.destroy();

		namedObject.destroy.call(this);
	};

	return effect;
});

