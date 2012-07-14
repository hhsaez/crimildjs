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
	}

	return {
		rotationComponent: rotationComponent,
	};

});

