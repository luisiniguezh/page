/**
 * @author kovacsv / http://kovacsv.hu/
 * @author mrdoob / http://mrdoob.com/
 */
 
THREE.STLExporter = function () {};

THREE.STLExporter.prototype = {

	constructor: THREE.STLExporter,

	parse: ( function () {

		var vector = new THREE.Vector3();
		var normalMatrixWorld = new THREE.Matrix3();

		return function ( scene ) {

			var output = '';

			output += 'solid exported\n';

			scene.traverse( function ( object ) {

				if ( object instanceof THREE.Mesh ) {
					var geometry = object.geometry;
					var matrixWorld = object.matrixWorld;

					if ( geometry instanceof THREE.Geometry ) {

						var vertices = geometry.vertices;
						var faces = geometry.faces;

						normalMatrixWorld.getNormalMatrix( matrixWorld );

						for ( var i = 0, l = faces.length; i < l; i ++ ) {
							
							var face = faces[ i ];

							vector.copy( face.normal ).applyMatrix3( normalMatrixWorld ).normalize();

							output += '\tfacet normal ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';
							output += '\t\touter loop\n';

							var indices = [ face.a, face.b, face.c ];

							for ( var j = 0; j < 3; j ++ ) {

								vector.copy( vertices[ indices[ j ] ] ).applyMatrix4( matrixWorld );

								output += '\t\t\tvertex ' + -vector.x + ' ' + vector.z + ' ' + vector.y + '\n';

							}

							output += '\t\tendloop\n';
							output += '\tendfacet\n';

						}

					}

				}

			} );

			output += 'endsolid exported\n';

			return output;

		};

	}() )

};


/**
 * @author kovacsv / http://kovacsv.hu/
 */
 
/*THREE.STLExporter = function () {
	this.stlContent = '';
};

THREE.STLExporter.prototype = {
	constructor: THREE.STLExporter,
	
	exportScene : function (scene) {
		var meshes = [];
		
		var current;
		scene.traverse (function (current) {
			if (current instanceof THREE.Mesh) {
				meshes.push (current);
			}
		});
		
		return this.exportMeshes (meshes);
	},
	
	exportMesh : function (mesh) {
		return this.exportMeshes ([mesh]);
	},
	
	exportMeshes : function (meshes) {
		this.addLineToContent ('solid exported');
		
		var i, j, mesh, geometry, face, matrix, position;
		var normal, vertex1, vertex2, vertex3;
		for (i = 0; i < meshes.length; i++) {
			mesh = meshes[i];
			
			geometry = mesh.geometry;
			matrix = mesh.matrix;
			position = mesh.position;
			
			for (j = 0; j < geometry.faces.length; j++) {
				face = geometry.faces[j];
				normal = face.normal;
				if (face instanceof THREE.Face3) {
					vertex1 = this.getTransformedPosition (geometry.vertices[face.a], matrix, position);
					vertex2 = this.getTransformedPosition (geometry.vertices[face.b], matrix, position);
					vertex3 = this.getTransformedPosition (geometry.vertices[face.c], matrix, position);
					this.addTriangleToContent (normal, vertex1, vertex2, vertex3);
				} else if (face instanceof THREE.Face4) {
					vertex1 = this.getTransformedPosition (geometry.vertices[face.a], matrix, position);
					vertex2 = this.getTransformedPosition (geometry.vertices[face.b], matrix, position);
					vertex3 = this.getTransformedPosition (geometry.vertices[face.c], matrix, position);
					this.addTriangleToContent (normal, vertex1, vertex2, vertex3);

					vertex1 = this.getTransformedPosition (geometry.vertices[face.a], matrix, position);
					vertex2 = this.getTransformedPosition (geometry.vertices[face.c], matrix, position);
					vertex3 = this.getTransformedPosition (geometry.vertices[face.d], matrix, position);
					this.addTriangleToContent (normal, vertex1, vertex2, vertex3);
				}
			}
		};
		
		this.addLineToContent ('endsolid exported');
		return this.stlContent;
	},
	
	clearContent : function ()
	{
		this.stlContent = '';
	},
	
	addLineToContent : function (line) {
		this.stlContent += line + '\n';
	},
	
	addTriangleToContent : function (normal, vertex1, vertex2, vertex3) {
		this.addLineToContent ('\tfacet normal ' + normal.x + ' ' + normal.y + ' ' + normal.z);
		this.addLineToContent ('\t\touter loop');
		this.addLineToContent ('\t\t\tvertex ' + vertex1.x + ' ' + vertex1.y + ' ' + vertex1.z);
		this.addLineToContent ('\t\t\tvertex ' + vertex2.x + ' ' + vertex2.y + ' ' + vertex2.z);
		this.addLineToContent ('\t\t\tvertex ' + vertex3.x + ' ' + vertex3.y + ' ' + vertex3.z);
		this.addLineToContent ('\t\tendloop');
		this.addLineToContent ('\tendfacet');
	},
	
	getTransformedPosition : function (vertex, matrix, position) {
		var result = vertex.clone ();
		if (matrix !== undefined) {
			result.applyMatrix4 (matrix);
		}
		if (position !== undefined) {
			result.add (position);
		}
		return result;
	}
};*/