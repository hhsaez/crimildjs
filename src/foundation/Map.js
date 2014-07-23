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

	function Map(spec) {
		spec = spec || {};
		Base.call(this, spec);

		this._objects = {};

		this.getKeyFunction = spec.getKeyFunction;
		this.onAttachCallback = spec.onAttachCallback;
		this.onDetachCallback = spec.onDetachCallback;

		if (!this.getKeyFunction) {
			this.getKeyFunction = function(object) { return object.name; }
		}

		for (var i in spec.objects) {
			this.attach(spec.objects[i]);
		}
	}

	Map.prototype = Object.create(Base.prototype);

	Object.defineProperties(Map.prototype, {
		getKeyFunction: {
			get: function() { return this._getKeyFunction; },
			set: function(value) { this._getKeyFunction = value; }
		},
		onAttachCallback: {
			get: function() { return this._onAttachCallback; },
			set: function(value) { this._onAttachCallback = value; },
		},
		onDetachCallback: {
			get: function() { return this._onDetachCallback; },
			set: function(value) { this._onDetachCallback = value; }
		},
	});

	Map.prototype.destroy = function() {
		this.detachAll(true);		
		Base.apply(this);
	};

	Map.prototype.attach = function(object) {
		var key = this.getKeyFunction(object);
		this._objects[key] = object;
		if (this.onAttachCallback) {
			this.onAttachCallback(object);
		}
	};

	Map.prototype.detach = function(object) {
		var key = this.getKeyFunction(object);
		return this.detachByKey(key);
	};

	Map.prototype.detachByKey = function(key) {
		var object = this._objects[key];
		this._objects[key] = null;
		if (this.onDetachCallback) {
			this.onDetachCallback(object);
		}
		return object;
	};

	Map.prototype.detachAll = function(destroyObjects) {
		for (var k in this._objects) {
			var object = this.detachByKey(k);
			if (object && destroyObjects) {
				object.destroy();
			}
		}

		this._objects = {};
	}

	Map.prototype.get = function(key) {
		return this._objects[key];
	};

	Map.prototype.each = function(callback) {
		var i = 0;
		for (var o in this._objects) {
			var object = this._objects[o];
			if (object) {
				callback(object, i++);
			}
		}
	};

	return Map;

});

