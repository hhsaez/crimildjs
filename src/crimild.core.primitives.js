define(["crimild.core"], function(core) {

	var parametricPrimitive = function(spec) {
		var that = core.primitive(spec);

		var vertexFormat = core.vertexFormat({positions: 3});
		var upperBound;
		var divisions;
		var slices;
		var textureCount;

		if (spec) {
			vertexFormat = spec.vertexFormat ? spec.vertexFormat : vertexFormat;
		}

		that.setInterval = function(interval) {
			upperBound = interval.upperBound;
			divisions = interval.divisions;
			slices = vec2.subtract(divisions, vec2.createFrom(1, 1));
			textureCount = interval.textureCount;
		};

		that.getVertexCount = function() {
			return divisions[0] * divisions[1];
		};

		that.getLineIndexCount = function() {
			return 4 * slices[0] * slices[1];
		};

		that.getTriangleIndexCount = function() {
			return 6 * slices[0] * slices[1];
		};

		that.evalute = function(domain) {
			return null;
		}

		that.computeDomain = function(x, y) {
			return vec2.createFrom(x * upperBound[0] / slices[0], y * upperBound[1] / slices[1]);
		};

		that.generateVertexBuffer = function() {
			var vertices = [];
			for (var i = 0; i < divisions[1]; i++) {
				for (var j = 0; j < divisions[0]; j++) {
					var domain = that.computeDomain(j, i);
					var range = that.evaluate(domain);

					vertices.push(range[0]);
					vertices.push(range[1]);
					vertices.push(range[2]);
				}
			}

			var vbo = core.vertexBufferObject({vertexFormat: vertexFormat, vertexCount: that.getVertexCount(), data: new Float32Array(vertices)});
			that.setVertexBuffer(vbo);
		};

		that.generateLineIndexBuffer = function() {
			var indices = [];
			var vertex = 0;
			for (var i = 0; i < slices[1]; i++) {
				for (var j = 0; j < slices[0]; j++) {
					var next = (j + 1) % divisions[0];
					indices.push(vertex + j);
					indices.push(vertex + next);
					indices.push(vertex + j);
					indices.push(vertex + j + divisions[0]);
				}
				vertex = vertex + divisions[0];
			}
			that.setIndexBuffer(core.indexBufferObject({indexCount: that.getLineIndexCount(), data: new Uint16Array(indices)}));
		};

		that.generateTriangleIndexBuffer = function() {
			var indices = [];
			var vertex = 0;
			for (var i = 0; i < slices[1]; i++) {
				for (var j = 0; j < slices[0]; j++) {
					var next = (j + 1) % divisions[0];
					indices.push(vertex + j);
					indices.push(vertex + next);
					indices.push(vertex + j + divisions[0]);
					indices.push(vertex + next);
					indices.push(vertex + next + divisions[0]);
					indices.push(vertex + j + divisions[0]);
				}
				vertex = vertex + divisions[0];
			}
			that.setIndexBuffer(core.indexBufferObject({indexCount: that.getTriangleIndexCount(), data: new Uint16Array(indices)}));
		};

		that.generate = function() {
			that.generateVertexBuffer();
			if (that.getType() == core.primitive.types.LINES) {
				that.generateLineIndexBuffer();
			}
			else {
				that.generateTriangleIndexBuffer();
			}
		};

		return that;
	};
	
	var conePrimitive = function(spec) {
		var that = parametricPrimitive(spec);
		var height = 2.0;
		var radius = 1.0;
		var divisions = vec2.createFrom(20.0, 20.0);

		that.evaluate = function(domain) {
			var u = domain[0];
			var v = domain[1];
			var x = radius * (1.0 - v) * Math.cos(u);
			var y = height * (v - 0.5);
			var z = radius * (1.0 - v) * Math.sin(u);

			return vec3.createFrom(x, y, z);
		};

		that.setInterval({divisions: divisions, upperBound: vec2.createFrom(2.0 * Math.PI, 1.0), textureCount: vec2.createFrom(30, 20)});
		that.generate();

		return that;
	};

	var kleinBottlePrimitive = function(spec) {
		var that = parametricPrimitive(spec);

		var scale = 1.0;
		var divisions = vec2.createFrom(20, 20);

		that.evaluate = function(domain) {
			var v = 1.0 - domain[0];
			var u = domain[1];
			var x0 = 3.0 * Math.cos(u) * (1 + Math.sin(u)) + (2.0 * (1.0 - Math.cos(u) / 2.0)) * Math.cos(u) * Math.cos(v);
			var y0 = 8.0 * Math.sin(u) + (2 * (1.0 - Math.cos(u) / 2.0)) * Math.sin(u) * Math.cos(v);
			var x1 = 3.0 * Math.cos(u) * (1 + Math.sin(u)) + (2.0 * (1.0 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
			var y1 = 8 * Math.sin(u);

			var range = vec3.create();
			range[0] = u < Math.PI ? x0 : x1;
			range[1] = u < Math.PI ? -y0 : -y1;
			range[2] = (-2.0 * (1.0 - Math.cos(u) / 2)) * Math.sin(v);
			return range;
		};

		that.setInterval({divisions: divisions, upperBound: vec2.createFrom(2.0 * Math.PI, 2.0 * Math.PI)});
		that.generate();

		return that;
	};

	var spherePrimitive = function(spec) {
		var that = crimild.core.primitive(spec);
        var latitudeBands = 30;
        var longitudeBands = 30;
        var radius = 1;
        var vertexFormat = spec.vertexFormat;

		that.generate = function() {
            var vertexPositionData = [];
            for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
                var theta = latNumber * Math.PI / latitudeBands;
                var sinTheta = Math.sin(theta);
                var cosTheta = Math.cos(theta);

	            for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
	                var phi = longNumber * 2 * Math.PI / longitudeBands;
	                var sinPhi = Math.sin(phi);
	                var cosPhi = Math.cos(phi);

	                var x = cosPhi * sinTheta;
	                var y = cosTheta;
	                var z = sinPhi * sinTheta;
	                var u = 1 - (longNumber / longitudeBands);
	                var v = 1 - (latNumber / latitudeBands);

                    vertexPositionData.push(radius * x);
                    vertexPositionData.push(radius * y);
                    vertexPositionData.push(radius * z);
                }
            }

            var indexData = [];
            for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
                for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
                    var first = (latNumber * (longitudeBands + 1)) + longNumber;
                    var second = first + longitudeBands + 1;
                    indexData.push(first);
                    indexData.push(second);
                    indexData.push(first + 1);

                    indexData.push(second);
                    indexData.push(second + 1);
                    indexData.push(first + 1);
                }
            }

            that.setVertexBuffer(crimild.core.vertexBufferObject({vertexFormat: vertexFormat, count: vertexPositionData.length / 3, data: new Float32Array(vertexPositionData)}));
            that.setIndexBuffer(crimild.core.indexBufferObject({indexCount: indexData.length, data: new Uint16Array(indexData)}));
		};

		that.generate();

		return that;
	};

	return {
		parametricPrimitive: parametricPrimitive,
		conePrimitive: conePrimitive,
		kleinBottlePrimitive: kleinBottlePrimitive,
		spherePrimitive: spherePrimitive,
	};

});

