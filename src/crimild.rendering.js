define(["./crimild.core", "./crimild.math",
	"text!../shaders/simple.vert", "text!../shaders/simple.frag",
	"text!../shaders/ubbershader.vert", "text!../shaders/ubbershader.frag"], 
	function(core, math, simple_vs, simple_fs, ubbershader_vs, ubbershader_fs) {
	
	"use strict";

	var light = function(spec) {
		spec = spec || {};
		var that = {};

		var _position = vec3.create([0, 0, 0]);
		var _attenuation = vec3.create([1.0, 0, 0.01]);
		var _direction = vec3.create([0, 0, 0]);
		var _color = vec3.create([1, 1, 1]);
		var _outerCutoff = 0;
		var _innerCutoff = 0;
		var _exponent = 0;

		Object.defineProperties(that, {
			position: {
				get: function() {
					return _position;
				},
				set: function(value) {
					vec3.set(value, _position);
				}
			},
			attenuation: {
				get: function() {
					return _attenuation;
				},
				set: function(value) {
					vec3.set(value, _attenuation);
				}
			},
			direction: {
				get: function() {
					return _direction;
				},
				set: function(value) {
					vec3.set(value, _direction);
				}
			},
			color: {
				get: function() {
					return _color;
				},
				set: function(value) {
					vec3.set(value, _color);
				}
			},
			outerCutoff: {
				get: function() {
					return _outerCutoff;
				},
				set: function(value) {
					_outerCutoff = value;
				}
			},
			innerCutoff: {
				get: function() {
					return _innerCutoff;
				},
				set: function(value) {
					_innerCutoff = value;
				},
			},
			exponent: {
				get: function() {
					return _exponent;
				},
				set: function(value) {
					_exponent = value;
				}
			}
		});

		if (spec.position) { that.position = spec.position; }
		if (spec.attenuation) { that.attenuation = spec.attenuation; }
		if (spec.direction) { that.direction = spec.direction; }
		if (spec.color) { that.color = spec.color; }
		if (spec.outerCutoff) { that.outerCutoff = spec.outerCutoff; }
		if (spec.innerCutoff) { that.innerCutoff = spec.innerCutoff; }
		if (spec.exponent) { that.exponent = spec.exponent; }

		return that;
	};

	var lightingComponent = function(spec) {
		spec = spec || {}
		var that = core.nodeComponent({name: "lighting"});
		var lights = spec.lights || [];

		// utility variables
		var tempDirection = vec3.create();

		that.getLightCount = function() {
			return lights.length;
		};

		that.getLightAt = function(index) {
			return lights[index];
		};

		that.update = function() {
			that.node.world.computeDirection(tempDirection);
			for (var i in lights) {
				lights[i].position = that.node.world.translate;
				lights[i].direction = tempDirection;
			}
		};

		return that;
	};

	var lightNode = function(spec) {
		spec = spec || {};
		var that = core.node(spec);

		that.attachComponent(lightingComponent(spec));

		return that;
	};

	// TODO: Rename this to MaterialComponent
	var renderComponent = function(spec) {
		spec = spec || {}
		var that = core.nodeComponent({name: "render"});
		var effects = spec.effects || [];

		that.getEffectCount = function() {
			return effects.length;
		};

		that.getEffectAt = function(index) {
			return effects[index];
		};

		return that;
	};

	// TODO: Rename this to renderComponent
	var geometryRenderComponent = function(spec) {
		var that = core.nodeComponent({name: "geometryRender"});
		var effects = [];
		var lights = [];

		that.getEffectCount = function() {
			return effects.length;
		};

		that.getEffectAt = function(index) {
			return effects[index];
		};

		that.getLightCount = function() {
			return lights.length;
		};

		that.getLightAt = function(index) {
			return lights[index];
		}

		that.reset = function(opts) {
			if (opts) {
				if (opts.effects) {
					effects = opts.effects;
				}
				if (opts.lights) {
					lights = opts.lights;
				}
			}
		};

		return that;
	};

	var image = function(spec) {
		spec = spec || {}
		var that = {};
		var contents = null;
		var ready = false;

		that.isReady = function() {
			return ready;
		};
		
		that.getContents = function() {
			return contents;
		};

		if (spec.url) {
			contents = new Image();
			contents.onload = function() {
				ready = true;
			};
			contents.src = spec.url;
		}
		else if (spec.contents) {
			contents = spec.contents;
			ready = true;
		}

		return that;
	};

	var texture = function(spec) {
		spec = spec || {}
		var that = {};

		var _image;

		Object.defineProperties(that, {
			image: {
				get: function() {
					return _image;
				},
				set: function(value) {
					_image = value;
				}
			}
		});

		if (spec.image) {
			that.image = spec.image;
		}

		return that;
	};

	var shader = function(spec) {
		var that = {};
		var content;

		if (spec) {
			if (spec.content) {
				content = spec.content;
			}
			else if (spec.scriptId) {
				var script = document.getElementById(spec.scriptId);
                var str = "";
                var k = script.firstChild;
                while (k) {
                    if (k.nodeType == 3) {
                        str += k.textContent;
                    }
                    k = k.nextSibling;
                }
                content = str;
			}
		}

		that.getContent = function() {
			return content;
		};

		that.setContent = function(value) {
			content = value;
		};

		return that;
	};

	var shaderProgram = function(spec) {
		var that = {};

		var vertexShader;
		var fragmentShader;

		if (spec) {
			vertexShader = spec.vertexShader ? spec.vertexShader : vertexShader;
			fragmentShader = spec.fragmentShader ? spec.fragmentShader : fragmentShader;
		};

		that.getVertexShader = function() {
			return vertexShader;
		};

		that.setVertexShader = function(shader) {
			vertexShader = shader;
		};

		that.getFragmentShader = function() {
			return fragmentShader;
		};

		that.setFragmentShader = function(shader) {
			fragmentShader = shader;
		};

		return that;
	};

	// todo: rename this to Material
	var effect = function(spec) {
		spec = spec || {};
		var that = {};
		var program = null;
		var textures = [];

		var _ambient = [0.2, 0.2, 0.2];
		var _diffuse = [0.8, 0.8, 0.8];
		var _specular = [0.8, 0.8, 0.8];
		var _shininess = 50;

		Object.defineProperties(that, {
			ambient: {
				get: function() {
					return _ambient;
				},
				set: function(value) {
					vec3.set(value, _ambient);
				}
			},
			diffuse: {
				get: function() {
					return _diffuse;
				},
				set: function (value) {
					vec3.set(value, _diffuse);
				}
			},
			specular: {
				get: function() {
					return _specular;
				},
				set: function(value) {
					vec3.set(value, _specular);
				}
			},
			shininess: {
				get: function() {
					return _shininess;
				},
				set: function(value) {
					_shininess = value;
				}
			}
		});

		if (spec.shaderProgram) { program = spec.shaderProgram; }
		if (spec.textures) { textures = spec.textures; }
		if (spec.ambient) { that.ambient = spec.ambient; }
		if (spec.diffuse) { that.diffuse = spec.diffuse; }
		if (spec.specular) { that.specular = spec.specular; }
		if (spec.shininess) { that.shininess = spec.shininess; }

		that.setProgram = function(aProgram) {
			program = aProgram;
		};

		that.getProgram = function() {
			return program;
		};

		that.attachTexture = function(aTexture) {
			textures.push(aTexture);
		};

		that.getTextureCount = function() {
			return textures.length;
		};

		that.getTextureAt = function(index) {
			return textures[index];
		};

		return that;
	}

	/*
		This visitor traverses a scene fetching all lights attached
		to nodes. 

		This is a very expensive operation and should be seldom used.
		Usualy, this visitor is only invoked during a render state update
	*/
	var fetchLights = function(spec) {
		spec = spec || {}
		var that = core.nodeVisitor(spec);
		var lights = spec.lights || [];

		that.traverse = function(node) {
			node.accept(that);
		};

		that.visitNode = function(node) {
			var lc = node.getComponent("lighting");
			if (lc) {
				for (var i = 0; i < lc.getLightCount(); i++) {
					lights.push(lc.getLightAt(i));
				}
			}
		};

		that.visitGroupNode = function(group) {
			that.visitNode(group);
			for (var i = 0; i < group.getNodeCount(); i++) {
				group.getNodeAt(i).accept(this);
			}
		};

		that.visitGeometryNode = function(geometry) {
			that.visitNode(geometry);
		};

		that.getLightCount = function() {
			return lights.length;
		}

		that.getLightAt = function(index) {
			return lights[index];
		};

		return that;
	};

	/*
		Updates a render state of a scene or branch

		This is a very expensive operation since it involves
		traversing a scene more than once. Use it only when needed
	*/
	var renderStateUpdate = function(spec) {
		var that = core.nodeVisitor(spec);
		var effects = [];
		var lights = [];

		that.propagateFromRoot = function(aNode) {
			if (aNode.getParent()) {
				that.propagateFromRoot(aNode.getParent());
			}
			else {
				// no parent. this is the root node
				aNode.perform(fetchLights({lights: lights}));
			}

			var grc = aNode.getComponent("render");
			if (grc) {
				for (var i = 0; i < grc.getEffectCount(); i++) {
					effects.push(grc.getEffectAt(i));
				}
			}
		}

		that.traverse = function(aNode) {
			effects = [];
			lights = [];

			if (aNode.getParent()) {
				that.propagateFromRoot(aNode.getParent());
			}
			else {
				// no parent. this is the root node
				aNode.perform(fetchLights({lights: lights}));
			}

			aNode.accept(that);
		};

		that.visitGroupNode = function(group) {
			var i;
			var tempEffects = effects.slice();
			var grc = group.getComponent("render");

			if (grc) {
				for (i = 0; i < grc.getEffectCount(); i++) {
					effects.push(grc.getEffectAt(i));
				}
			}

			for (i = 0; i < group.getNodeCount(); i++) {
				var node = group.getNodeAt(i);
				node.accept(this);
			}

			effects = tempEffects;
		};

		that.visitGeometryNode = function(geometry) {
			var grc = geometry.getComponent("geometryRender");
			if (!grc) {
				grc = geometryRenderComponent({});
				geometry.attachComponent(grc);
			}

			var rc = geometry.getComponent("render");

			var tempEffects = effects.slice();

			if (rc) {
				for (var i = 0; i < rc.getEffectCount(); i++) {
					effects.push(rc.getEffectAt(i));
				}
			}

			grc.reset({
				effects: effects,
				lights: lights
			});

			effects = tempEffects;
		};

		return that;
	};

	var camera = function(spec) {
		spec = spec || {};
		var that = {};

		var _transformation = spec.transformation || math.transformation();
		var _viewport = spec.viewport || [0, 0, 1, 1];
		var _pMatrix = spec.projection || mat4.create();
		var _renderer = null;

		if (!spec.projection) {
			mat4.perspective(45, 4.0 / 3.0, 0.1, 1000.0, _pMatrix);
		}

		Object.defineProperties(that, {
			renderer: {
				get: function() {
					return _renderer;
				},
				set: function(value) {
					_renderer = value;
				}
			},
			viewport: {
				get: function() {
					return _viewport;
				},
				set: function(value) {
					_viewport = value;
				}
			},
			transformation: {
				get: function() {
					return _transformation;
				},
				set: function(value) {
					_transformation.set(value);
				}
			}
		});

		that.computeViewMatrix = function(dest) {
			if (!dest) {
				dest = mat4.create();
			}

			_transformation.toMat4(dest);
			mat4.inverse(dest);
			return dest;
		};

		that.computeProjectMatrix = function(dest) {
			if (!dest) {
				dest = mat4.create();
			}

			mat4.set(_pMatrix, dest);
			return dest;
		}

		return that;
	};

	var cameraComponent = function(spec) {
		spec = spec || {};
		spec.name = "camera";

		var that = core.nodeComponent(spec);

		var _camera = spec.camera || camera();

		Object.defineProperties(that, {
			camera: {
				get: function() {
					return _camera;
				}
			},
		});

		that.update = function() {
			that.camera.transformation.set(that.node.world);
		};

		return that;
	};

	var cameraNode = function(spec) {
		spec = spec || {};
		var that = core.node(spec);

		that.attachComponent(cameraComponent());

		return that;
	};

	var visibilitySet = function(spec) {
		var that = {};
		var geometries = [];
		var _camera = null;

		Object.defineProperties(that, {
			camera: {
				get: function() {
					return _camera;
				},
				set: function(value) {
					_camera = value;
				}
			},
		});

		that.getGeometryCount = function() {
			return geometries.length;
		};

		that.getGeometryAt = function(index) {
			return geometries[index];
		};

		that.addGeometry = function(aGeometryNode) {
			geometries.push(aGeometryNode);
		};

		that.reset = function() {
			geometries = [];
			that.camera = null;
		};

		return that;
	};

	var computeVisibilitySet = function(spec) {
		spec = spec || {}
		var that = core.nodeVisitor(spec);
		var result = visibilitySet();

		result = spec.result ? spec.result : result;
		result.reset();
		result.camera = spec.camera || null;

		that.getResult = function() {
			return result;
		};

		that.visitGroupNode = function(group) {
			for (var i = 0; i < group.getNodeCount(); i++) {
				var node = group.getNodeAt(i);
				node.accept(this);
			}
		};

		that.visitGeometryNode = function(geometry) {
			result.addGeometry(geometry);
		};

		return that;
	}

	var renderer = function(spec) {
		var that = {};

		var gl = null;
		var width = 0;
		var height = 0;
		var vMatrix = mat4.create();
    	var mvMatrix = mat4.create();
    	var pMatrix = mat4.create();
    	var clearColor = [0.5, 0.5, 0.5, 1.0];
    	var currentCamera = null;
		var ubbershaderProgram = shaderProgram({
			vertexShader: shader({
				content: ubbershader_vs
			}),
			fragmentShader: shader({
				content: ubbershader_fs
			})
		});

		// utility variables
		var mMatrix = mat4.create();

		var defaultEffect = effect({
	        shaderProgram: shaderProgram({
	            vertexShader: shader({
	                content: simple_vs
	            }),
	            fragmentShader: shader({
	                content: simple_fs
	            })
	        })
	    });

		return {
			configure: function(glContext, canvasWidth, canvasHeight) {
				gl = glContext;
				width = canvasWidth;
				height = canvasHeight;

				this.setClearColor(clearColor);
				gl.enable(gl.DEPTH_TEST);

				this.onCameraViewportChange();
				this.onCameraFrustumChange();
				this.onCameraFrameChange();
			},

			getClearColor: function() {
				return clearColor;
			},

			setClearColor: function(color) {
				this.clearColor = color;
				if (gl) {
 					gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
 				}
			},

			setCurrentCamera: function(value) {
				this.currentCamera = value;

				this.onCameraViewportChange();
				this.onCameraFrustumChange();
				this.onCameraFrameChange();
			},

			getCurrentCamera: function() {
				return this.currentCamera;
			},

			onCameraViewportChange: function() {
				if (this.currentCamera) {
					var vp = this.currentCamera.viewport;
					gl.viewport(vp[0] * width, vp[1] * height, vp[2] * width, vp[3] * height);
				}
				else {
					gl.viewport(0, 0, width, height);
				}
			},

			onCameraFrustumChange: function() {
				if (this.currentCamera) {
					this.currentCamera.computeProjectMatrix(pMatrix);
				}
				else {
					mat4.perspective(45, width / height, 0.1, 1000.0, pMatrix);
				}
			},

			onCameraFrameChange: function() {
				if (this.currentCamera) {
					this.currentCamera.computeViewMatrix(vMatrix);
				}
				else {
					mat4.identity(vMatrix);
				}
			},

			clearBuffers: function() {
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			},

        	setMatrixUniforms: function(program) {
        		gl.uniformMatrix4fv(program.renderCache.pMatrixUniform, false, pMatrix);
        		gl.uniformMatrix4fv(program.renderCache.mvMatrixUniform, false, mvMatrix);

        		if (program.renderCache.nMatrixUniform) {
	                var normalMatrix = mat3.create();
	                mat4.toInverseMat3(mvMatrix, normalMatrix);
	                mat3.transpose(normalMatrix);
	                gl.uniformMatrix3fv(program.renderCache.nMatrixUniform, false, normalMatrix);
        		}
        	},

        	loadVertexBuffer: function(vbo) {
        		vbo.renderCache = gl.createBuffer();
        		gl.bindBuffer(gl.ARRAY_BUFFER, vbo.renderCache);
        		gl.bufferData(gl.ARRAY_BUFFER, vbo.getData(), gl.STATIC_DRAW);
        		vbo.renderCache.renderer = this;
        	},

        	unloadVertexBuffer: function(vbo) {

        	},

        	enableVertexBuffer: function(vbo, program) {
        		if (!vbo.renderCache) {
        			this.loadVertexBuffer(vbo);
        		}
        		gl.bindBuffer(gl.ARRAY_BUFFER, vbo.renderCache);

        		var vf = vbo.getVertexFormat();

        		// allways enable positions array 
        		gl.vertexAttribPointer(program.renderCache.vertexPositionAttribute, 
        			vf.positions, 
        			gl.FLOAT, 
        			false, 
        			vf.getVertexSizeInBytes(), 
        			4 * vf.getPositionsOffset());

        		if (program.renderCache.vertexNormalAttribute >= 0) {
        			if (vf.normals > 0) {
	        			gl.vertexAttribPointer(program.renderCache.vertexNormalAttribute,
	        				vf.normals,
	        				gl.FLOAT,
	        				false,
	        				vf.getVertexSizeInBytes(),
	        				4 * vf.getNormalsOffset());
	        		}
	        		else {
	        			// fallback: the shader requires normals but none is provided by
	        			// the geometry. use positions instead
		        		gl.vertexAttribPointer(program.renderCache.vertexNormalAttribute, 
		        			vf.positions, 
		        			gl.FLOAT, 
		        			false, 
		        			vf.getVertexSizeInBytes(), 
		        			4 * vf.getPositionsOffset());
	        		}
        		}

        		if (program.renderCache.vertexTextureCoordAttribute >= 0) {
        			if (vf.textureCoords > 0) {
	        			gl.vertexAttribPointer(program.renderCache.vertexTextureCoordAttribute,
	        				vf.textureCoords,
	        				gl.FLOAT,
	        				false,
	        				vf.getVertexSizeInBytes(),
	        				4 * vf.getTextureCoordsOffset());
	        		}
	        		else {
	        			// fallback: the shader requires texture coordinates but none was 
	        			// provided by the geometry. use positions instead, although this
	        			// will end up in an undefined result 
		        		gl.vertexAttribPointer(program.renderCache.vertexTextureCoordAttribute, 
		        			vf.positions, 
		        			gl.FLOAT, 
		        			false, 
		        			vf.getVertexSizeInBytes(), 
		        			4 * vf.getPositionsOffset());
	        		}
        		}
        	},

        	disableVertexBuffer: function() {
        		gl.bindBuffer(gl.ARRAY_BUFFER, null);
        	},

        	loadIndexBuffer: function(ibo) {
				ibo.renderCache = gl.createBuffer();
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo.renderCache);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ibo.getData(), gl.STATIC_DRAW);
				ibo.renderCache.renderer = this;
        	},

        	unloadIndexBuffer: function(ibo) {

        	},

        	enableIndexBuffer: function(ibo) {
        		if (!ibo.renderCache) {
        			this.loadIndexBuffer(ibo);
        		}
        		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo.renderCache);
        	},

        	disableIndexBuffer: function() {
        		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        	},

        	enableLight: function(index, aLight, program) {
        		var lightUniform = program.renderCache.lightsUniform[index];
        		if (lightUniform) {
	        		gl.uniform3f(lightUniform.Position, aLight.position[0], aLight.position[1], aLight.position[2]);
	        		gl.uniform3f(lightUniform.Attenuation, aLight.attenuation[0], aLight.attenuation[1], aLight.attenuation[2]);
	        		gl.uniform3f(lightUniform.Direction, aLight.direction[0], aLight.direction[1], aLight.direction[2]);
	        		gl.uniform3f(lightUniform.Color, aLight.color[0], aLight.color[1], aLight.color[2]);
	        		gl.uniform3f(lightUniform.OuterCutoff, aLight.outerCutoff[0], aLight.outerCutoff[1], aLight.outerCutoff[2]);
	        		gl.uniform3f(lightUniform.InnerCutoff, aLight.innerCutoff[0], aLight.innerCutoff[1], aLight.innerCutoff[2]);
	        		gl.uniform3f(lightUniform.Exponent, aLight.exponent[0], aLight.exponent[1], aLight.exponent[2]);
	        	}
        	},

        	disableLight: function() {

        	},

        	loadTexture: function(aTexture) {
        		aTexture.renderCache = gl.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, aTexture.renderCache);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, aTexture.image.getContents());
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.bindTexture(gl.TEXTURE_2D, null);
        	},

        	unloadTexture: function(aTexture) {

        	},

        	enableTexture: function(aTexture, program) {
        		if (aTexture.image.isReady()) {
	        		if (!aTexture.renderCache) {
	        			this.loadTexture(aTexture);
	        		}

					gl.activeTexture(gl.TEXTURE0);
	                gl.bindTexture(gl.TEXTURE_2D, aTexture.renderCache);
	                gl.uniform1i(program.renderCache.samplerUniform, 0)
        		}
        	},

        	disableTexture: function(aTexture) {
        		gl.bindTexture(gl.TEXTURE_2D, null);
        	},

        	compileShader: function(shader, shaderType) {
        		shader.renderCache = gl.createShader(shaderType);
        		gl.shaderSource(shader.renderCache, shader.getContent());
        		gl.compileShader(shader.renderCache);

        		if (!gl.getShaderParameter(shader.renderCache, gl.COMPILE_STATUS)) {
        			alert(gl.getShaderInfoLog(shader.renderCache));
        		}

        		shader.renderCache.renderer = this;
        	},

        	getUniformByName: function(program, name) {
        		return gl.getUniformLocation(program.renderCache, name);
        	},

        	getAttribByName: function(program, name) {
        		return gl.getAttribLocation(program.renderCache, name);
        	},

        	setUniformInt: function(uniform, x, y, z, w) {
        		if (uniform) {
        			if (w != null) {
        				gl.uniform4i(uniform, x, y, z, w);
        			}
        			else if (z != null) {
        				gl.uniform3i(uniform, x, y, z);
        			}
        			else if (y != null) {
        				gl.uniform2i(uniform, x, y);
        			}
        			else if (x != null) {
        				gl.uniform1i(uniform, x);
        			}
        		}
        	},

        	setUniformFloat: function(uniform, x, y, z, w) {
        		if (uniform) {
        			if (w != null) {
        				gl.uniform4f(uniform, x, y, z, w);
        			}
        			else if (z != null) {
        				gl.uniform3f(uniform, x, y, z);
        			}
        			else if (y != null) {
        				gl.uniform2f(uniform, x, y);
        			}
        			else if (x != null) {
        				gl.uniform1f(uniform, x);
        			}
        		}
        	},

        	loadProgram: function(program) {
        		this.compileShader(program.getVertexShader(), gl.VERTEX_SHADER);
        		this.compileShader(program.getFragmentShader(), gl.FRAGMENT_SHADER);
        		
        		program.renderCache = gl.createProgram();
        		gl.attachShader(program.renderCache, program.getVertexShader().renderCache);
        		gl.attachShader(program.renderCache, program.getFragmentShader().renderCache);
        		gl.linkProgram(program.renderCache);
        		
        		if (!gl.getProgramParameter(program.renderCache, gl.LINK_STATUS)) {
        			alert("Could not initialize shaders");
        		}
        		
        		gl.useProgram(program.renderCache);
        		
        		program.renderCache.vertexPositionAttribute = gl.getAttribLocation(program.renderCache, "aVertexPosition");
        		gl.enableVertexAttribArray(program.renderCache.vertexPositionAttribute);

        		program.renderCache.vertexNormalAttribute = gl.getAttribLocation(program.renderCache, "aVertexNormal");
        		if (program.renderCache.vertexNormalAttribute >= 0) {
        			gl.enableVertexAttribArray(program.renderCache.vertexNormalAttribute);
        		}

        		program.renderCache.vertexTextureCoordAttribute = gl.getAttribLocation(program.renderCache, "aTextureCoord");
        		if (program.renderCache.vertexTextureCoordAttribute >= 0) {
                	gl.enableVertexAttribArray(program.renderCache.vertexTextureCoordAttribute);
                }
        		
        		program.renderCache.pMatrixUniform = gl.getUniformLocation(program.renderCache, "uPMatrix");
        		program.renderCache.mvMatrixUniform = gl.getUniformLocation(program.renderCache, "uMVMatrix");
        		program.renderCache.nMatrixUniform = gl.getUniformLocation(program.renderCache, "uNMatrix");

        		program.renderCache.useLightingUniform = gl.getUniformLocation(program.renderCache, "uUseLighting");
        		program.renderCache.lightCountUniform = gl.getUniformLocation(program.renderCache, "uLightCount");
        		program.renderCache.lightsUniform = [];
        		var lightPosId = 0;
        		var lightIdx = 0;
        		do {
        			lightPosId = gl.getUniformLocation(program.renderCache, "uLights[" + lightIdx + "].Position");
        			if (lightPosId != null) {
        				var aLightUniform = {};
        				aLightUniform.Position = lightPosId;
        				aLightUniform.Attenuation = gl.getUniformLocation(program.renderCache, "uLights[" + lightIdx + "].Attenuation");
        				aLightUniform.Direction = gl.getUniformLocation(program.renderCache, "uLights[" + lightIdx + "].Direction");
        				aLightUniform.Color = gl.getUniformLocation(program.renderCache, "uLights[" + lightIdx + "].Color");
        				aLightUniform.OuterCutoff = gl.getUniformLocation(program.renderCache, "uLights[" + lightIdx + "].OuterCutoff");
        				aLightUniform.InnerCutoff = gl.getUniformLocation(program.renderCache, "uLights[" + lightIdx + "].InnerCutoff");
        				aLightUniform.Exponent = gl.getUniformLocation(program.renderCache, "uLights[" + lightIdx + "].Exponent");

        				program.renderCache.lightsUniform.push(aLightUniform);
        				lightIdx++;
        			}
        		} while (lightPosId != null);

        		program.renderCache.materialUniform = {};
                program.renderCache.materialUniform.ambient = gl.getUniformLocation(program.renderCache, "uMaterial.Ambient");
                program.renderCache.materialUniform.diffuse = gl.getUniformLocation(program.renderCache, "uMaterial.Diffuse");
                program.renderCache.materialUniform.specular = gl.getUniformLocation(program.renderCache, "uMaterial.Specular");
                program.renderCache.materialUniform.shininess = gl.getUniformLocation(program.renderCache, "uMaterial.Shininess");

                program.renderCache.useTexturesUniform = gl.getUniformLocation(program.renderCache, "uUseTextures");

                program.renderCache.tintUniform = gl.getUniformLocation(program.renderCache, "uTint");

        		program.renderCache.renderer = this;
        	},

        	enableProgram: function(program) {
        		if (!program.renderCache) {
        			this.loadProgram(program);
        		}

        		gl.useProgram(program.renderCache);
        	},

        	disableProgram: function(program) {
        		gl.useProgram(null);
        	},

			renderVisibilitySet: function(aVisibilitySet) {
				if (aVisibilitySet.camera) {
					this.setCurrentCamera(aVisibilitySet.camera);
				}

				for (var i = 0; i < aVisibilitySet.getGeometryCount(); i++) {
					this.renderGeometryNode(aVisibilitySet.getGeometryAt(i));
				}
			},

			renderGeometryNode: function(geometry) {
        		geometry.world.toMat4(mMatrix);
				mat4.multiply(mMatrix, vMatrix, mvMatrix);

        		var grc = geometry.getComponent("geometryRender");
        		if (grc) {
					for (var p = 0; p < geometry.getPrimitiveCount(); p++) {
						var primitive = geometry.getPrimitiveAt(p);

						var vbo = primitive.getVertexBuffer();
						var ibo = primitive.getIndexBuffer();

						if (grc.getEffectCount() > 0) {
							for (var e = 0; e < grc.getEffectCount(); e++) {
			        			this.applyEffect(grc, primitive, vbo, ibo, grc.getEffectAt(e));
							}
						}
						else {
							this.applyDefaultEffect(grc, primitive, vbo, ibo);
						}
					}
        		}
			},

			applyEffect: function(grc, primitive, vbo, ibo, currentEffect) {
				var program = currentEffect.getProgram();
				if (!program) {
					program = ubbershaderProgram;
				}

				this.enableProgram(program)

        		this.setMatrixUniforms(program);

				this.enableVertexBuffer(vbo, program);
				this.enableIndexBuffer(ibo, program);

				// todo move this to a user-defined uniform
				this.setUniformFloat(program.renderCache.tintUniform, grc.tint ? grc.tint : 0);

				// setup lights
				this.setUniformInt(program.renderCache.useLightingUniform, grc.getLightCount() > 0 ? 1 : 0);
				this.setUniformInt(program.renderCache.lightCountUniform, grc.getLightCount());
				for (var l = 0; l < grc.getLightCount(); l++) {
					this.enableLight(l, grc.getLightAt(l), program);
				}

				// setup textures
				this.setUniformInt(program.renderCache.useTexturesUniform, currentEffect.getTextureCount() > 0 ? 1 : 0);
				for (var t = 0; t < currentEffect.getTextureCount(); t++) {
					this.enableTexture(currentEffect.getTextureAt(t), program);
				}

				// setup material 
				this.setUniformFloat(program.renderCache.materialUniform.ambient, currentEffect.ambient[0], currentEffect.ambient[1], currentEffect.ambient[2]);
				this.setUniformFloat(program.renderCache.materialUniform.diffuse, currentEffect.diffuse[0], currentEffect.diffuse[1], currentEffect.diffuse[2]);
				this.setUniformFloat(program.renderCache.materialUniform.specular, currentEffect.specular[0], currentEffect.specular[1], currentEffect.specular[2]);
				this.setUniformFloat(program.renderCache.materialUniform.shininess, currentEffect.shininess);

				// TODO: move this to a user-defined render state/uniform
				gl.polygonOffset(4, 8);
				gl.enable(gl.POLYGON_OFFSET_FILL);

        		var type = primitive.getType() == core.primitive.types.TRIANGLES ? gl.TRIANGLES : gl.LINES;
        		gl.drawElements(type, ibo.getIndexCount(), gl.UNSIGNED_SHORT, 0);

        		this.disableIndexBuffer(ibo);
        		this.disableVertexBuffer(vbo);

        		this.disableProgram(program);
			},

			applyDefaultEffect: function(grc, primitive, vbo, ibo) {
				this.applyEffect(grc, primitive, vbo, ibo, defaultEffect);
			}

		};
	};

	return {
		light: light,
		lightingComponent: lightingComponent,
		lightNode: lightNode,
		image: image,
		texture: texture,
		shader: shader,
		shaderProgram: shaderProgram,
		effect: effect,
		renderComponent: renderComponent,
		geometryRenderComponent: geometryRenderComponent,
		camera: camera,
		cameraComponent: cameraComponent,
		cameraNode: cameraNode,
		visibilitySet: visibilitySet,
		computeVisibilitySet: computeVisibilitySet,
		renderStateUpdate: renderStateUpdate,
		renderer: renderer,
	}

});

