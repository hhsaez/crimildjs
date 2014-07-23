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

	function List(spec) {
		spec = spec || {};
		Base.call(this, spec);

		this._objects = [];

		this.onAttachCallback = spec.onAttachCallback;
		this.onDetachCallback = spec.onDetachCallback;

		for (var i in spec.objects) {
			this.attach(spec.objects[i]);
		}
	}

	List.prototype = Object.create(Base.prototype);

	Object.defineProperties(List.prototype, {
		onAttachCallback: {
			get: function() { return this._onAttachCallback; },
			set: function(value) { this._onAttachCallback = value; },
		},
		onDetachCallback: {
			get: function() { return this._onDetachCallback; },
			set: function(value) { this._onDetachCallback = value; }
		},
	});

	List.prototype.destroy = function() {
		this.detachAll(true);
		Base.apply(this);
	};

	List.prototype.attach = function(object) {
		this._objects.push(object);
		if (this.onAttachCallback) {
			this.onAttachCallback(object);
		}
	};

	List.prototype.detach = function(object) {
		var index = this._objects.indexOf(object);
		if (index >= 0) {
			if (this.onDetachCallback) {
				this.onDetachCallback(object);
			}

			this._objects.splice(index, 1);
		}
		return object;
	};

	List.prototype.detachAll = function(destroyObjects) {
		this.each(function(object) {
			if (this.onDetachCallback) {
				this.onDetachCallback(object);
			}
			if (destroyObjects) {
				object.destroy();
			}
		});
		this._objects = [];
	};

	List.prototype.get = function(index) {
		return this._objects[index];
	};

	List.prototype.each = function(callback) {
		for (var i in this._objects) {
			callback(this._objects[i], i);
		}
	};

	return List;

});

