define(["./crimild.core"], function(core) {
	"use strict";

	var light = function(spec) {
		var that = {};

		var _ambient = vec3.create([0.02, 0.02, 0.02]);
		var _diffuse = vec3.create([0.8, 0.8, 0.8]);
		var _specular = vec3.create([0.5, 0.5, 0.5]);
		var _position = vec4.create([0, 0, 0, 1]);
		var _shininess = 50.0;

		Object.defineProperties(that, {
			ambient: {
				get: function() {
					return _ambient;
				},
				set: function(value) {
					_ambientColor = value;
				}
			},
			diffuse: {
				get: function() {
					return _diffuse;
				},
				set: function(value) {
					_diffuse = value;
				}
			},
			specular: {
				get: function() {
					return _specular;
				},
				set: function(value) {
					_specular = value;
				}
			},
			shininess: {
				get: function() {
					return _shininess;
				},
				set: function(value) {
					_shininess = value;
				}
			},
			position: {
				get: function() {
					return _position;
				},
				set: function(value) {
					_position = value;
				}
			}
		});

		if (spec) {
			if (spec.ambient) that.ambient = spec.ambient;
			if (spec.diffuse) that.diffuse = spec.diffuse;
			if (spec.specular) that.specular = spec.specular;
			if (spec.shininess) that.shininess = spec.shininess;
			if (spec.position) that.position = spec.position;
		}

		return that;
	};

	var renderComponent = function(spec) {
		var that = core.nodeComponent({name: "render"});
		var effects = [];
		var lights = [];

		if (spec) {
			if (spec.effects) {
				effects = spec.effects;
			}
			if (spec.lights) {
				lights = spec.lights;
			}
		}

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

		return that;
	};

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

	var effect = function(spec) {
		var that = {};
		var program = null;

		if (spec) {
			if (spec.shaderProgram) {
				program = spec.shaderProgram;
			}
		}

		that.setProgram = function(aProgram) {
			program = aProgram;
		};

		that.getProgram = function() {
			return program;
		};

		return that;
	}

	var renderStateUpdate = function(spec) {
		var that = core.nodeVisitor(spec);
		var effects = [];
		var lights = [];

		that.visitGroupNode = function(group) {
			var i;
			var grc = group.getComponent("render");

			if (grc) {
				var temp = []
				for (i = 0; i < grc.getEffectCount(); i++) {
					effects.push(grc.getEffectAt(i));
				}
				for (i = 0; i < grc.getLightCount(); i++) {
					lights.push(grc.getLightAt(i));
				}
			}

			for (i = 0; i < group.getNodeCount(); i++) {
				var node = group.getNodeAt(i);
				node.accept(this);
			}

			// TODO: pop effects
			// TODO: pop lights
		};

		that.visitGeometryNode = function(geometry) {
			var grc = geometry.getComponent("geometryRender");
			if (!grc) {
				grc = geometryRenderComponent({});
				geometry.attachComponent(grc);
			}

			var rc = geometry.getComponent("render");

			if (rc) {
				var temp = []
				var i;
				for (i = 0; i < rc.getEffectCount(); i++) {
					effects.push(rc.getEffectAt(i));
				}
				for (i = 0; i < rc.getLightCount(); i++) {
					lights.push(rc.getLightAt(i));
				}
			}

			grc.reset({
				effects: effects,
				lights: lights
			});

			// TODO: pop effects
			// TODO: pop lights
		};

		return that;
	};

	var visibilitySet = function(spec) {
		var that = {};
		var geometries = [];

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
		};

		return that;
	};

	var computeVisibilitySet = function(spec) {
		var that = core.nodeVisitor(spec);
		var result = visibilitySet();

		if (spec) {
			result = spec.result ? spec.result : result;
		}

		result.reset();

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
    	var mvMatrix = mat4.create();
    	var pMatrix = mat4.create();

		return {
			configure: function(glContext, canvasWidth, canvasHeight) {
				gl = glContext;
				width = canvasWidth;
				height = canvasHeight;

				gl.clearColor(0.5, 0.5, 0.5, 1.0);
				gl.enable(gl.DEPTH_TEST);

				this.onCameraViewportChange();
				this.onCameraFrustumChange();
				this.onCameraFrameChange();
			},

			onCameraViewportChange: function() {
				gl.viewport(0, 0, width, height);
			},

			onCameraFrustumChange: function() {
				mat4.perspective(45, width / height, 0.1, 100.0, pMatrix);
			},

			onCameraFrameChange: function() {
				mat4.identity(mvMatrix);
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

        		if (vf.positions > 0) {
	        		gl.vertexAttribPointer(program.renderCache.vertexPositionAttribute, 
	        			vf.positions, 
	        			gl.FLOAT, 
	        			false, 
	        			vf.getVertexSizeInBytes(), 
	        			4 * vf.getPositionsOffset());
        		}

        		if (vf.normals > 0 && program.renderCache.vertexNormalAttribute >= 0) {
        			gl.vertexAttribPointer(program.renderCache.vertexNormalAttribute,
        				vf.normals,
        				gl.FLOAT,
        				false,
        				vf.getVertexSizeInBytes(),
        				4 * vf.getNormalsOffset());
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

        	enableLight: function(lightIndex, light, program) {
        		gl.uniform3f(program.renderCache.lightAmbienUniform, light.ambient[0], light.ambient[1], light.ambient[2]);
        		gl.uniform3f(program.renderCache.lightDiffuseUniform, light.diffuse[0], light.diffuse[1], light.diffuse[2]);
        		gl.uniform3f(program.renderCache.lightSpecularUniform, light.specular[0], light.specular[1], light.specular[2]);
        		gl.uniform1f(program.renderCache.lightShininessUniform, light.shininess);
        		gl.uniform4f(program.renderCache.lightPositionUniform, light.position[0], light.position[1], light.position[2], light.position[3]);
        	},

        	disableLight: function() {

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
        		
        		program.renderCache.pMatrixUniform = gl.getUniformLocation(program.renderCache, "uPMatrix");
        		program.renderCache.mvMatrixUniform = gl.getUniformLocation(program.renderCache, "uMVMatrix");
        		program.renderCache.nMatrixUniform = gl.getUniformLocation(program.renderCache, "uNMatrix");

        		program.renderCache.useLightingUniform = gl.getUniformLocation(program.renderCache, "uUseLighting");
                program.renderCache.lightAmbienUniform = gl.getUniformLocation(program.renderCache, "uLightAmbient");
                program.renderCache.lightDiffuseUniform = gl.getUniformLocation(program.renderCache, "uLightDiffuse");
                program.renderCache.lightSpecularUniform = gl.getUniformLocation(program.renderCache, "uLightSpecular");
                program.renderCache.lightShininessUniform = gl.getUniformLocation(program.renderCache, "uLightShininess");
                program.renderCache.lightPositionUniform = gl.getUniformLocation(program.renderCache, "uLightPosition");

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
				for (var i = 0; i < aVisibilitySet.getGeometryCount(); i++) {
					this.renderGeometryNode(aVisibilitySet.getGeometryAt(i));
				}
			},

			renderGeometryNode: function(geometry) {
        		geometry.world.toMat4(mvMatrix);

        		var grc = geometry.getComponent("geometryRender");

				for (var p = 0; p < geometry.getPrimitiveCount(); p++) {
					var primitive = geometry.getPrimitiveAt(p);

					var vbo = primitive.getVertexBuffer();
					var ibo = primitive.getIndexBuffer();

					for (var e = 0; e < grc.getEffectCount(); e++) {
						var currentEffect = grc.getEffectAt(e);
						var program = currentEffect.getProgram();

						this.enableProgram(program)

		        		this.setMatrixUniforms(program);

						this.enableVertexBuffer(vbo, program);
						this.enableIndexBuffer(ibo, program);

						if (grc.getLightCount() > 0) {
							gl.uniform1i(program.renderCache.useLightingUniform, 1);
							for (var l = 0; l < grc.getLightCount(); l++) {
								this.enableLight(l, grc.getLightAt(l), program);
							}
						}
						else {
							gl.uniform1i(program.renderCache.useLightingUniform, 0);
						}

		        		var type = primitive.getType() == core.primitive.types.TRIANGLES ? gl.TRIANGLES : gl.LINES;
		        		gl.drawElements(type, ibo.getIndexCount(), gl.UNSIGNED_SHORT, 0);

		        		this.disableIndexBuffer(ibo);
		        		this.disableVertexBuffer(vbo);

		        		this.disableProgram(program);
					}
				}
			},
		};
	};

	return {
		light: light,
		shader: shader,
		shaderProgram: shaderProgram,
		effect: effect,
		renderComponent: renderComponent,
		geometryRenderComponent: geometryRenderComponent,
		visibilitySet: visibilitySet,
		computeVisibilitySet: computeVisibilitySet,
		renderStateUpdate: renderStateUpdate,
		renderer: renderer,
	}

});

