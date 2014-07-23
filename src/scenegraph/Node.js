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

	var Map = require("foundation/Map");

	function Node(spec) {
		spec = spec || {};
		Base.call(this, spec);

		this.parent = null;
		this.components = new Map({
			objects: spec.components,

			onAttachCallback: this.onComponentAttached,
			onDetachCallback: this.onComponentDetached
		});
	}

	Node.prototype = Object.create(Base.prototype);

	Object.defineProperties(Node.prototype, {
		parent: {
			get: function() { return this._parent; },
			set: function(value) { this._parent = value; }
		},
		components: {
			get: function() { return this._components; },
			set: function(value) { this._components = value; }
		},
	});

	Node.prototype.destroy = function() {
		Base.apply(this);
	};

	Node.prototype.perform = function(visitor) {
		visitor.traverse(this);
	};

	Node.prototype.accept = function(visitor) {
		visitor.visitNode(this);
	};

	Node.prototype.getComponentName = function(component) {
		return component.name;
	};

	Node.prototype.onComponentAttached = function(component) {
		component.node = this;
	};

	Node.prototype.onComponentDetached = function(component) {
		component.node = null;
	};

	return Node;

});

