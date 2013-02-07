define(["./renderState"], function(renderState) {
	"use strict";

	var alphaState = Object.create(renderState);

	alphaState.srcBlendFuncTypes = {
		ZERO: 0,
    	ONE: 1,
    	SRC_COLOR: 0x0300,
    	ONE_MINUS_SRC_COLOR: 0x0301,
    	SRC_ALPHA: 0x0302,
    	ONE_MINUS_SRC_ALPHA: 0x0303,
    	DST_ALPHA: 0x0304,
    	ONE_MINUS_DST_ALPHA: 0x0305,
	};

	alphaState.dstBlendFuncTypes = {
		ZERO: 0,
    	ONE: 1,
    	SRC_COLOR: 0x0300,
    	ONE_MINUS_SRC_COLOR: 0x0301,
    	SRC_ALPHA: 0x0302,
    	ONE_MINUS_SRC_ALPHA: 0x0303,
    	DST_ALPHA: 0x0304,
    	ONE_MINUS_DST_ALPHA: 0x0305,
	};

	Object.defineProperties(alphaState, {
		srcBlendFunc: {
			get: function() {
				return this._srcBlendFunc;
			},
			set: function(value) {
				this._srcBlendFunc = value;
			}
		},
		dstBlendFunc: {
			get: function() {
				return this._dstBlendFunc;
			},
			set: function(value) {
				this._dstBlendFunc = value;
			}
		}
	});

	alphaState.set = function(spec) {
		spec = spec || {};

		renderState.set.call(this, spec);
		this.enabled = (spec.enabled === true);
		this._srcBlendFunc = spec.srcBlendFunc || alphaState.srcBlendFuncTypes.SRC_ALPHA;
		this._dstBlendFunc = spec.dstBlendFunc || alphaState.srcBlendFuncTypes.ONE_MINUS_SRC_ALPHA;

		return this;
	};

	return alphaState;
});

