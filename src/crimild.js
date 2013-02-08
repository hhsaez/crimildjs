/*
 * Copyright (c) 2013 Hernan Saez
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */

define(function(require) {
	return {
		// foundation
		namedObject: require("foundation/namedObject"),
		collection: require("foundation/collection"),
		objectFactory: require("foundation/objectFactory"),

		// math
		intersection: require("math/intersection"),
		transformation: require("math/transformation"),
		boundingVolume: require("math/boundingVolume"),
		utility: require("math/utility"),

		// core
		node: require("core/node"),
		groupNode: require("core/groupNode"),
		nodeComponent: require("core/nodeComponent"),
		nodeVisitor: require("core/nodeVisitor"),

		// traversal
		printScene: require("traversal/printScene"),
		updateComponents: require("traversal/updateComponents"),
		worldStateUpdate: require("traversal/worldStateUpdate"),

		// rendering
		alphaState: require("rendering/alphaState"),
		camera: require("rendering/camera"),
		cullState: require("rendering/cullState"),
		depthState: require("rendering/depthState"),
		effect: require("rendering/effect"),
		effectComponent: require("rendering/effectComponent"),
		frameBufferObject: require("rendering/frameBufferObject"),
		geometryNode: require("rendering/geometryNode"),
		image: require("rendering/image"),
		indexBufferObject: require("rendering/indexBufferObject"),
		light: require("rendering/light"),
		lightingComponent: require("rendering/lightingComponent"),
		lightNode: require("rendering/lightNode"),
		polygonOffsetState: require("rendering/polygonOffsetState"),
		primitive: require("rendering/primitive"),
		renderComponent: require("rendering/renderComponent"),
		renderer: require("rendering/renderer"),
		renderResource: require("rendering/renderResource"),
		renderResourceCatalog: require("rendering/renderResourceCatalog"),
		renderState: require("rendering/renderState"),
		shader: require("rendering/shader"),
		shaderProgram: require("rendering/shaderProgram"),
		shaderUniform: require("rendering/shaderUniform"),
		shaderUniformComponent: require("rendering/shaderUniformComponent"),
		texture: require("rendering/texture"),
		vertexBufferObject: require("rendering/vertexBufferObject"),
		vertexFormat: require("rendering/vertexFormat"),
		visibilitySet: require("rendering/visibilitySet"),

		// components
		rotationComponent: require("components/rotationComponent"),
		orbitComponent: require("components/orbitComponent"),
		trackpadComponent: require("components/trackpadComponent"),

		// primitives
		boxPrimitive: require("primitives/boxPrimitive"),
		parametricPrimitive: require("primitives/parametricPrimitive"),
		kleinBottlePrimitive: require("primitives/kleinBottlePrimitive"),
		conePrimitive: require("primitives/conePrimitive"),
		treefoilKnotPrimitive: require("primitives/treefoilKnotPrimitive"),
		spherePrimitive: require("primitives/spherePrimitive"),
		planePrimitive: require("primitives/planePrimitive"),

		// simulation
		simulator: require("simulation/simulator"),
		input: require("simulation/input"),

		// initialization
		run: function(spec) {
			spec = spec || {};

			return this.simulator.set(spec);
		},
	};
});

