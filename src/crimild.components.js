define(["crimild.core"], function(core) {
	"use strict";

	var rotationComponent = function(spec) {
		spec = spec || {}
		var that = core.nodeComponent({name: spec.name || "update"});

	    var angle = 0.0;

	    that.update = function() {
            that.node.local.rotate = quat4.fromAngleAxis(angle, [0, 1, 0])
            that.node.perform(core.worldStateUpdate());
            angle += 0.01;
	    };

		return that;
	}

	return {
		rotationComponent: rotationComponent,
	};

});

