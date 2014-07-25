/*
 * Copyright (c) 2014, Hugo Hernan Saez
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: 
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer. 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution. 
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

define("Crimild", function(require) {

	var Crimild = {
		version: '2.0',

		// components
		CallbackComponent: require("components/CallbackComponent"),
		NodeComponent: require("components/NodeComponent"),
		OrbitComponent: require("components/OrbitComponent"),
		RenderComponent: require("components/RenderComponent"),

		// foundation
		Log: require("foundation/Log"),
		Object: require("foundation/CrimildObject"),

		// math
		Transformation: require("math/Transformation"),

		// primitives
		ParametricPrimitive: require("primitives/ParametricPrimitive"),
		Primitive: require("primitives/Primitive"),
		SpherePrimitive: require("primitives/SpherePrimitive"),
		TreefoilKnotPrimitive: require("primitives/TreefoilKnotPrimitive"),

		// rendering
		IndexBufferObject: require("rendering/IndexBufferObject"),
		Material: require("rendering/Material"),
		Renderer: require("rendering/Renderer"),
		RenderObject: require("rendering/RenderObject"),
		Shader: require("rendering/Shader"),
		ShaderAttribute: require("rendering/ShaderAttribute"),
		ShaderProgram: require("rendering/ShaderProgram"),
		ShaderUniform: require("rendering/ShaderUniform"),
		VertexBufferObject: require("rendering/VertexBufferObject"),
		VertexFormat: require("rendering/VertexFormat"),

		// rendering/programs
		ScreenProgram: require("rendering/programs/ScreenProgram"),

		// rendering/renderPasses
		ForwardRenderPass: require("rendering/renderPasses/ForwardRenderPass"),
		RenderPass: require("rendering/renderPasses/RenderPass"),

		// scenegraph
		Camera: require("scenegraph/Camera"),
		Group: require("scenegraph/Group"),
		Geometry: require("scenegraph/Geometry"),
		Light: require("scenegraph/Light"),
		Node: require("scenegraph/Node"),

		// simulation
		Simulation: require("simulation/Simulation"),

		// simulation tasks
		BeginRenderTask: require("simulation/tasks/BeginRenderTask"),
		EndRenderTask: require("simulation/tasks/EndRenderTask"),
		Task: require("simulation/tasks/Task"),
		UpdateSceneTask: require("simulation/tasks/UpdateSceneTask"),
		RenderSceneTask: require("simulation/tasks/RenderSceneTask"),

		// visitors
		NodeVisitor: require("visitors/NodeVisitor"),
		StartComponents: require("visitors/StartComponents"),
		UpdateComponents: require("visitors/UpdateComponents"),
		UpdateWorldState: require("visitors/UpdateWorldState"),
	};

	return Crimild;

});
