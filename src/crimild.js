define(["./crimild.math", "./crimild.core", "./crimild.core.primitives", "./crimild.components", "./crimild.rendering", "./crimild.simulation"], 
	function(math, core, primitives, components, rendering, simulation) {
	"use strict";
	
	return {
		math: math,
		core: core,
		primitives: primitives,
		components: components,
		rendering: rendering,
		simulation: simulation,
	}
});

