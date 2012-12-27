define(["crimild.core", "crimild.rendering",
	"text!../shaders/particle_system.vert", "text!../shaders/particle_system.frag",], function(core, rendering, default_vs, default_fs) {
	"use strict";

    var particleSystem = function(spec) {
        spec = spec || {};

        var vertices = [];
        var indices = [];
        var particleCount = spec.particleCount || 10;

        var _duration = spec.duration || 1;
        var _loop = spec.loop || false;
        var _gravity = spec.gravity || vec3.create([0, 0, 0]);
        var _velocity = spec.velocity || vec3.create([1, 1, 1]);
        var _spread = spec.spread || vec3.create([1, 1, 1]);
        var _particleSize = spec.particleSize || 20.0;

        var that = core.geometryNode(spec);

        Object.defineProperties(that, {
            duration: {
                get: function() {
                    return _duration;
                },
                set: function(value) {
                    _duration = value;
                }
            },
            loop: {
                get: function() {
                    return _loop;
                },
                set: function(value) {
                    _loop = value;
                }
            },
            gravity: {
                get: function() {
                    return _gravity;
                },
                set: function(value) {
                    _gravity = value;
                }
            }
        });

        for (var i = 0; i < particleCount; i++) {
            // particle origin (positions)
            vertices.push((Math.random() - 0.5));
            vertices.push((Math.random() - 0.5));
            vertices.push((Math.random() - 0.5));

            // particle velocity (normals)
            vertices.push(_velocity[0] + _spread[0] * (2.0 * Math.random() - 1.0));
            vertices.push(_velocity[1] + _spread[1] * (2.0 * Math.random() - 1.0));
            vertices.push(_velocity[2] + _spread[2] * (2.0 * Math.random() - 1.0));

            // misc (as texture coords)
            // first component used for particle size
            vertices.push(Math.max(_particleSize * 0.25, _particleSize * Math.random()));
            // second component used for particle time offset
            vertices.push(that.duration * Math.random());

            // particle index
            indices.push(i);
        }

        that.attachPrimitive(core.primitive({
            type: core.primitive.types.POINTS,
            vertexBuffer: core.vertexBufferObject({
                vertexFormat: core.vertexFormat({ positions: 3, normals: 3, textureCoords: 2 }),
                vertexCount: particleCount,
                data: new Float32Array(vertices),
            }),
            indexBuffer: core.indexBufferObject({
                indexCount: particleCount,
                data: new Uint16Array(indices)
            })
        }));

        that.attachComponent(rendering.renderComponent({
            effects: [
                rendering.effect({
                    shaderProgram: rendering.shaderProgram({
                        vertexShader: rendering.shader({
                            content: default_vs
                        }),
                        fragmentShader: rendering.shader({
                            content: default_fs
                        })
                    }),
                    textures: (spec.texture ? [spec.texture] : []),
                    alphaState: rendering.alphaState({enabled: true}),
                })
            ]
        }));

        that.attachComponent((function() {
            var time = 0;

            var cmp = rendering.shaderUniformComponent({
                uniforms: [
                    rendering.shaderUniform({
                        name: "uTime",
                        data: time,
                        type: rendering.shaderUniform.type.FLOAT,
                    }),
                    rendering.shaderUniform({
                        name: "uGravity",
                        data: that.gravity,
                        type: rendering.shaderUniform.type.FLOAT,
                        count: 3,
                    }),
                    rendering.shaderUniform({
                        name: "uLifetime",
                        data: that.duration,
                        type: rendering.shaderUniform.type.FLOAT,
                    }),
                ]
            });

            cmp.update = function(appTime, deltaTime) {
                time += deltaTime / 1000;

                cmp.getUniform("uTime").data = time;
            };

            return cmp;
        })());

        return that;
    };

	return {
		particleSystem: particleSystem,
	}

});

