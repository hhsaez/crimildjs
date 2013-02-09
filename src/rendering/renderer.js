define([
		"foundation/objectFactory",
		"math/utility",
		"./frameBufferObject",
		"./renderResourceCatalog",
		"./primitive",
		"./effect",
		"./shaderUniform",
		"./shaderProgram",
		"./geometryNode",
		"./vertexBufferObject",
		"./vertexFormat",
		"./indexBufferObject",
		"primitives/planePrimitive",
		"text!../../shaders/texture_lighting.vert",
		"text!../../shaders/texture_lighting.frag",
		"text!../../shaders/screen.vert",
		"text!../../shaders/screen.frag",
	], function(
		objectFactory,
		mathUtils,
		frameBufferObject,
		renderResourceCatalog,
		primitive,
		effect,
		shaderUniform,
		shaderProgram,
		geometryNode,
		vertexBufferObject,
		vertexFormat,
		indexBufferObject,
		planePrimitive,
		texture_lighting_vs,
		texture_lighting_fs,
		screen_vs,
		screen_fs
	) {

	"use strict";

	var renderer = {};

	Object.defineProperties(renderer, {
		canvas: {
			get: function() {
				return this._canvas;
			}
		},
		gl: {
			get: function() {
				return this._gl;
			}
		},
		defaultFrameBuffer: {
			get: function() {
				return this._defaultFrameBuffer;
			}
		},
		screenPrimitive: {
			get: function() {
				return this._screenPrimitive;
			}
		},
		camera: {
			get: function() {
				return this._camera;
			},
			set: function(value) {
				this._camera = value;

				this.onCameraViewportChange();
				this.onCameraFrustumChange();
				this.onCameraFrameChange();
			}
		},
		defaultEffect: {
			get: function() {
				return this._defaultEffect;
			}
		},
		defaultScreenEffect: {
			get: function() {
				return this._defaultScreenEffect;
			}
		},
		defaultShaderProgram: {
			get: function() {
				return this._defaultShaderProgram;
			}
		},
		clearColor: {
			get: function() {
				return this._clearColor;
			},
			set: function(value) {
				this._clearColor = clearColor;
			}
		},
		pMatrix: {
			get: function() {
				return this._pMatrix;
			},
			set: function(value) {
				this._pMatrix = value;
			}
		},
		mMatrix: {
			get: function() {
				return this._mMatrix;
			},
			set: function(value) {
				this._mMatrix = value;
			}
		},
		vMatrix: {
			get: function() {
				return this._vMatrix;
			},
			set: function(value) {
				this._vMatrix = value;
			}
		},
		mvMatrix: {
			get: function() {
				return this._mvMatrix;
			},
			set: function(value) {
				this._mvMatrix = value;
			}
		},
	});

	renderer.clearBuffers = function() {
		this.gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	};

	renderer.onCameraViewportChange = function() {
		if (this.camera) {
			var vp = this.camera.viewport;
			this.gl.viewport(vp[0] * this.defaultFrameBuffer.width, vp[1] * this.defaultFrameBuffer.height, vp[2] * this.defaultFrameBuffer.width, vp[3] * this.defaultFrameBuffer.height);
		}
		else {
			this.gl.viewport(0, 0, this.defaultFrameBuffer.width, this.defaultFrameBuffer.height);
		}
	};

	renderer.onCameraFrustumChange = function() {
		if (this.camera) {
			this.camera.computeProjectMatrix(this.pMatrix);
		}
		else {
			mat4.perspective(45, this.canvas.width / this.canvas.height, 0.1, 1000.0, this.pMatrix);
		}
	};

	renderer.onCameraFrameChange = function() {
		if (this.camera) {
			this.camera.computeViewMatrix(this.vMatrix);
		}
		else {
			mat4.identity(this.vMatrix);
		}
	};

	renderer.getUniformByName = function(aProgram, name) {
		return this.gl.getUniformLocation(aProgram.renderCache, name);
	};

	renderer.getAttribByName = function(aProgram, name) {
		return this.gl.getAttribLocation(aProgram.renderCache, name);
	};

	renderer.setUniformBool = function(uniform, x) {
		this.setUniformInt(uniform, x == true ? 1 : 0);
	};

	renderer.setUniformInt = function(uniform, x, y, z, w) {
		if (uniform) {
			if (w != null) {
				this.gl.uniform4i(uniform, x, y, z, w);
			}
			else if (z != null) {
				this.gl.uniform3i(uniform, x, y, z);
			}
			else if (y != null) {
				this.gl.uniform2i(uniform, x, y);
			}
			else if (x != null) {
				this.gl.uniform1i(uniform, x);
			}
		}
	};

	renderer.setUniformFloat = function(uniform, x, y, z, w) {
		if (uniform) {
			if (w != null) {
				this.gl.uniform4f(uniform, x, y, z, w);
			}
			else if (z != null) {
				this.gl.uniform3f(uniform, x, y, z);
			}
			else if (y != null) {
				this.gl.uniform2f(uniform, x, y);
			}
			else if (x != null) {
				this.gl.uniform1f(uniform, x);
			}
		}
	},

	renderer.setCustomUniform = function(uniform, aProgram) {
		if (!uniform || !uniform.name) {
			return;
		}

		var uniformLocation = aProgram.renderCache.customUniforms[uniform.name];
		
		if (!uniformLocation) {
			uniformLocation = this.gl.getUniformLocation(aProgram.renderCache, uniform.name);
			if (uniformLocation) {
    			aProgram.renderCache.customUniforms[uniform.name] = uniformLocation;
			}
		}

		if (uniformLocation) {
			if (uniform.type === shaderUniform.types.BOOL) {
				if (uniform.count === 1) {
					this.setUniformInt(uniformLocation, uniform.data ? 1 : 0);
				}
			}
			else if (uniform.type === shaderUniform.types.FLOAT) {
				if (uniform.count === 1) {
					this.setUniformFloat(uniformLocation, uniform.data);
				}
				else if (uniform.count === 2) {
					this.setUniformFloat(uniformLocation, uniform.data[0], uniform.data[1]);
				}
				else if (uniform.count === 3) {
					this.setUniformFloat(uniformLocation, uniform.data[0], uniform.data[1], uniform.data[2]);
				}
				else if (uniform.count === 3) {
					this.setUniformFloat(uniformLocation, uniform.data[0], uniform.data[1], uniform.data[2], uniform.data[3]);
				}
			}
		}
	},

	renderer.setMatrixUniforms = function(aProgram) {
		this.gl.uniformMatrix4fv(aProgram.renderCache.pMatrixUniform, false, this.pMatrix);

		if (aProgram.renderCache.modelViewMatrixUniform) {
			this.gl.uniformMatrix4fv(aProgram.renderCache.modelViewMatrixUniform, false, this.mvMatrix);
		}
		else {
			this.gl.uniformMatrix4fv(aProgram.renderCache.modelMatrixUniform, false, this.mMatrix);
			this.gl.uniformMatrix4fv(aProgram.renderCache.viewMatrixUniform, false, this.vMatrix);	
		}

		if (aProgram.renderCache.nMatrixUniform) {
            var normalMatrix = mat3.create();
            mat4.toInverseMat3(this.mvMatrix, normalMatrix);
            mat3.transpose(normalMatrix);
            this.gl.uniformMatrix3fv(aProgram.renderCache.nMatrixUniform, false, normalMatrix);
		}
	},

	renderer.compileShader = function(aShader, shaderType) {
		aShader.renderCache = this.gl.createShader(shaderType);
		this.gl.shaderSource(aShader.renderCache, aShader.text);
		this.gl.compileShader(aShader.renderCache);

		if (!this.gl.getShaderParameter(aShader.renderCache, this.gl.COMPILE_STATUS)) {
			alert("Error compiling shader: " + this.gl.getShaderInfoLog(aShader.renderCache));
		}

		aShader.renderCache.renderer = this;
	};

	renderer.loadProgram = function(aProgram) {
		this.compileShader(aProgram.vertexShader, this.gl.VERTEX_SHADER);
		this.compileShader(aProgram.fragmentShader, this.gl.FRAGMENT_SHADER);

		aProgram.renderCache = this.gl.createProgram();
		this.gl.attachShader(aProgram.renderCache, aProgram.vertexShader.renderCache);
		this.gl.attachShader(aProgram.renderCache, aProgram.fragmentShader.renderCache);
		this.gl.linkProgram(aProgram.renderCache);
		if (!this.gl.getProgramParameter(aProgram.renderCache, this.gl.LINK_STATUS)) {
			alert("Could not initialize shaders");
		}

		this.gl.useProgram(aProgram.renderCache);

		aProgram.renderCache.vertexPositionAttribute = this.gl.getAttribLocation(aProgram.renderCache, "aVertexPosition");
		this.gl.enableVertexAttribArray(aProgram.renderCache.vertexPositionAttribute);

		aProgram.renderCache.vertexNormalAttribute = this.gl.getAttribLocation(aProgram.renderCache, "aVertexNormal");
		if (aProgram.renderCache.vertexNormalAttribute >= 0) {
			this.gl.enableVertexAttribArray(aProgram.renderCache.vertexNormalAttribute);
		}

		aProgram.renderCache.vertexColorAttribute = this.gl.getAttribLocation(aProgram.renderCache, "aVertexColor");
		if (aProgram.renderCache.vertexColorAttribute >= 0) {
			this.gl.enableVertexAttribArray(aProgram.renderCache.vertexColorAttribute);
		}

		aProgram.renderCache.vertexTextureCoordAttribute = this.gl.getAttribLocation(aProgram.renderCache, "aTextureCoord");
		if (aProgram.renderCache.vertexTextureCoordAttribute >= 0) {
        	this.gl.enableVertexAttribArray(aProgram.renderCache.vertexTextureCoordAttribute);
        }
		
		aProgram.renderCache.vertexTangentAttribute = this.gl.getAttribLocation(aProgram.renderCache, "aVertexTangent");
		if (aProgram.renderCache.vertexTangentAttribute >= 0) {
			this.gl.enableVertexAttribArray(aProgram.renderCache.vertexTangentAttribute);
		}

		aProgram.renderCache.pMatrixUniform = this.gl.getUniformLocation(aProgram.renderCache, "uPMatrix");
		aProgram.renderCache.modelViewMatrixUniform = this.gl.getUniformLocation(aProgram.renderCache, "uMVMatrix");
		aProgram.renderCache.modelMatrixUniform = this.gl.getUniformLocation(aProgram.renderCache, "uMMatrix");
		aProgram.renderCache.viewMatrixUniform = this.gl.getUniformLocation(aProgram.renderCache, "uVMatrix");
		aProgram.renderCache.nMatrixUniform = this.gl.getUniformLocation(aProgram.renderCache, "uNMatrix");

		aProgram.renderCache.useLightingUniform = this.gl.getUniformLocation(aProgram.renderCache, "uUseLighting");
		aProgram.renderCache.lightCountUniform = this.gl.getUniformLocation(aProgram.renderCache, "uLightCount");
		aProgram.renderCache.lightsUniform = [];
		var lightPosId = 0;
		var lightIdx = 0;
		do {
			lightPosId = this.gl.getUniformLocation(aProgram.renderCache, "uLights[" + lightIdx + "].Position");
			if (lightPosId != null) {
				var aLightUniform = {};
				aLightUniform.Position = lightPosId;
				aLightUniform.Attenuation = this.gl.getUniformLocation(aProgram.renderCache, "uLights[" + lightIdx + "].Attenuation");
				aLightUniform.Direction = this.gl.getUniformLocation(aProgram.renderCache, "uLights[" + lightIdx + "].Direction");
				aLightUniform.Color = this.gl.getUniformLocation(aProgram.renderCache, "uLights[" + lightIdx + "].Color");
				aLightUniform.OuterCutoff = this.gl.getUniformLocation(aProgram.renderCache, "uLights[" + lightIdx + "].OuterCutoff");
				aLightUniform.InnerCutoff = this.gl.getUniformLocation(aProgram.renderCache, "uLights[" + lightIdx + "].InnerCutoff");
				aLightUniform.Exponent = this.gl.getUniformLocation(aProgram.renderCache, "uLights[" + lightIdx + "].Exponent");

				aProgram.renderCache.lightsUniform.push(aLightUniform);
				lightIdx++;
			}
		} while (lightPosId != null);

		aProgram.renderCache.materialUniform = {};
        aProgram.renderCache.materialUniform.ambient = this.gl.getUniformLocation(aProgram.renderCache, "uMaterial.Ambient");
        aProgram.renderCache.materialUniform.diffuse = this.gl.getUniformLocation(aProgram.renderCache, "uMaterial.Diffuse");
        aProgram.renderCache.materialUniform.specular = this.gl.getUniformLocation(aProgram.renderCache, "uMaterial.Specular");
        aProgram.renderCache.materialUniform.shininess = this.gl.getUniformLocation(aProgram.renderCache, "uMaterial.Shininess");

        aProgram.renderCache.useTexturesUniform = this.gl.getUniformLocation(aProgram.renderCache, "uUseTextures");

        // used for storing custom uniforms locations
        aProgram.renderCache.customUniforms = {};

        // used for storing uniforms for samplers (textures)
        aProgram.renderCache.samplerUniforms = {};

		aProgram.renderCache.renderer = this;
	};

	renderer.enableProgram = function(aProgram) {
		if (!aProgram.renderCache) {
			this.loadProgram(aProgram);
		}

		this.gl.useProgram(aProgram.renderCache);

		// set matrices
		this.setMatrixUniforms(aProgram);
	};

	renderer.disableProgram = function(aProgram) {
		this.gl.useProgram(null);
	};

	renderer.enableUniforms = function(aProgram, aRenderComponent) {
		// set any custom uniform
		var that = this;
		aRenderComponent.eachUniform(function(aUniform) {
			that.setCustomUniform(aUniform, aProgram);
		});
	};

	renderer.enableLight = function(index, aLight, aProgram) {
		var lightUniform = aProgram.renderCache.lightsUniform[index];
		if (lightUniform) {
    		this.gl.uniform3f(lightUniform.Position, aLight.position[0], aLight.position[1], aLight.position[2]);
    		this.gl.uniform3f(lightUniform.Attenuation, aLight.attenuation[0], aLight.attenuation[1], aLight.attenuation[2]);
    		this.gl.uniform3f(lightUniform.Direction, aLight.direction[0], aLight.direction[1], aLight.direction[2]);
    		this.gl.uniform3f(lightUniform.Color, aLight.color[0], aLight.color[1], aLight.color[2]);
    		this.gl.uniform1f(lightUniform.OuterCutoff, aLight.outerCutoff);
    		this.gl.uniform1f(lightUniform.InnerCutoff, aLight.innerCutoff);
    		this.gl.uniform1f(lightUniform.Exponent, aLight.exponent);
    	}
	};

	renderer.enableLights = function(aProgram, aRenderComponent) {
		var that = this;
		this.setUniformBool(aProgram.renderCache.useLightingUniform, aRenderComponent.hasLights());
		this.setUniformInt(aProgram.renderCache.lightCountUniform, aRenderComponent.getLightCount());
		aRenderComponent.eachLight(function(aLight, index) {
			that.enableLight(index, aLight, aProgram);
		});
	};

	renderer.loadTexture = function(aTexture) {
		aTexture.renderCache = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, aTexture.renderCache);
	    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, aTexture.flipVertical);
	    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, aTexture.image.data);
	    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
	    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
	    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	};

	renderer.enableTexture = function(index, aTexture, aProgram) {
		if (!aTexture.renderCache) {
			this.loadTexture(aTexture);
		}

		if (aTexture.renderCache) {
    		var uniformLocation = aProgram.renderCache.samplerUniforms[aTexture.name];
    		if (!uniformLocation) {
    			uniformLocation = this.gl.getUniformLocation(aProgram.renderCache, aTexture.name);
    			if (uniformLocation) {
        			aProgram.renderCache.samplerUniforms[aTexture.name] = uniformLocation;
    			}
    		}

    		if (uniformLocation) {
				this.gl.activeTexture(this.gl.TEXTURE0 + index);
            	this.gl.bindTexture(this.gl.TEXTURE_2D, aTexture.renderCache);
				this.setUniformInt(uniformLocation, index);
			}
		}
	};

	renderer.enableTextures = function(aProgram, anEffect) {
		var that = this;
		this.setUniformBool(aProgram.renderCache.useTexturesUniform, anEffect.textures.count() > 0);
		anEffect.textures.each(function(aTexture, index) {
			that.enableTexture(index, aTexture, aProgram);
		});
	};

	renderer.enableMaterialProperties = function(aProgram, anEffect) {
		this.setUniformFloat(aProgram.renderCache.materialUniform.ambient, anEffect.ambient[0], anEffect.ambient[1], anEffect.ambient[2]);
		this.setUniformFloat(aProgram.renderCache.materialUniform.diffuse, anEffect.diffuse[0], anEffect.diffuse[1], anEffect.diffuse[2]);
		this.setUniformFloat(aProgram.renderCache.materialUniform.specular, anEffect.specular[0], anEffect.specular[1], anEffect.specular[2]);
		this.setUniformFloat(aProgram.renderCache.materialUniform.shininess, anEffect.shininess);
	};

	renderer.setAlphaState = function(aState) {
		if (aState.enabled) {
    		this.gl.enable(this.gl.BLEND);
			this.gl.blendFunc(aState.srcBlendFunc, aState.dstBlendFunc);
		}
		else {
			this.gl.disable(this.gl.BLEND);
		}
	};

	renderer.setDepthState = function(aState) {
		if (aState.enabled) {
			this.gl.depthFunc(this.gl.LEQUAL);
			this.gl.enable(this.gl.DEPTH_TEST);
		}
		else {
			this.gl.disable(this.gl.DEPTH_TEST);
		}
	};

	renderer.setCullState = function(aState) {
		if (aState.enabled) {
			this.gl.enable(this.gl.CULL_FACE);
			this.gl.frontFace(this.gl.CCW);
			this.gl.cullFace(this.gl.BACK);
		}
		else {
			this.gl.disable(this.gl.CULL_FACE);
		}
	};

	renderer.setPolygonOffsetState = function(aState) {
		if (aState.enabled) {
			this.gl.polygonOffset(4, 8);
			this.gl.enable(this.gl.POLYGON_OFFSET_FILL);
		}
	};

	renderer.enableRenderStates = function(aProgram, anEffect) {
		this.setDepthState(anEffect.depthState);
		this.setAlphaState(anEffect.alphaState);
		this.setCullState(anEffect.cullState);
		this.setPolygonOffsetState(anEffect.polygonOffsetState);
	};

	renderer.loadVertexBuffer = function(vbo) {
		vbo.renderCache = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo.renderCache);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vbo.data, this.gl.STATIC_DRAW);
		vbo.renderCache.renderer = this;
	},

	renderer.enableVertexBuffer = function(vbo, aProgram) {
		if (!vbo.renderCache) {
			this.loadVertexBuffer(vbo);
		}
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo.renderCache);

		var vf = vbo.vertexFormat;

		// always enable positions array 
		this.gl.vertexAttribPointer(aProgram.renderCache.vertexPositionAttribute, 
			vf.positions, 
			this.gl.FLOAT, 
			false, 
			vf.getVertexSizeInBytes(), 
			vf.getPositionsOffsetInBytes());

		if (aProgram.renderCache.vertexNormalAttribute >= 0) {
			if (vf.normals > 0) {
    			this.gl.vertexAttribPointer(aProgram.renderCache.vertexNormalAttribute,
    				vf.normals,
    				this.gl.FLOAT,
    				false,
    				vf.getVertexSizeInBytes(),
    				vf.getNormalsOffsetInBytes());
    		}
    		else {
    			// fallback: the shader requires normals but none is provided by
    			// the geometry. use positions instead
        		this.gl.vertexAttribPointer(aProgram.renderCache.vertexNormalAttribute, 
        			vf.positions, 
        			this.gl.FLOAT, 
        			false, 
        			vf.getVertexSizeInBytes(), 
        			vf.getPositionsOffsetInBytes());
    		}
		}

		if (aProgram.renderCache.vertexColorAttribute >= 0) {
			if (vf.colors > 0) {
    			this.gl.vertexAttribPointer(aProgram.renderCache.vertexColorAttribute,
    				vf.colors,
    				this.gl.FLOAT,
    				false,
    				vf.getVertexSizeInBytes(),
    				vf.getColorsOffsetInBytes());
    		}
    		else {
    			// fallback: the shader requires normals but none is provided by
    			// the geometry. use positions instead
        		this.gl.vertexAttribPointer(aProgram.renderCache.vertexColorAttribute, 
        			vf.positions, 
        			this.gl.FLOAT, 
        			false, 
        			vf.getVertexSizeInBytes(), 
        			vf.getPositionsOffsetInBytes());
    		}
		}

		if (aProgram.renderCache.vertexTextureCoordAttribute >= 0) {
			if (vf.textureCoords > 0) {
    			this.gl.vertexAttribPointer(aProgram.renderCache.vertexTextureCoordAttribute,
    				vf.textureCoords,
    				this.gl.FLOAT,
    				false,
    				vf.getVertexSizeInBytes(),
    				vf.getTextureCoordsOffsetInBytes());
    		}
    		else {
    			// fallback: the shader requires texture coordinates but none was 
    			// provided by the geometry. use positions instead, although this
    			// will end up in an undefined result 
        		this.gl.vertexAttribPointer(aProgram.renderCache.vertexTextureCoordAttribute, 
        			vf.positions, 
        			this.gl.FLOAT, 
        			false, 
        			vf.getVertexSizeInBytes(), 
        			vf.getPositionsOffsetInBytes());
    		}
		}

		if (aProgram.renderCache.vertexTangentAttribute >= 0) {
			if (vf.tangents > 0) {
        		this.gl.vertexAttribPointer(aProgram.renderCache.vertexTangentAttribute, 
        			vf.tangents, 
        			this.gl.FLOAT, 
        			false, 
        			vf.getVertexSizeInBytes(), 
        			vf.getTangentsOffsetInBytes());
			}
			else {
    			// fallback: the shader requires tangents but none was 
    			// provided by the geometry. use positions instead, although this
    			// will end up in an undefined result 
        		this.gl.vertexAttribPointer(aProgram.renderCache.vertexTangentAttribute, 
        			vf.positions, 
        			this.gl.FLOAT, 
        			false, 
        			vf.getVertexSizeInBytes(), 
        			vf.getPositionsOffsetInBytes());
			}
		}
	};

	renderer.disableVertexBuffer = function() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	};

	renderer.loadIndexBuffer = function(ibo) {
		ibo.renderCache = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo.renderCache);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, ibo.data, this.gl.STATIC_DRAW);
		ibo.renderCache.renderer = this;
	};

	renderer.enableIndexBuffer = function(ibo) {
		if (!ibo.renderCache) {
			this.loadIndexBuffer(ibo);
		}

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo.renderCache);
	};

	renderer.disableIndexBuffer = function() {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
	};

	renderer.renderVisibilitySet = function(visibilitySet) {
		this.camera = visibilitySet.camera;
		var that = this;
		visibilitySet.eachGeometry(function(aGeometry) {
			that.renderGeometry(aGeometry);
		});
	};

	renderer.renderGeometry = function(geometry) {
		var renderComponent = geometry.getComponent("render");
		if (renderComponent) {
			var that = this;

			geometry.world.toMat4(this.mMatrix);
			mat4.multiply(this.vMatrix, this.mMatrix, this.mvMatrix);
			
			// TODO: is this loop the most efficient one?
			// shouldn't we iterate by effects first?
			geometry.primitives.each(function(aPrimitive) {
				if (renderComponent.hasEffects()) {
					renderComponent.eachEffect(function(anEffect) {
						that.applyEffect(renderComponent, aPrimitive, anEffect);
					})
				}
				else {
					that.applyEffect(renderComponent, aPrimitive, that.defaultEffect);
				}
			})
		}
	};

	renderer.renderPrimitive = function(aProgram, aPrimitive) {
		this.enableVertexBuffer(aPrimitive.vertexBuffer, aProgram);
		this.enableIndexBuffer(aPrimitive.indexBuffer, aProgram);

		var primitiveType = this.gl.TRIANGLES;
		if (aPrimitive.type == primitive.types.POINTS) {
			primitiveType = this.gl.POINTS;
		}
		else if (aPrimitive.type == primitive.types.LINES) {
			primitiveType = this.gl.LINES;
		}

		this.gl.drawElements(primitiveType, aPrimitive.indexBuffer.indexCount, this.gl.UNSIGNED_SHORT, 0);
	}

	renderer.applyEffect = function(aRenderComponent, aPrimitive, anEffect) {
		var aProgram = anEffect.shaderProgram;
		var that = this;
		var i = 0;

		if (!aProgram) {
			aProgram = this.defaultShaderProgram;
		}

		this.enableProgram(aProgram);
		this.enableUniforms(aProgram, aRenderComponent);
		this.enableLights(aProgram, aRenderComponent);
		this.enableTextures(aProgram, anEffect);
		this.enableMaterialProperties(aProgram, anEffect);
		this.enableRenderStates(aProgram, anEffect);
		this.renderPrimitive(aProgram, aPrimitive);
	};

	renderer.applyScreenEffect = function(anEffect, uniforms) {
		var aProgram = anEffect.shaderProgram;
		var that = this;
		var i = 0;

		if (!aProgram) {
			return;
		}

		this.enableProgram(aProgram);
		this.enableUniforms(aProgram, anEffect);

		var that = this;
		this.enableTexture(0, this.defaultFrameBuffer.texture, aProgram);
		var i = 1;
		anEffect.textures.each(function(aTexture, index) {
			that.enableTexture(i, aTexture, aProgram);
			i++;
		});

		this.enableMaterialProperties(aProgram, anEffect);
		this.enableRenderStates(aProgram, anEffect);
		this.renderPrimitive(aProgram, this.screenPrimitive);
	};

	renderer.loadFrameBuffer = function(aFrameBuffer) {
		aFrameBuffer.renderCache = this.gl.createFramebuffer();
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, aFrameBuffer.renderCache);

		aFrameBuffer.texture.renderCache = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, aFrameBuffer.texture.renderCache);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);

		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, aFrameBuffer.width, aFrameBuffer.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

		var renderbuffer = this.gl.createRenderbuffer();
		this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, renderbuffer);
		this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, aFrameBuffer.width, aFrameBuffer.height);

		this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, aFrameBuffer.texture.renderCache, 0);
		this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, renderbuffer);

		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
		this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
	};

	renderer.unloadFrameBuffer = function(aFrameBuffer) {

	};

	renderer.enableFrameBuffer = function(aFrameBuffer) {
		if (!aFrameBuffer.renderCache) {
			this.loadFrameBuffer(aFrameBuffer);
		}

		if (aFrameBuffer.renderCache) {
    		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, aFrameBuffer.renderCache);
		}
	};

	renderer.disableFrameBuffer = function(aFrameBuffer) {
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
	};

	renderer.beginRender = function() {
		this.enableFrameBuffer(this.defaultFrameBuffer);
	};

	renderer.endRender = function() {
		this.disableFrameBuffer(this.defaultFrameBuffer);
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

		if (this.camera) {
			var postProcessingEffects = this.camera.getComponent("effects");
			if (postProcessingEffects) {
				var uniforms = this.camera.getComponent("uniforms");
				var that = this;
				postProcessingEffects.effects.each(function(anEffect, index) {
					that.applyScreenEffect(anEffect, uniforms);
				});
			}
			else {
				this.applyScreenEffect(this.defaultScreenEffect);	
			}
		}
		else {
			this.applyScreenEffect(this.defaultScreenEffect);
		}
	};

	/**
		- canvas: a valid canvas element
		- context: the type of context to initialize (default: "experimental-webgl")
	*/
	renderer.set = function(spec) {
		spec = spec || {};

		this._canvas = spec.canvas;
		if (!this.canvas) {
			alert("No canvas element provided. Cannot initialize renderer");
			return null;
		}

		try {
			this._gl = this.canvas.getContext(spec.context || "experimental-webgl");
		}
		catch(e) {
			var answer = confirm("Cannot initialize WebGL context. Please make sure your browser supports WebGL and verify that you have the latest drivers for you graphics card.\n\nClick OK for more information.");
			if (answer) {
				window.location = "http://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation";
			}
			return null;
		}

		if (!this._gl) {
			alert("Cannot initialize WebGL context. Unknown error");
			return null;
		}

		this._mvMatrix = mat4.identity();
		this._vMatrix = mat4.identity();
		this._mMatrix = mat4.identity();
		this._pMatrix = mat4.identity();

		this._defaultFrameBuffer = objectFactory.create(frameBufferObject, {
			width: mathUtils.pow2roundUp(this.canvas.width, 2048),
			height: mathUtils.pow2roundUp(this.canvas.height, 1024),
			clearColor: spec.clearColor,
		});

		this._textureCatalog = objectFactory.create(renderResourceCatalog);
		this._vertexBufferCatalog = objectFactory.create(renderResourceCatalog);
		this._indexBufferCatalog = objectFactory.create(renderResourceCatalog);
		this._shaderProgramCatalog = objectFactory.create(renderResourceCatalog);

		this._camera = null;
		this.onCameraViewportChange();
		this.onCameraFrustumChange();
		this.onCameraFrameChange();

		this._defaultShaderProgram = objectFactory.create(shaderProgram, {
			vertexShader: texture_lighting_vs,
			fragmentShader: texture_lighting_fs
		});

		this._defaultEffect = objectFactory.create(effect, {
			shaderProgram: {
				vertexShader: texture_lighting_vs,
				fragmentShader: texture_lighting_fs
			}
		});

		this._defaultScreenEffect = objectFactory.create(effect, {
			shaderProgram: {
				vertexShader: screen_vs,
				fragmentShader: screen_fs,
			},
		});

		this._screenPrimitive = objectFactory.inflate({
			_prototype: primitive,
			type: primitive.types.TRIANGLES,
			vertexBuffer: {
				_prototype: vertexBufferObject,
				vertexFormat: {
					_prototype: vertexFormat,
					positions: 3,
					textureCoords: 2
				},
				vertexCount: 4,
				data: new Float32Array([
					-1.0, 1.0, 0.0,		0.0, 1.0,
					-1.0, -1.0, 0.0,	0.0, 0.0,
					1.0, -1.0, 0.0, 	1.0, 0.0,
					1.0, 1.0, 0.0,		1.0, 1.0,
				])
			},
			indexBuffer: {
				_prototype: indexBufferObject,
				indexCount: 6,
				data: new Uint16Array([0, 1, 2, 0, 2, 3])
			}
		});

		this._clearColor = spec.clearColor || [0.5, 0.5, 0.5, 1.0];

		return this;
	};

	renderer.destroy = function() {
		this.framebuffer.destroy();
	};

	return renderer;
});

