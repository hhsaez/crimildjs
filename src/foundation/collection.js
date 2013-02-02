define(["./namedObject", "./objectFactory"], function(namedObject, objectFactory) {
	"use strict";

	var collection = Object.create(namedObject);

	collection.count = function() {
		return this._elements.length;
	};

	collection.get = function(index) {
		return this._elements[index];
	};

	collection.each = function(callback) {
		if (callback) {
			for (var e in this._elements) {
				var elem = this._elements[e];
				if (elem) {
					callback(elem);
				}
			}
		}
	};

	collection.attach = function(element) {
		this._elements.push(element);
		if (this._onAttachElement) {
			this._onAttachElement(element);
		}
	};

	collection.detach = function(element) {
		var index = this._elements.indexOf(element);
		if (index >= 0) {
			this._elements.splice(index, 1);
			if (this._onDetachElement) {
				this._onDetachElement(element);
			}
		}
	};

	collection.clear = function() {
		for (var e in this._elements) {
			var elem = this._elements[e];
			if (elem && this._destroyElementsOnClean) {
				elem.destroy();
			}
		}
		this._elements = [];
	};

	collection.set = function(spec) {
		spec = spec || {};

		namedObject.set.call(this, spec);

		this.clear();
		this._onAttachElement = spec.onAttachElement;
		this._onDetachElement = spec.onDetachElement;
		this._destroyElementsOnClean = spec.destroyElementsOnClean || true; // true by default
		for (var e in spec.elements) {
			this.attach(objectFactory.inflate(spec.elements[e]));
		}

		return this;
	};

	collection.destroy = function() {
		this.clear();
		namedObject.destroy.call(this);
	};

	return collection;
});

