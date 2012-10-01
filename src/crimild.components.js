define(["crimild.core"], function(core) {
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
        var that = core.nodeComponent({name: "update"});
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

	return {
		rotationComponent: rotationComponent,
		orbitingComponent: orbitingComponent
	};

});

