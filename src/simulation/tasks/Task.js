/*
 * Copyright (c) 2013, Hugo Hernan Saez
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

	function Task(spec) {
		Base.apply(this, spec);
	}

	Task.Priorities = {
		HIGHEST: 0,
		SCENE_PRE_UPDATE: 100,
		SCENE_UPDATE: 150,
		SCENE_POST_UPDATE: 190,
		SCENE_PRE_RENDER: 200,
		SCENE_RENDER: 250,
		SCENE_POST_RENDER: 290,
		LOWEST: 1000
	};

	Task.prototype = Object.create(Base.prototype);

	Task.prototype.destroy = function() {
		Base.apply(this);
	};

	Object.defineProperties(Task.prototype, {
		priority: {
			get: function() { return this._priority; },
			set: function(value) { this._priority = value; }
		},
	});

	Task.prototype.start = function() {

	}

	Task.prototype.update = function() {

	}

	Task.prototype.stop = function() {

	}

	return Task;

});

