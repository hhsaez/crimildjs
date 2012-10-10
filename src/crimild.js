define([
	"./crimild.math", 
	"./crimild.core", 
	"./crimild.core.primitives", 
	"./crimild.components", 
	"./crimild.rendering", 
	"./crimild.simulation", 
	"./crimild.obj",
	"./crimild.utils"], 
	function(
		math, 
		core, 
		primitives, 
		components, 
		rendering, 
		simulation, 
		obj,
		utils) {

	"use strict";
	
	return {
		math: math,
		core: core,
		primitives: primitives,
		components: components,
		rendering: rendering,
		simulation: simulation,
		obj: obj,
		utils: utils
	}
});

