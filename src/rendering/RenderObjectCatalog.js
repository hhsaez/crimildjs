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

	function RenderObjectCatalog(spec) {
		Base.call(this, spec);

		this._objects = [];
	}

	RenderObjectCatalog.prototype = Object.create(Base.prototype);

	RenderObjectCatalog.prototype.destroy = function() {
		this.unloadAll();
		Base.destroy.call(this);
	};

	RenderObjectCatalog.prototype.generateId = function(renderer) {
		return -1;
	}

	RenderObjectCatalog.prototype.load = function(renderer, object) {
		object.renderObjectId = this.generateId(renderer);
		object.renderObjectCatalog = this;
		this._objects.push(object);
	}

	RenderObjectCatalog.prototype.unload = function(renderer, object) {
		var index = this._objects.indexOf(object);
		if (index >= 0) {
			object.renderObjectId = null;
			object.renderObjectCatalog = null;
			this._objects.splice(index, 1);
		}
	}

	RenderObjectCatalog.prototype.unloadAll = function() {
		for (var i in this._objects) {
			var object = this._objects[i];
			if (object) {
				this.unload(object);
			}
		}
		this._objects = [];
	}

	RenderObjectCatalog.prototype.bind = function(renderer, object) {
		if (!object.renderObjectCatalog) {
			this.load(renderer, object);
		}
	}

	RenderObjectCatalog.prototype.unbind = function(renderer, object) {

	}

	return RenderObjectCatalog;

});

