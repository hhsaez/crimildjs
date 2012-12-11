define(["crimild.core", "crimild.math", "crimild.simulation"], function(core, math, simulation) {
	"use strict";

	var rotationComponent = function(spec) {
		spec = spec || {}
		var that = core.nodeComponent({name: spec.name || "update"});

	    var angle = 0.0;
	    var angleInc = spec.angle || 0.01
	    var axis = vec3.normalize(spec.axis) || [0, 1, 0]

	    that.update = function() {
            that.node.local.rotate = quat4.fromAngleAxis(angle, axis)
            that.node.perform(core.worldStateUpdate());
            angle += angleInc;
	    };

		return that;
	};

    var orbitingComponent = function(spec) {
        spec = spec || {};
        var that = core.nodeComponent({name: spec.name || "update"});
        var x0 = spec.x0 || 0;
        var y0 = spec.y0 || 0;
        var x = 0;
        var y = 0;
        var a = spec.a || 20;
        var b = spec.b || 20;
        var t = 0;
        var speed = spec.speed || 0.01;
        var gamma = spec.gamma || 0;

        that.update = function() {
            x = x0 + a * Math.cos(t) * Math.cos(gamma) - b * Math.sin(t) * Math.sin(gamma);
            y = y0 + a * Math.cos(t) * Math.sin(gamma) + b * Math.sin(t) * Math.cos(gamma);

            t = t + speed;

            that.node.local.translate = [x, y, that.node.local.translate[2]];
            that.node.perform(core.worldStateUpdate());
        };

        return that;
    };

    var trackballComponent = function() {
        var that = crimild.core.nodeComponent({name: "update"});

        var mousePos = vec2.create();
        var mouseDelta = vec2.create();
        var mouseDown = false;
        var qPitch = quat4.create();
        var qYaw = quat4.create();
        var qTemp = quat4.create();
        var vUp = vec3.create();

        that.update = function() {
            crimild.simulation.simulator.input.getMousePos(mousePos);
            crimild.simulation.simulator.input.getMouseDelta(mouseDelta);

            if (crimild.simulation.simulator.input.isMouseButtonDown()) {
                that.node.local.computeWorldUp(vUp);

                quat4.fromAngleAxis((mouseDelta[1] / 10 * Math.PI / 180.0), [1, 0, 0], qPitch);
                quat4.fromAngleAxis((mouseDelta[0] / 10 * Math.PI / 180.0), [0, 1, 0], qYaw);

                quat4.multiply(qPitch, qYaw, qTemp);
                quat4.multiply(qTemp, that.node.local.rotate, qTemp);
                that.node.local.rotate = qTemp;
            }

            that.node.perform(crimild.core.worldStateUpdate());
        };

        return that;
    };

    var simpleCameraComponent = function() {
        var that = crimild.core.nodeComponent({name: "update"});
        var angle = 0;
        var tempVec3 = vec3.create();
        var tempDirection = vec3.create();
        var speed = 0.025;
        var z = 0.0;
        var qPitch = quat4.create();
        var qYaw = quat4.create();
        var qRot = quat4.create();
        var qTemp = quat4.create();
        var vRight = [1, 0, 0];
        var vUp = [0, 1, 0];

        that.update = function() {
            if (simulation.simulator.input.isKeyDown(38)) {
                z = speed;
            }
            else if (simulation.simulator.input.isKeyDown(40)) {
                z = -speed;
            }
            else {
                z = 0.0;
            }

            that.node.local.computeWorldUp(vUp);
            
            if (simulation.simulator.input.isKeyDown(37)) {
                quat4.fromAngleAxis(0.05, vUp, qYaw);
            }
            else if (simulation.simulator.input.isKeyDown(39)) {
                quat4.fromAngleAxis(-0.05, vUp, qYaw);
            }
            else {
                quat4.identity(qYaw);
            }

            if (simulation.simulator.input.isKeyDown("A".charCodeAt(0))) {
                quat4.fromAngleAxis(0.05, vRight, qPitch);
            }
            else if (simulation.simulator.input.isKeyDown("Z".charCodeAt(0))) {
                quat4.fromAngleAxis(-0.05, vRight, qPitch);
            }
            else {
                quat4.identity(qPitch);
            }

            quat4.multiply(qPitch, qYaw, qRot);
            quat4.multiply(that.node.local.rotate, qRot, qTemp);
            that.node.local.rotate = qTemp;

            that.node.local.computeDirection(tempDirection);
            that.node.local.translate[0] += z * tempDirection[0];
            that.node.local.translate[2] += z * tempDirection[2];

            that.node.perform(crimild.core.worldStateUpdate());
        };

        return that;
    };

    var lerpTransformComponent = function(spec) {
        var that = core.nodeComponent(spec);

        var _start = math.transformation();
        var _end = math.transformation();
        var _speed = spec.speed || 0.01;
        var _t = 0;

        Object.defineProperties(that, {
            start: {
                get: function() {
                    return _start;
                },
                set: function(value) {
                    _start.set(value);
                },
            },
            end: {
                get: function() {
                    return _end;
                },
                set: function(value) {
                    _end.set(value);
                }
            },
        });

        that.onAttach = function() {
            that.start.set(spec.start);
            that.end.set(spec.end);
            that.node.local.set(that.start);
            that.node.perform(core.worldStateUpdate());
        };

        that.update = function() {
            if (_t > 1.0) {
                that.node.local.set(that.end);
                that.node.perform(core.worldStateUpdate());

                if (spec.callback) {
                    spec.callback(that);
                }
                else {
                    that.node.detachComponent(that);
                }
            }
            else {
                vec3.lerp(that.start.translate, that.end.translate, Math.min(1, _t), that.node.local.translate);
                quat4.slerp(that.start.rotate, that.end.rotate, Math.min(1, _t), that.node.local.rotate);
                that.node.perform(core.worldStateUpdate());

                _t += _speed;
            }
        };

        return that;
    };

	return {
		rotationComponent: rotationComponent,
		orbitingComponent: orbitingComponent,
        trackballComponent: trackballComponent,
        lerpTransformComponent: lerpTransformComponent,
	};

});

