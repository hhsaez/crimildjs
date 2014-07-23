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

define(function(require) {

	"use strict";

	var Base = require("foundation/CrimildObject");

	function NodeVisitor(spec) {
		Base.call(this, spec);
	}

	NodeVisitor.prototype = Object.create(Base.prototype);

	NodeVisitor.prototype.destroy = function() {
		Base.apply(this);
	};

	NodeVisitor.prototype.traverse = function(node) {
		node.accept(this);
	};

	NodeVisitor.prototype.visitNode = function(node) {
		// do nothing
	};

	NodeVisitor.prototype.visitGroup = function(group) {
		this.visitNode(group);

		var visitor = this;
		group.nodes.each(function(node) {
			node.accept(visitor);
		});
	};

	NodeVisitor.prototype.visitGeometry = function(geometry) {
		// by default, treat a geometry as a simple node
		this.visitNode(geometry);
	};

	NodeVisitor.prototype.visitCamera = function(camera) {
		// by default, treat a camera as a simple node
		this.visitNode(camera);
	};

	return NodeVisitor;

});

