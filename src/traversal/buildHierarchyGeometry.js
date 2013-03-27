define(["core/nodeVisitor"], function(nodeVisitor) {
	"use strict";

	/**
		This visitor can be used to compute a visible geometry
		object linking all nodes in a hierarchy in order to
		render it later. It's specially useful for debugging 
		purposes.
	*/
	var buildHierarchyGeometry = Object.create(nodeVisitor);

	Object.defineProperties(buildHierarchyGeometry, {
		vertices: {
			get: function() {
				return this._vertices;
			}
		}
	});

	buildHierarchyGeometry.reset = function() {
		this.vertices = [];
	};

	buildHierarchyGeometry.getGeometry = function() {
		return null;
	};

	buildHierarchyGeometry.visitNode = function(node) {

	};

	return buildHierarchyGeometry;
});

