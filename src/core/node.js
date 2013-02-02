define(["foundation/namedObject", "math/transformation", "foundation/objectFactory"], 
	function(namedObject, transformation, objectFactory) {

	"use strict";

	var node = Object.create(namedObject);

	Object.defineProperties(node, {
		parent: {
			get: function() {
				return this._parent;
			},
			set: function(value) {
				this._parent = value;
			},
		},
		local: {
			get: function() {
				return this._local;
			},
			set: function(value) {
				this._local.set(value);
			}
		},
		world: {
			get: function() {
				return this._world;
			},
			set: function(value) {
				this._world.set(value);
			}
		}
	});

	node.perform = function(visitor) {
		visitor.traverse(this);
	};

	node.accept = function(visitor) {
		visitor.visitNode(this);
	};

	node.attachComponent = function(component) {
		if (component) {
			this.detachComponentWithName(component.name);

			this._components[component.name] = component;
			component.node = this;
			component.onAttach();
		}
	};

	node.detachComponent = function(component) {
		this.detachComponentWithName(component.name);
	};

	node.detachComponentWithName = function(name) {
		if (this._components[name]) {
			this._components[name].onDetach();
			this._components[name].node = null;
			this._components[name] = null;
		}
	};

	node.getComponent = function(componentName) {
		return this._components[componentName];
	};

	node.updateAllComponents = function(time) {
		for (var c in this._components) {
			var component = this._components[c];
			if (component) {
				component.update(time);
			}
		}
	};

	node.detachAllComponents = function() {
		for (var c in this._components) {
			var component = this._components[c];
			if (component) {
				component.onDetach();
				component.node = null;
			}
		}

		this._components = {};
	};

	node.set = function(spec) {
		spec = spec || {};

		spec.name = spec.name || "node";
		namedObject.set.call(this, spec);

		this._parent = null;
		this._local = Object.create(transformation).set(spec.local);
		this._world = Object.create(transformation).set(spec.world);

		this.detachAllComponents();
		for (var c in spec.components) {
			this.attachComponent(objectFactory.inflate(spec.components[c]));
		}

		return this;
	};

	node.destroy = function() {
		this.detachAllComponents();
		this.parent = null;

		namedObject.destroy.call(this);
	};

	return node;
});
