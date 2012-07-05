define(["./crimild.core"], function(core) {
	"use strict";

	var renderComponent = function(spec) {
		var that = core.nodeComponent(spec);
		var effects = [];

		if (spec) {
			if (spec.effects) {
				effects = spec.effects;
			}
		}

		that.getEffectCount = function() {
			return effects.length;
		};

		that.getEffectAt = function(index) {
			return effects[index];
		};

		return that;
	};

	var geometryRenderComponent = function(spec) {
		var that = core.nodeComponent(spec);
		var effects = [];

		that.getEffectCount = function() {
			return effects.length;
		};

		that.getEffectAt = function(index) {
			return effects[index];
		};

		that.reset = function(opts) {
			if (opts) {
				if (opts.effects) {
					effects = opts.effects;
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

		that.visitGroupNode = function(group) {
			var i;
			var grc = group.renderComponent;

			if (grc) {
				var temp = []
				for (i = 0; i < grc.getEffectCount(); i++) {
					effects.push(grc.getEffectAt(i));
				}
			}

			for (i = 0; i < group.getNodeCount(); i++) {
				var node = group.getNodeAt(i);
				node.accept(this);
			}

			if (grc) {
				for (i = 0; i < grc.getEffectCount(); i++) {
					//effects.pop();
				}
			}
		};

		that.visitGeometryNode = function(geometry) {
			if (!geometry.geometryRenderComponent) {
				geometry.geometryRenderComponent = geometryRenderComponent({});
			}

			geometry.geometryRenderComponent.reset({
				effects: effects
			});
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

        		var grc = geometry.geometryRenderComponent;

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

