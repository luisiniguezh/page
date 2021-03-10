'use strict';

var ConstructorIL = {};

ConstructorIL.SkyBox = function(images) {200

    if (images !== undefined) {
        this.images = images;
    } else {
        this.images = [];
        this.images.push("../img/skybox/dawnmountain-xneg.png");
        this.images.push("../img/skybox/dawnmountain-xpos.png");
        this.images.push("../img/skybox/dawnmountain-zneg.png");
        this.images.push("../img/skybox/dawnmountain-zpos.png");
        this.images.push("../img/skybox/test1.png");
        this.images.push("../img/skybox/test2.png");
    }
    //this.Geometry = new THREE.BoxGeometry( 5000, 5000, 5000 );
    var mesh = ConstructorIL.Primitives.CreateBox(5000, 5000, 5000, 0xFFFFFF);
    this.Geometry = mesh.geometry;
    this.Faces = [];
    var texture;
    var img;
    for (var i = 0; i < 6; i++) {

        this.Faces.push(new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(this.images[i]),
            side: THREE.DoubleSide
        }));
    }
    this.Material = new THREE.MeshFaceMaterial(this.Faces);
    this.Material.color = "#FFFFFF";
    this.Entity = new ConstructorIL.Mesh(this.Geometry, this.Material);
    this.Entity.name = 'SkyBox';
}

ConstructorIL.SkyBox.prototype = {
    set Color(color) {
        this.Entity.material.color = color;
    },

    get Color() {
        return this.Entity.material.color;
    },

    get Visible() {
        return this.Entity.visible;
    },

    set Visible(bool) {
        this.Entity.visible = bool;
            //this.Entity.traverse( function ( object ) { object.visible = bool; } );
        }
    }

    ConstructorIL.SkySphere = function() {
    //0xa2a6ba
    var mesh = ConstructorIL.Primitives.CreateSphere(2600, 0xa2a6ba);
    this.Geometry = mesh.geometry; //new THREE.SphereGeometry(2600,30,30);
    this.Material = new THREE.MeshLambertMaterial({
        color: 0xa2a6ba,
        ambient: 0xa2a6ba,
        specular: 0x111111,
        shininess: 100,
        side: THREE.DoubleSide
    });
    //this.Material=ConstructorIL.Shaders.singleColor();
    this.Entity = new ConstructorIL.Mesh(this.Geometry, this.Material);
    this.Entity.name = 'SkySpehere';
}

ConstructorIL.SkySphere.prototype = {
    set Color(color) {
        this.Entity.material.color.setStyle(color);
    },

    get Color() {
        return this.Entity.material.color.getStyle();
    },

    get Visible() {
        return this.Entity.visible;
    },

    set Visible(bool) {
        this.Entity.visible = bool;
            //this.Entity.traverse( function ( object ) { object.visible = bool; } );
        },

        flipLighting: function() {

            for (var i = 0; i < this.Entity.geometry.faces.length; i++) {
                this.Entity.geometry.faces[i].normal.x *= -1;
                this.Entity.geometry.faces[i].normal.y *= -1;
                this.Entity.geometry.faces[i].normal.z *= -1;
            }
            this.Entity.geometry.normalsNeedUpdate = true;
            this.Entity.geometry.computeVertexNormals();
        }
    }

    ConstructorIL.NavigationCube = function(viewport) {
    //TO-DO
    this.Entity = ConstructorIL.Primitives.CreateBox(5, 5, 5, 0x00FF00);
    this.Viewport =viewport;
    this.Entity.name="Navigation Cube";
}

ConstructorIL.NavigationCube.prototype={
    update:function(){
        //this.Entity.rotation.copy(this.Viewport.Camera.rotation);
        //var vector=new THREE.Vector3(0,0,-1);
        //vector.applyQuaternion(this.Viewport.Camera.quaternion);    

        var inverse=new THREE.Matrix4();
        inverse.getInverse(this.Entity.matrixWorld)
        this.Entity.geometry.applyMatrix(inverse)
        //this.Entity.position.copy(this.Viewport.Camera.position);
    }
}
ConstructorIL.Grid = function(minX, maxX, minY, maxY) {

    var geometry = new THREE.Geometry();

    //Center
    var midX = minX + (Math.abs(maxX - minX) / 2);
    var midY = minY + (Math.abs(maxY - minY) / 2);

    geometry.vertices.push(new THREE.Vector3(minX, midY, 0));
    geometry.vertices.push(new THREE.Vector3(maxX, midY, 0));
    geometry.vertices.push(new THREE.Vector3(midX, minY, 0));
    geometry.vertices.push(new THREE.Vector3(midX, maxY, 0));

    this.MidGrid = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: 0x4DA7FF,
        opacity: .5,
        transparent: true
    }));
    this.MidGrid.type = THREE.LinePieces;

    geometry = new THREE.Geometry();
    for (var i = minY; i <= maxY; i += 5) {
        if (i == midY) continue;
        geometry.vertices.push(new THREE.Vector3(minX, i, 0));
        geometry.vertices.push(new THREE.Vector3(maxX, i, 0));
    }
    for (var j = minX; j <= maxX; j += 5) {
        if (j == midX) continue;
        geometry.vertices.push(new THREE.Vector3(j, minY, 0));
        geometry.vertices.push(new THREE.Vector3(j, maxY, 0));
    }

    this.MajorGrid = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: 0x7BBEFF,
        opacity: .5,
        transparent: true
    }));
    this.MajorGrid.type = THREE.LinePieces;

    geometry = new THREE.Geometry();

    for (var k = minY; k <= maxY; k += 1) {
        if (k % 5 == 0 || k == maxY / 2) continue;
        geometry.vertices.push(new THREE.Vector3(minX, k, 0));
        geometry.vertices.push(new THREE.Vector3(maxX, k, 0));
    }
    for (var l = minX; l <= maxX; l += 1) {
        if (l % 5 == 0 || l == maxX / 2) continue;
        geometry.vertices.push(new THREE.Vector3(l, minY, 0));
        geometry.vertices.push(new THREE.Vector3(l, maxY, 0));
    }

    this.MinorGrid = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: 0xAAD5FF,
        opacity: .5,
        transparent: true
    }));
    this.MinorGrid.type = THREE.LinePieces;




    this.Entity = new THREE.Object3D();

    this.Entity.add(this.MidGrid);
    this.Entity.add(this.MajorGrid);
    this.Entity.add(this.MinorGrid);

    this.Entity.name = "Grid";
}

ConstructorIL.Grid.prototype = {
    get MinorLineColor() {
        return this.MinorGrid.material.color.getStyle();
    },

    set MinorLineColor(color) {
        this.MinorGrid.material.color.setStyle(color);
    },

    get MajorLineColor() {
        return this.MajorGrid.material.color.getStyle();
    },

    set MajorLineColor(color) {
        this.MajorGrid.material.color.setStyle(color);
    },

    get MidLineColor() {
        return this.MidGrid.material.color.getStyle();
    },

    set MidLineColor(color) {
        this.MidGrid.material.color.setStyle(color);
    },

    set Color(color) {
        this.MajorGrid.material.color.setStyle(color);
        this.MinorGrid.material.color.setStyle(color);
        this.MidGrid.material.color.setStyle(color);
    },

    get Color() {
        return MinorLineColor;
    },

    get Visible() {
        return this.Entity.visible;
    },

    set Visible(bool) {
        this.Entity.visible = bool;
        this.Entity.traverse(function(object) {
            object.visible = bool;
        });
    }
}

ConstructorIL.PrintingBox = function(minX, maxX, minY, maxY, maxZ) {

    this.Geometry = new THREE.Geometry();

    //vertical lines
    this.Geometry.vertices.push(new THREE.Vector3(minX, minY, 0));
    this.Geometry.vertices.push(new THREE.Vector3(minX, minY, maxZ));
    this.Geometry.vertices.push(new THREE.Vector3(maxX, minY, 0));
    this.Geometry.vertices.push(new THREE.Vector3(maxX, minY, maxZ));
    this.Geometry.vertices.push(new THREE.Vector3(minX, maxY, 0));
    this.Geometry.vertices.push(new THREE.Vector3(minX, maxY, maxZ));
    this.Geometry.vertices.push(new THREE.Vector3(maxX, maxY, 0));
    this.Geometry.vertices.push(new THREE.Vector3(maxX, maxY, maxZ));

    //level 2
    this.Geometry.vertices.push(new THREE.Vector3(minX, minY, maxZ));
    this.Geometry.vertices.push(new THREE.Vector3(maxX, minY, maxZ));
    this.Geometry.vertices.push(new THREE.Vector3(maxX, minY, maxZ));
    this.Geometry.vertices.push(new THREE.Vector3(maxX, maxY, maxZ));
    this.Geometry.vertices.push(new THREE.Vector3(maxX, maxY, maxZ));
    this.Geometry.vertices.push(new THREE.Vector3(minX, maxY, maxZ));
    this.Geometry.vertices.push(new THREE.Vector3(minX, maxY, maxZ));
    this.Geometry.vertices.push(new THREE.Vector3(minX, minY, maxZ));

    //level1
    this.Geometry.vertices.push(new THREE.Vector3(minX, minY, 0));
    this.Geometry.vertices.push(new THREE.Vector3(maxX, minY, 0));
    this.Geometry.vertices.push(new THREE.Vector3(maxX, minY, 0));
    this.Geometry.vertices.push(new THREE.Vector3(maxX, maxY, 0));
    this.Geometry.vertices.push(new THREE.Vector3(maxX, maxY, 0));
    this.Geometry.vertices.push(new THREE.Vector3(minX, maxY, 0));
    this.Geometry.vertices.push(new THREE.Vector3(minX, maxY, 0));
    this.Geometry.vertices.push(new THREE.Vector3(minX, minY, 0));

    this.Geometry.computeLineDistances();
    this.Material = new THREE.LineDashedMaterial({
        color: 0xffaa00,
        dashSize: 3,
        gapSize: 3,
        linewidth: 3
    });
    this.Entity = new THREE.Line(this.Geometry, this.Material, THREE.LinePieces);
    this.Entity.name = "PrintingBox";
}

ConstructorIL.PrintingBox.prototype = {
    set Color(color) {
        this.Entity.material.color.setStyle(color);
    },

    get Color() {
        return this.Entity.material.color.getStyle();
    },

    get Visible() {
        return this.Entity.visible;
    },

    set Visible(bool) {
        this.Entity.visible = bool;
            //this.Entity.traverse( function ( object ) { object.visible = bool; } );
        }
    }

    ConstructorIL.BoundingBoxHelper = function(viewport) {
        this.Viewport = viewport;
        this.Object3D = new THREE.Object3D();
        this.visible = true;
    }

    ConstructorIL.BoundingBoxHelper.prototype = {
        set Visible(bool) {
            this.visible = bool;
            this.update();

        },

        get Visible() {
            return this.visible;
        },

        update: function() {
            var objects = this.Viewport.getSelectedEntities();
            this.Viewport.Scene.remove(this.Object3D);
            if (objects.length < 1 || !this.Visible) return;
            var boundingBox = new THREE.Box3();
            boundingBox.setFromObject(objects[0]);
            var boxMin = new THREE.Vector3();
            var boxMax = new THREE.Vector3();
            boxMin.copy(boundingBox.min);
            boxMax.copy(boundingBox.max);
            for (var entityIndex in objects) {
                boundingBox.setFromObject(objects[entityIndex]);
                boundingBox.min.copy(boundingBox.min);
                if (boxMin.x > boundingBox.min.x)
                    boxMin.x = boundingBox.min.x;

                if (boxMin.y > boundingBox.min.y)
                    boxMin.y = boundingBox.min.y;

                if (boxMin.z > boundingBox.min.z)
                    boxMin.z = boundingBox.min.z

                if (boxMax.x < boundingBox.max.x)
                    boxMax.x = boundingBox.max.x;

                if (boxMax.y < boundingBox.max.y)
                    boxMax.y = boundingBox.max.y;

                if (boxMax.z < boundingBox.max.z)
                    boxMax.z = boundingBox.max.z
            }


            var geometry = new THREE.Geometry();
            //vertical lines
            geometry.vertices.push(new THREE.Vector3(boxMin.x, boxMin.y, boxMin.z));
            geometry.vertices.push(new THREE.Vector3(boxMin.x, boxMin.y, boxMax.z));
            geometry.vertices.push(new THREE.Vector3(boxMax.x, boxMin.y, boxMin.z));
            geometry.vertices.push(new THREE.Vector3(boxMax.x, boxMin.y, boxMax.z));
            geometry.vertices.push(new THREE.Vector3(boxMin.x, boxMax.y, boxMin.z));
            geometry.vertices.push(new THREE.Vector3(boxMin.x, boxMax.y, boxMax.z));
            geometry.vertices.push(new THREE.Vector3(boxMax.x, boxMax.y, boxMin.z));
            geometry.vertices.push(new THREE.Vector3(boxMax.x, boxMax.y, boxMax.z));

            //level 2
            geometry.vertices.push(new THREE.Vector3(boxMin.x, boxMin.y, boxMax.z));
            geometry.vertices.push(new THREE.Vector3(boxMax.x, boxMin.y, boxMax.z));
            geometry.vertices.push(new THREE.Vector3(boxMax.x, boxMin.y, boxMax.z));
            geometry.vertices.push(new THREE.Vector3(boxMax.x, boxMax.y, boxMax.z));
            geometry.vertices.push(new THREE.Vector3(boxMax.x, boxMax.y, boxMax.z));
            geometry.vertices.push(new THREE.Vector3(boxMin.x, boxMax.y, boxMax.z));
            geometry.vertices.push(new THREE.Vector3(boxMin.x, boxMax.y, boxMax.z));
            geometry.vertices.push(new THREE.Vector3(boxMin.x, boxMin.y, boxMax.z));

            //level1
            geometry.vertices.push(new THREE.Vector3(boxMin.x, boxMin.y, boxMin.z));
            geometry.vertices.push(new THREE.Vector3(boxMax.x, boxMin.y, boxMin.z));
            geometry.vertices.push(new THREE.Vector3(boxMax.x, boxMin.y, boxMin.z));
            geometry.vertices.push(new THREE.Vector3(boxMax.x, boxMax.y, boxMin.z));
            geometry.vertices.push(new THREE.Vector3(boxMax.x, boxMax.y, boxMin.z));
            geometry.vertices.push(new THREE.Vector3(boxMin.x, boxMax.y, boxMin.z));
            geometry.vertices.push(new THREE.Vector3(boxMin.x, boxMax.y, boxMin.z));
            geometry.vertices.push(new THREE.Vector3(boxMin.x, boxMin.y, boxMin.z));

            geometry.computeLineDistances();

            var material = new THREE.LineDashedMaterial({
                color: 0xffaa00,
                dashSize: 3,
                gapSize: 3,
                linewidth: 3
            });
            var box = new THREE.Line(geometry, material, THREE.LinePieces)
            this.Object3D = new THREE.Object3D();
            this.Object3D.name = "BoundingBox";
            var totalSize = new THREE.Vector3();
            totalSize.subVectors(boxMax, boxMin);
            var sprite = ConstructorIL.Utils.createSpriteLabel("X: " + totalSize.x.toFixed(2) + " Y: " + totalSize.y.toFixed(2) + " Z: " + totalSize.z.toFixed(2));
            sprite.position.fromArray(boxMax.toArray());
            this.Object3D.add(box);
            this.Object3D.add(sprite);


            this.Viewport.Scene.add(this.Object3D);
            //this.Object3D.position.set(0,0,0);
        }
    }

    ConstructorIL.Layer = function(identifier, vport) {
        var obj = new THREE.Object3D();
        obj.name = identifier;
        Object.defineProperty(this, "Object3D", {
            value: obj,
            enumerable: false,
            writable: true,
        });
        Object.defineProperty(this, "name", {
            value: identifier,
            enumerable: false,
            writable: true,
        });

        Object.defineProperty(this, "Viewport", {
            value: vport,
            enumerable: false,
            writable: false,
        });
    }

    ConstructorIL.Layer.prototype = {

    set Visible(bool) {
        this.Object3D.visible = bool;
        this.traverse(function(obj) {
            obj.visible = bool
        });
    },

    get Visible() {
        return this.Object3D.visible;
    },

    add: function(entity) {
        if (entity instanceof THREE.Mesh || entity instanceof THREE.Object3D) {
            //this.Viewport.snapToGrid(entity);
            this.Object3D.add(entity);
        } else if (entity instanceof ConstructorIL.Layer) {
            this.Object3D.add(entity.Object3D);
            Object.defineProperty(this, entity.name, {
                value: entity,
                enumerable: true,
                writable: true,
            });
        }
        this.Viewport.updateLayerControl();
    },

    remove: function(entity) {
        if (entity instanceof THREE.Object3D) {
            this.Object3D.remove(entity);
        } else if (entity instanceof ConstructorIL.Layer) {
            this.Object3D.remove(entity.Object3D);
            delete this['entity'];
        }
        this.Viewport.updateLayerControl();
    },

    getSelectedEntities: function() {
        var entities = [];

        this.Object3D.traverse(function(object) {
            if (object.Selected == true)
                entities.push(object);
        });
        return entities;
    },

    getEntities: function() {
        var entities = [];
        this.Object3D.traverse(function(object) {
            if(object instanceof ConstructorIL.Mesh){
                entities.push(object);
            }
        });
        return entities;
    },

    getEntityById:function(id){
        return this.Object3D.getObjectById(id,false);
    },

    getEntityByName:function(name){
        return this.Object3D.getObjectByName(name,false);
    },

    clone: function() {
        var clone = new ConstructorIL.Layer(this.name, this.Viewport);
        clone.Object3D = this.Object3D.clone();
        for (var property in this) {
            if (this.hasOwnProperty(property)) {
                var obj = clone.Object3D.getObjectByName(property, true);
                clone[property] = new ConstructorIL.Layer(property, clone.Viewport)
                clone[property].Object3D = obj;
                // Object.defineProperty(clone,property,{
                // 	value:obj,
                // 	enumerable:true,
                // 	writable:true,
                // });
}
}
return clone;
},

traverse: function(callback) {
    this.Object3D.traverse(callback);
},

clear: function() {
    for (var property in this) {
        this.remove(this['property']);
    }
    this.Viewport.Scene.remove(this.Object3D);
    this.Object3D = new THREE.Object3D();
    this.Viewport.Scene.add(this.Object3D);
},

/*Deprecated Methods */
addEntity: function(entity) {
    console.warn("layer.addEntity is deprecated use layer.add instead");
    this.add(entity);
},

addLayer: function(layer) {
    console.warn("layer.addLayer is deprecated use layer.add instead");
    this.add(layer);
}
}

ConstructorIL.Mesh = function(geometry, material) {
    THREE.Mesh.call(this, geometry, material);

    this.materialOriginal = this.material;
    this.selected = false;
    this.size=new THREE.Vector3();
    this.geometry.computeBoundingBox();
    this.size.subVectors(this.geometry.boundingBox.max,this.geometry.boundingBox.min);
    Object.defineProperty(this, "Size", {

        get: function(){
            this.geometry.computeBoundingBox();
            this.size.subVectors(this.geometry.boundingBox.max,this.geometry.boundingBox.min);
            this.size.x=this.size.x*this.scale.x;
            this.size.y=this.size.y*this.scale.y;
            this.size.z=this.size.z*this.scale.z;
            return this.size;
        },

        set: function(vector){
            if(vector instanceof THREE.Vector3){
                this.geometry.computeBoundingBox();
                this.size=new THREE.Vector3();
                this.size.subVectors(this.geometry.boundingBox.max,this.geometry.boundingBox.min);
                this.scale.x=(vector.x - this.size.x)/this.size.x + 1;
                this.scale.y=(vector.y - this.size.y)/this.size.y + 1;
                this.scale.z=(vector.z - this.size.z)/this.size.z + 1;
            }
        }
    });

    Object.defineProperty(this, "Selected", {
        get: function() {
            return this.selected;
        },

        set: function(bool) {
            this.selected = bool;
            if (bool && !(this.geometry instanceof THREE.PlaneGeometry)) {
                var texture = THREE.ImageUtils.loadTexture("../img/textures/selected.jpg");
                this.material.needsUpdate = true;
                this.geometry.buffersNeedUpdate = true;
                this.geometry.uvsNeedUpdate = true;
                ConstructorIL.GeometryUtils.computeUvs(this.geometry);
                this.materialOriginal = this.material;
                this.material = new THREE.MeshPhongMaterial({
                    color: this.material.color,
                    ambient: this.material.ambient,
                    specular: 0x111111,
                    shininess: 200,
                    shading: THREE.FlatShading,
                    map: texture,
                    wireframe: this.materialOriginal.wireframe,
                    side: THREE.DoubleSide
                });


            } else {
                this.material = this.materialOriginal;
            }
        }
    });

Object.defineProperty(this, "Wireframe", {
    get: function() {
        return this.materialOriginal.wireframe;
    },

    set: function(bool) {
        this.material.wireframe = bool;
        this.materialOriginal.wireframe = bool;
        this.material.needsUpdate = true;
        this.materialOriginal.needsUpdate = true;
    }
});

var clone = function(object, recursive) {
    if (object === undefined) object = new ConstructorIL.Mesh(this.geometry.clone(), this.materialOriginal.clone());
    if (recursive === undefined) recursive = true;

    object.name = this.name;

    object.up.copy(this.up);

    object.position.copy(this.position);
    object.quaternion.copy(this.quaternion);
    object.scale.copy(this.scale);

    object.renderDepth = this.renderDepth;

    object.rotationAutoUpdate = this.rotationAutoUpdate;

    object.matrix.copy(this.matrix);
    object.matrixWorld.copy(this.matrixWorld);

    object.matrixAutoUpdate = this.matrixAutoUpdate;
    object.matrixWorldNeedsUpdate = this.matrixWorldNeedsUpdate;

    object.visible = this.visible;

    object.castShadow = this.castShadow;
    object.receiveShadow = this.receiveShadow;

    object.frustumCulled = this.frustumCulled;

    object.userData = JSON.parse(JSON.stringify(this.userData));

    if (recursive === true) {

        for (var i = 0; i < this.children.length; i++) {

            var child = this.children[i];
            object.add(child.clone());

        }

    }

    return object;
}
Object.defineProperty(this, "clone", {
    value: clone,
    enumerable: false,
    writable: false,
});
}

ConstructorIL.Mesh.prototype = Object.create(THREE.Mesh.prototype);

ConstructorIL.ClipBoard = function(viewport) {
    this.Entities = [];
    this.IsCopy;
    this.Viewport = viewport;
    this.OffsetStep = 5;
    this.Position= new THREE.Vector3( 0, 0, 0 );
}

ConstructorIL.ClipBoard.prototype = {
    copy: function(entities) {
        this.Entities.length = 0;
        this.Entities = entities;
        this.isCopy = true;
        this.OffsetStep=5;
    },

    cut: function(entities) {
        this.Viewport.HistoryRecord.do("Cut");
        this.Entities = entities;
        for (var entity in entities) {
            this.Viewport.remove(entities[entity]);
        }
        this.isCopy = false;
        this.Viewport.TransformControls.detach();
        this.Viewport.Scene.remove(this.Viewport.TransformControls);
        this.Viewport.updateLayerControl();
    },

    paste: function() {
        viewport.HistoryRecord.do("Paste");
        if (this.isCopy) {
            var copiedEntity;
            for (var entity in this.Entities) {
                copiedEntity = this.Entities[entity].clone();
                copiedEntity.position.x+=this.OffsetStep;
                copiedEntity.position.y+=this.OffsetStep;
                this.OffsetStep+=5;
                this.Viewport.add(copiedEntity);
            }
        } else {
            for (var entity in this.Entities) {
                this.Entities[entity].Selected=false;
                this.Viewport.add(this.Entities[entity]);
            }
            this.Entities.length = 0;
        }
        this.Viewport.updateLayerControl();
    }
}

ConstructorIL.Snapshot = function(scene, action) {
    this.Scene = scene;
    this.Name = action;
}

ConstructorIL.HistoryRecord = function(viewport) {
    this.UnDoStack = [];
    this.ReDoStack = [];
    this.Viewport = viewport;
    this.ActionLimit = 10;
}

ConstructorIL.HistoryRecord.prototype = {
    do : function(action) {
        /*action = action == undefined ? "uknown" : action;
        this.ReDoStack.length = 0;
        var snapshot = new ConstructorIL.Snapshot(this.Viewport.Layers.clone(), action);
        this.UnDoStack.push(snapshot);*/
    },

    unDo: function() {
        if (this.UnDoStack.length > 0) {
            if(!this.Viewport.ClipBoard.isCopy)this.Viewport.ClipBoard.Entities=[];
            var snapshot = new ConstructorIL.Snapshot(this.Viewport.Layers, "accion");
            this.ReDoStack.push(snapshot);
            this.Viewport.Scene.remove(this.Viewport.Layers.Object3D);
            var tmp = this.UnDoStack.pop().Scene;
            this.Viewport.Layers = tmp;
            this.Viewport.Scene.add(this.Viewport.Layers.Object3D);
            this.Viewport.Layers.Visible = true;
            //this.Viewport.TransformControls.detach("dfg");
            //$("#transformControls").hide("200");
            
            this.Viewport.clearSelection();
            this.Viewport.BoundingBoxHelper.update();
        }
    },

    reDo: function() {
        if (this.ReDoStack.length > 0) {
            var snapshot = new ConstructorIL.Snapshot(this.Viewport.Layers, "accion");
            this.UnDoStack.push(snapshot);
            this.Viewport.Scene.remove(this.Viewport.Layers.Object3D);
            this.Viewport.Layers = this.ReDoStack.pop().Scene;
            this.Viewport.Scene.add(this.Viewport.Layers.Object3D);
            this.Viewport.clearSelection();
            this.Viewport.BoundingBoxHelper.update();
        }
    }
}

ConstructorIL.Viewport = function(viewportContainer) {
    THREE.ImageUtils.crossOrigin = 'anonymous';
    this.BackgroundColor = 0xF1F8FC;
    this.Renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    this.Scene = new THREE.Scene();
    this.HTMLContainer = $(viewportContainer);
    this.Camera = new THREE.PerspectiveCamera(45, this.HTMLContainer.width() / this.HTMLContainer.height(), 0.01, 10000);
    this.Camera.position.y = -250;
    this.Camera.position.z = 200;
    this.Camera.position.x = 160;
    this.Camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.Camera.name = "Camera";
    this.Camera.up.set(0, 0, 1);
    this.Camera.updateMatrix();
    this.Controls = new THREE.OrbitControls(this.Camera, this.Renderer.domElement);

    // this.NavigationCube=new ConstructorIL.NavigationCube(this);
    // this.Scene.add(this.NavigationCube.Entity);

    this.TransformControls = new THREE.TransformControls(this.Camera, this.Renderer.domElement);
    this.TransformControls.viewport=this;
    this.TransformControls.size = 0.5;

    this.Projector = new THREE.Projector();
    this.domElement = this.Renderer.domElement;
    this.domElement.id = "canvas";

    this.updateLayerControl = function() {

    };

    this.updatePropertiesControl = function() {

    };

    this.ImageInput=document.createElement('input');
    this.ImageInput.setAttribute("type", "file");
    this.ImageInput.multiple=true;
    this.ImageInput.accept="image/*";
    $(this.ImageInput).on("change",ConstructorIL.File.importImageHandle(this));

    this.FileInput=document.createElement('input');
    this.FileInput.setAttribute("type", "file");
    this.FileInput.multiple=true;
    this.FileInput.accept=".stl, .cil";
    $(this.FileInput).on("change",ConstructorIL.File.importHandle(this,0xEE8136));

    //this.Sky = new ConstructorIL.SkySphere();
    //this.Sky = new ConstructorIL.SkyBox();
    this.Sky=new ConstructorIL.SkySphere();
    this.Scene.add(this.Sky.Entity);


    this.Grid = new ConstructorIL.Grid(-140, 140, -90, 90);
    this.Scene.add(this.Grid.Entity);

    this.PrintingBox = new ConstructorIL.PrintingBox(-140, 140, -90, 90, 160);
    this.Scene.add(this.PrintingBox.Entity);
    //TO-FIX
    this.HistoryRecord = new ConstructorIL.HistoryRecord(this);
    //
    this.Layers = new ConstructorIL.Layer("LayerList", this);
    //this.Layers.addLayer(new ConstructorIL.Layer("Default", this));

    this.Tools = new ConstructorIL.Layer("ToolsLayer", this);
    this.Scene.add(this.Layers.Object3D);
    this.Scene.add(this.Tools.Object3D);

    this.BoundingBoxHelper = new ConstructorIL.BoundingBoxHelper(this);

    this.Renderer.setSize(this.HTMLContainer.width(), this.HTMLContainer.height());

    this.ClipBoard = new ConstructorIL.ClipBoard(this);

    this.HistoryRecord = new ConstructorIL.HistoryRecord(this);
    //Luces
    this.AmbientLight = new THREE.AmbientLight(0x909090);
    this.Scene.add(this.AmbientLight);

    this.Clock = new THREE.Clock();
    // this.PointLight = new THREE.PointLight(0xAAAAAA, 2, 2600);
    // this.PointLight.position.set(0, 0, 600);
    // this.Scene.add(this.PointLight);

    this.DirectionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    this.DirectionalLight.position.set( -2000, -1000, 1500 );
    this.Scene.add( this.DirectionalLight );

    /*       Tools       */
        this.cutByPlane=false;




    document.addEventListener('mousedown', function(event) {
        window.lastDownTarget = event.target;
    }, false);
    window.addEventListener("resize", ConstructorIL.Events.onResize(this), false);
    document.addEventListener('keydown', ConstructorIL.Events.onKeyDown(this), false);
    this.domElement.addEventListener('mouseup', ConstructorIL.Events.onMouseUp(this), false);
    this.domElement.addEventListener('mousedown', ConstructorIL.Events.onMouseDown(this), false);
    this.domElement.addEventListener('mousemove', ConstructorIL.Events.onMouseMove(this), false);
    this.domElement.addEventListener('dragover', function(event){event.preventDefault();}, false);
    this.domElement.addEventListener('drop', ConstructorIL.Events.onDrop(this), false);
    //this.domElement.ondrop=ConstructorIL.Events.onDrop(this);


    //======TESTS=======

    this.HTMLContainer.append(this.Renderer.domElement);
    this.Render();
    //==================
}

ConstructorIL.Viewport.prototype = {

    updateUniforms:function(){

        ConstructorIL.Shaders.Uniforms.lava2.time.value =this.Clock.getElapsedTime()*.01;
        ConstructorIL.Shaders.Uniforms.lava2.needsUpdate=true;
    },

    importModel:function(){
        $(this.FileInput).click();
    },

    importImage:function(){
        $(this.ImageInput).click();
    },

    toggleSky: function() {
        if (this.Sky.Geometry instanceof THREE.SphereGeometry) {
            this.Scene.remove(this.Sky.Entity);
            this.Sky = new ConstructorIL.SkyBox()

        } else {
            this.Scene.remove(this.Sky.Entity);
            this.Sky = new ConstructorIL.SkySphere();
        }
        this.Scene.add(this.Sky.Entity);
    },

    reset: function() {
        this.Scene.remove(this.Layers.Object3D);
        this.Layers = new ConstructorIL.Layer("LayerList", this);
        //this.Layers.addLayer(new ConstructorIL.Layer("Default", this));
        this.Scene.add(this.Layers.Object3D);
        this.ClipBoard = new ConstructorIL.ClipBoard(this);
        this.HistoryRecord = new ConstructorIL.HistoryRecord(this);
        this.clearSelection();
    },

    add: function(object, layerID) {
        if (object == undefined) {
            console.warn("Attempting to add an undefined object");
            return;
        }
        if(layerID==undefined){
            this.Layers.add(object);
        }else{
            if(this.Layers.hasOwnProperty(layerID)){
                this.Layers[layerID].add(object);
            }else{
                console.warn("Uknown layer:"+layerID);
            }

        }

    },

    remove: function(object, layer) {

        if (object == undefined) {
            console.warn("Attempting to remove an undefined object");
            return;
        }
        if (layer == undefined) {
            for (layer in this.Layers) {
                if (this.Layers.hasOwnProperty(layer)) {
                    this.Layers[layer].remove(object);
                }
            }
            this.Layers.remove(object);
        } else if (this.Layers.hasOwnProperty(layer)) {
            this.Layers[layer].remove(object);
        } else {
            console.warn("Uknown layer:" + layer);
        }
        viewport.BoundingBoxHelper.update();
    },

    Render: function() {
        this.TransformControls.update();
        this.updateUniforms();
        //this.NavigationCube.update();
        requestAnimationFrame(this.Render.bind(this));
        this.Renderer.setClearColor(this.BackgroundColor, 1);

        if(this.drawCentroid)
            this.drawVerticesAndCenter(this.drawCentroid);
        //console.log("corriendo: "+this.Clock.getElapsedTime());
        this.Scene.updateMatrixWorld();
        this.Renderer.render(this.Scene, this.Camera);
    },

    drawVerticesAndCenter: function(activado) 
    {   
        if(activado)
        {
            var entidades = this.Layers.getEntities();
            this.Centroid.clear();
            for(var i=0;i<entidades.length;i++)
            {
                entidades[i].Wireframe=true;                
                var centro=ConstructorIL.Utils.getCentroid(entidades[i]);
                var material = new THREE.SpriteMaterial({
                    color: 0xff0000
                });
                var sprite = new THREE.Sprite(material);
                sprite.position.copy(centro);
                this.Centroid.add(sprite);
            }
        }
        else
        {
            this.Centroid.clear();
            var entidades = this.Layers.getEntities();
            for(var i=0;i<entidades.length;i++)
            {
                entidades[i].Wireframe=false;
            }
        }
    },

    getSelectedEntities: function() {
        var entities = this.Layers.getEntities();
        var entity;
        var selectedEntities = [];
        for (var entityIndex in entities) {
            entity = entities[entityIndex];
            if (entity instanceof THREE.Mesh && entity.Selected == true) {
                selectedEntities.push(entity);
            }
        }
        return selectedEntities;
    },

    clearSelection: function() {
        var entities = this.getSelectedEntities();
        for (var entity in entities) {
            entities[entity].Selected = false;
        }
        this.updatePropertiesControl(viewport.getSelectedEntities());
        this.updateTransformControls();
        this.TransformControls.detach('meh');
    },

    snapToGrid: function(object) {
        var box = new THREE.Box3();
        if (object == undefined) {
            var entities = this.getSelectedEntities();
            var entity;
            for (var entityIndex in entities) {
                entity = entities[entityIndex];
                box.setFromObject(entity);
                entity.position.z -= box.min.z;
            }
        } else {
            box.setFromObject(object);
            object.position.z -= box.min.z;
        }
        this.BoundingBoxHelper.update();
    },

    changeView: function(viewIndex) {
        var viewVector;
        if (viewIndex == 0) {
            return;
        }

        var newRot = new THREE.Vector3(0, 0, 0);

        if (viewIndex == 1) { //frontal
            viewVector = new THREE.Vector3(0, -150, 0);
        } else if (viewIndex == 2) { //posterior
            viewVector = new THREE.Vector3(0, 150, 0);
        } else if (viewIndex == 3) { //izquiera 
            viewVector = new THREE.Vector3(-150, 0, 0);
        } else if (viewIndex == 4) { //Derecha
            viewVector = new THREE.Vector3(150, 0, 0);
        } else if (viewIndex == 5) { //Superior
            viewVector = new THREE.Vector3(0, 0, 150);
        } else if (viewIndex == 6) { //Inferior
            viewVector = new THREE.Vector3(0, 0, -150);
        } else if (viewIndex == 7) { //Isometrico
            viewVector = new THREE.Vector3(150, -150, 150);
        }
        this.Camera.position.copy(viewVector);
        //camera.up =  new THREE.Vector3( 0, 1, 0 )
        this.Camera.lookAt(new THREE.Vector3(0, 0, 0));
        //controls.center = new THREE.Vector3( 0, 0, 0 );
        this.Controls.position0 = viewVector;
        this.Controls.target = new THREE.Vector3(0, 0, 0);
        //this.Camera.rotation = newRot;
        //controls = new THREE.OrbitControls( camera, renderer.domElement );
        //camera.update();
        //controls.rotateUp();
        this.Controls.update();
    },

    addEventListener: function(target, evt, bool) {
        this.domElement.addEventListener(target, evt, bool);
    },

    /*Deprecated Metodhs */
    getEntities: function() {
        //return this.Layers.Object3D.getDescendants();
        //var entities=[];
        console.warn('Viewport.getEntities is Deprecated, use Layer.getEntities() instead');
        return this.Layers.getEntities();
    },

    addEntity: function(entity) {
        console.warn("viewport.addEntity is deprecated, use viewport.add instead");
        viewport.add(entity);
    },

    deleteEntity: function(entity) {
        console.warn("viewport.deleteEntity is deprecated, use viewport.remove instead");
        viewport.remove(entity);
    },

    addControlEntity: function(entity) {
        console.warn("viewport.addControlEntity is deprecated, use viewport.Scene.add instead");
        this.Scene.add(entity);
    },

    deleteControlEntity: function(entity) {
        console.warn("viewport.deleteControlEntity is deprecated, use viewport.Scene.remove instead");
        this.Scene.remove(entity);
    },
}

ConstructorIL.GeometryUtils = {
    computeUvs: function(geometry) {
        geometry.computeBoundingBox();
        var max = geometry.boundingBox.max;
        var min = geometry.boundingBox.min;
        var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
        var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
        geometry.faceVertexUvs[0] = [];
        var i;
        for (i = 0; i < geometry.faces.length; i++) {

            var v1 = geometry.vertices[geometry.faces[i].a],
            v2 = geometry.vertices[geometry.faces[i].b],
            v3 = geometry.vertices[geometry.faces[i].c];
            geometry.faceVertexUvs[0].push(
                [
                new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
                new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
                new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
                ]);

        }
        geometry.uvsNeedUpdate = true;
    }
}

ConstructorIL.Utils = {
    arrayBufferToString:function (buf) {
        //return String.fromCharCode.apply(null, new Uint8Array(buf));
        var str = "";
        var ab = new Uint8Array(buf);
        var abLen = ab.length;
        var CHUNK_SIZE = Math.pow(2, 16);
        var offset, len, subab;
        for (offset = 0; offset < abLen; offset += CHUNK_SIZE) {
          len = Math.min(CHUNK_SIZE, abLen-offset);
          subab = ab.subarray(offset, offset+len);
          str += String.fromCharCode.apply(null, subab);
      }
      return str;
  },

  stringToArrayBuffer:function(str) {
    var stringBytes=str.split(',');
    var byteValues=[];
    str='';
    for(var i=0;i<stringBytes.length;i++){
            //byteValues.push(parseInt(stringBytes[i]));
            str+=String.fromCharCode(parseInt(stringBytes[i]));
        }
        var buf = new ArrayBuffer(str.length); // 2 bytes for each char
        var bufView = new Uint8Array(buf);
        for (var i=0, strLen=str.length; i<strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    },

    getCentroid :function(object){
        object.geometry.computeBoundingBox();
        var boundingBox = object.geometry.boundingBox;
        var position = new THREE.Vector3();
        position.subVectors( boundingBox.max, boundingBox.min );
        position.multiplyScalar( 0.5 );
        position.add( boundingBox.min );
        position.applyMatrix4( object.matrixWorld );
        return position;
    },

    fixWindingOrder: function(object) {

        var doubleSideClone = new ConstructorIL.Mesh(object.geometry, new THREE.MeshBasicMaterial({
            color: 0xFF0000,
            side: THREE.DoubleSide
        }));
        var faceIndex = Math.floor((Math.random() * object.geometry.faces.length-1) + 1);
        //var faceIndex2 = Math.floor((Math.random() * object.geometry.faces.length) + 1);
        var facet = object.geometry.faces[faceIndex];
        //var facet2 = object.geometry.faces[faceIndex2];

        

        var to = new THREE.Vector3();
        to.copy(object.geometry.vertices[facet.a]);
        var from = new THREE.Vector3(0, 0, 3000);


        var raycaster = new THREE.Raycaster(from, to.sub(from).normalize());
        var intersected = raycaster.intersectObject(object, true);
        var intersectedDoubleSide = raycaster.intersectObject(doubleSideClone, true);

        if (intersectedDoubleSide.length > 0) {            
            /*if(intersected.length<1){
                ConstructorIL.Utils.flipWindingOrder(object.geometry);
                object.geometry.computeFaceNormals();
                object.geometry.computeVertexNormals();
                console.warn("Flipping Mesh");
            }else*/ if (intersected[0].faceIndex != intersectedDoubleSide[0].faceIndex) {
                ConstructorIL.Utils.flipWindingOrder(object.geometry);
                object.geometry.computeFaceNormals();
                object.geometry.computeVertexNormals();
                console.warn("Flipping Mesh");
            } else {
                console.warn("GOOD");
            }

        } else {
            console.warn("coudln't intersect object:" + object.name );

        }

    },

    getEdges: function(geometry) {
        var edges = [];
        for (var face in geometry.faces) {
            var edge = {

            };

        }
    },

    flipWindingOrder: function(geometry) {
        var temp;
        for (var face in geometry.faces) {
            temp = geometry.faces[face].a;
            geometry.faces[face].a = geometry.faces[face].c;
            geometry.faces[face].c = temp;
        }
    },

    createSpriteLabel: function(text) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var size = 256; // CHANGED
        //canvas.width = size*2;
        //canvas.height = size;
        context.font = '100px Arial';

        //context.fillStyle = '#ff0000'; // CHANGED
        context.textAlign = 'left';

        context.fillText(text, 150, 100, 150);

        var amap = new THREE.Texture(canvas);
        amap.needsUpdate = true;

        var mat = new THREE.SpriteMaterial({
            map: amap,
            transparent: false,
            useScreenCoordinates: false,
            color: 0xffffff // CHANGED
        });

        var sp = new THREE.Sprite(mat);
        sp.scale.set(30, 5, 1); // CHANGED
        return sp;
    },


    cloneObject3D: function(object, recursive) {

        if (object === undefined) object = new THREE.Object3D();
        if (recursive === undefined) recursive = true;

        object.name = this.name;

        object.up.copy(this.up);

        object.position.copy(this.position);
        object.quaternion.copy(this.quaternion);
        object.scale.copy(this.scale);

        object.renderDepth = this.renderDepth;

        object.rotationAutoUpdate = this.rotationAutoUpdate;

        object.matrix.copy(this.matrix);
        object.matrixWorld.copy(this.matrixWorld);

        object.matrixAutoUpdate = this.matrixAutoUpdate;
        object.matrixWorldNeedsUpdate = this.matrixWorldNeedsUpdate;

        object.visible = this.visible;

        object.castShadow = this.castShadow;
        object.receiveShadow = this.receiveShadow;

        object.frustumCulled = this.frustumCulled;

        object.userData = JSON.parse(JSON.stringify(this.userData));

        if (recursive === true) {

            for (var i = 0; i < this.children.length; i++) {

                var child = this.children[i];
                object.add(child.clone());

            }

        }

        return object;

    },

    degToRad: function(value) {
        return value * Math.PI / 180;
    },

    radToDeg: function(value) {
        return value * 180 / Math.PI;
    },
}

ConstructorIL.Tools = {

    createText: function(text, font, style, weight) {
        if(weight==undefined)
            weight="normal";
        if(style==undefined)
            style="normal";
        try{
            var textGeom = new THREE.TextGeometry(text, {
                size: 30,
                height: 4,
                font: font,
                weight: weight,
                style: style
            });
        }catch(err){
            var textGeom = new THREE.TextGeometry(text, {
                size: 30,
                height: 4,
                font: font,
                weight: "normal",
                style: "normal"
            });
        }

        var textMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0f00,
            ambient: 0xff0f00,
            specular: 0x111111,
            shininess: 200,
            shading: THREE.FlatShading
        });
        var textMesh = new ConstructorIL.Mesh(textGeom, textMaterial);
        return textMesh;
    },

    togglePointShapeSpline: function(presionado) {
        pointShape = presionado;
        pointShapeCurved = presionado;
        if (pointShape) {
            viewport.clearSelection();
            $("#pointShapeControls").show("200");
            viewport.Tools.addEntity(plane);
        } else {
            $("#pointShapeControls").hide("200");
            viewport.Tools.remove(plane);
            points = [];
            viewport.Tools.clear();
        }
    },

    togglePointShape: function(presionado) {
        pointShape = presionado;
        if (pointShape) {
            viewport.clearSelection();
            $("#pointShapeControls").show("200");
            viewport.Tools.addEntity(plane);
        } else {
            $("#pointShapeControls").hide("200");
            viewport.Tools.remove(plane);
            points = [];
            viewport.Tools.clear();
        }
    },

    toggleRevolution: function(presionado) {
        pointShape = presionado;
        revolution = presionado;
        if (pointShape) {
            $("#pointShapeControls").show("200");
            viewport.Tools.addEntity(plane);
        } else {
            $("#pointShapeControls").hide("200");
            viewport.Tools.remove(plane);
            points = [];
            viewport.Tools.clear();
            pointShapeEdit = false;
        }
        if (revolution) {
            viewport.clearSelection();
            var material = new THREE.LineBasicMaterial({
                color: 0xff0000
            });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(0, 80, 0));
            geometry.vertices.push(new THREE.Vector3(0, -80, 0));
            var line = new THREE.Line(geometry, material);
            viewport.Tools.addEntity(line);
        }
    },

    toggleRevolutionRounded: function(presionado) {
        pointShape = presionado;
        revolution = presionado;
        revolutionRounded = presionado;
        pointShapeCurved = presionado;
        if (pointShape) {
            $("#pointShapeControls").show("0");
            viewport.Tools.addEntity(plane);
        } else {
            $("#pointShapeControls").hide("0");
            viewport.Tools.remove(plane);
            points = [];
            viewport.Tools.clear();
            pointShapeEdit = false;
        }
        if (revolution) {
            viewport.clearSelection();
            var material = new THREE.LineBasicMaterial({
                color: 0xff0000
            });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(0, 80, 0));
            geometry.vertices.push(new THREE.Vector3(0, -80, 0));
            var line = new THREE.Line(geometry, material);
            viewport.Tools.addEntity(line);
        }
    },

    togglePointShapeEditionAdd: function() {
        pointShapeEdit = !pointShapeEdit;
        viewport.Tools.remove(lineaTemporal);
        lineaTemporal = null;
        var material = new THREE.LineBasicMaterial({
            color: 0xff0000
        });
        var lineGeometry = new THREE.Geometry();
        if (!pointShapeCurved) {
            for (var i = 0; i < points.length; i++) {
                lineGeometry.vertices.push(points[i]);
            }
        } else {
            var line = new THREE.SplineCurve3(points);
            var splinePoints = line.getPoints(100);
            for (var i = 0; i < splinePoints.length; i++) {
                lineGeometry.vertices.push(splinePoints[i]);
            }
        }
        if (revolution) {
            if (revolucionTemporal != null) {
                viewport.Tools.remove(revolucionTemporal);
            }
            if (pointShapeEdit) {
                for (var i = 0; i < points.length; i++) {
                    points[i].z = points[i].y;
                    points[i].y = 0;
                }
                points.push(points[0].clone());
                if (revolucionTemporal != null)
                    viewport.Tools.remove(revolucionTemporal);
                var mat = new THREE.MeshPhongMaterial({
                    transparent: true,
                    opacity: .5,
                    color: 0x00FF00,
                    ambient: 0x00FF00,
                    specular: 0x111111,
                    shininess: 200,
                    shading: THREE.FlatShading,
                    side: THREE.DoubleSide
                });
                var geometry;
                if (revolutionRounded) {
                    var line = new THREE.SplineCurve3(points);
                    var points2 = line.getSpacedPoints(100);
                    geometry = new THREE.LatheGeometry(points2, 40);
                } else {
                    geometry = new THREE.LatheGeometry(points, 40);

                }
                var rotMatrix = new THREE.Matrix4();
                rotMatrix.makeRotationX(-1.57079633);
                geometry.applyMatrix(rotMatrix);
                geometry.computeFaceNormals();
                revolucionTemporal = new ConstructorIL.Mesh(geometry, mat)
                viewport.Tools.add(revolucionTemporal);
                for (var i = 0; i < points.length; i++) {
                    points[i].y = points[i].z;
                    points[i].z = 0;
                }
                points.pop();
            }
        }
        //geometry.vertices.push(intersects[0].point);
        lineaTemporal = new THREE.Line(lineGeometry, material);
        viewport.Tools.addEntity(lineaTemporal);
        /*if(lineaTemporal!=null)
        viewport.Tools.remove( lineaTemporal );*/
    },

    createPointShape: function(meshcolor) {
        if (points.length > 2) {
            /*if(!revolution)
				{
					for(var i=0;i<points.length;i++)
		    		{
		        		points[i].y=points[i].z;
						points[i].z=0;
					}
				}*/
                points.push(points[0].clone());
                var puntos = new THREE.Shape(points);
                if (!revolution) {
                //ConstructorIL.Events.addShape( puntos, extrudeSettings, 0xffaa00, 0, 0, 0, ConstructorIL.Utils.degToRad(90), 0, 0, 1 );
                //addShape:function( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {
                    if (!pointShapeCurved) {
                        var geometry = new THREE.ExtrudeGeometry(puntos, {
                            amount: 5,
                            steps: 1,
                            bevelSegments: 0,
                            bevelSize: 0,
                            bevelThickness: 0
                        });


                        var mesh = new ConstructorIL.Mesh(geometry,
                            new THREE.MeshPhongMaterial({
                                color: meshcolor,
                                ambient: meshcolor,
                                specular: 0x111111,
                                shininess: 200,
                                shading: THREE.FlatShading
                                /*, 
                                side:THREE.DoubleSide*/
                            }));

                    //THREE.GeometryUtils.center( mesh.geometry );
                    viewport.addEntity(mesh);
                    var pos=ConstructorIL.Utils.getCentroid(mesh);
                    THREE.GeometryUtils.center( mesh.geometry );
                    mesh.position.copy(pos);
                } else {
                    var line = new THREE.SplineCurve(

                        points
                        );
                    var shape = new THREE.Shape(line.getSpacedPoints(100));
                    geometry = new THREE.ExtrudeGeometry(shape, {
                        amount: 5,
                        steps: 1,
                        bevelSegments: 0,
                        bevelSize: 0,
                        bevelThickness: 0
                    });
                    var mesh1 = new ConstructorIL.Mesh(geometry, new THREE.MeshPhongMaterial({
                        color: meshcolor,
                        ambient: meshcolor,
                        specular: 0x111111,
                        shininess: 200,
                        shading: THREE.FlatShading
                            /*, 
                            side:THREE.DoubleSide*/
                        }));
                    var pos=ConstructorIL.Utils.getCentroid(mesh1);
                    THREE.GeometryUtils.center( mesh1.geometry );
                    mesh1.position.copy(pos);
                    viewport.addEntity(mesh1);
                }
            } else {
                for (var i = 0; i < points.length; i++) {
                    points[i].z = points[i].y;
                    points[i].y = 0;
                }
                //40 es el numero de segmentos añadir control
                var mesh;
                var g;
                var mat = new THREE.MeshPhongMaterial({
                    transparent: true,
                    opacity: 1,
                    color: 0x00FF00,
                    ambient: 0x00FF00,
                    specular: 0x111111,
                    shininess: 200,
                    shading: THREE.FlatShading

                });
                if (revolutionRounded) {
                    var line = new THREE.SplineCurve3(points);
                    var points2 = line.getSpacedPoints(100);
                    g = new THREE.LatheGeometry(points2, 40);
                } else {
                    g = new THREE.LatheGeometry(points, 40);
                }
                //mesh.rotation.set( ConstructorIL.Utils.degToRad(-90), 0, 0 );
                var rotMatrix = new THREE.Matrix4();
                rotMatrix.makeRotationX(-1.57079633);
                g.applyMatrix(rotMatrix);
                g.computeFaceNormals();
                
                var mesh = new ConstructorIL.Mesh(g, mat);
                var pos=ConstructorIL.Utils.getCentroid(mesh);
                THREE.GeometryUtils.center( mesh.geometry );
                mesh.position.copy(pos);
                viewport.addEntity(mesh);
                ConstructorIL.Utils.fixWindingOrder(mesh);
            }

            points = [];
            viewport.Tools.clear();
            pointShapeEdit = false;
        } else
        alert("Para construir una geometria se necesitan al menos 3 puntos");
    },

    toggleMeasureByPoint: function(presionado) {
        measureByPoint = presionado;
        if (measureByPoint) {
            viewport.Tools.addEntity(plane);
            viewport.clearSelection();
        } else {
            viewport.Tools.remove(plane);
            points = [];
            viewport.Tools.clear();
        }
    }
}

var excluye = false;
var points = [];
var pointShape = false;
var pointShapeCurved = false;
var revolution = false;
var revolutionRounded = false;
var pointShapeEdit = false;
var plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        opacity: 0.25,
        transparent: true,
        wireframe: true
            /*, 
            side:THREE.DoubleSide*/
        }));
plane.visible = false;
//plane.rotation.x=ConstructorIL.Utils.degToRad(90);
plane.updateMatrixWorld();
var spriteSeleccionado = null;
var lines = [];
var lineaTemporal = null;
var revolucionTemporal = null;
var measureByPoint = false;
var spriteyTemporal = null;

ConstructorIL.Events = {
    onDrop:function(viewport){
        return function(event){
            event.preventDefault();

            var data;
            if((data=event.dataTransfer.getData("mesh"))!=""&&data!=undefined){
                var offset = viewport.HTMLContainer.offset();
                var vector = new THREE.Vector3(
                    ((event.clientX - offset.left) / viewport.HTMLContainer.width()) * 2 - 1, -((event.clientY - offset.top) / viewport.HTMLContainer.height()) * 2 + 1,
                    0.5);
                
                viewport.Projector.unprojectVector(vector, viewport.Camera);
                var raycaster = new THREE.Raycaster(viewport.Camera.position, vector.sub(viewport.Camera.position).normalize());
                var intersects = raycaster.intersectObject(plane, false);


                var position=new THREE.Vector3();
                if (intersects.length > 0) {
                    position.copy(intersects[0].point)
                }
                var mesh;
                switch(data){
                    case "box":
                    mesh=ConstructorIL.Primitives.CreateBox(5,5,5,0x4DC2EA);
                    break;
                    case "cylinder":
                    mesh=ConstructorIL.Primitives.CreateCylinder(5,5,10,0x4DC2EA);
                    break;
                    case "sphere":
                    mesh=ConstructorIL.Primitives.CreateSphere(5,0x4DC2EA);
                    break;
                    case "torus":
                    mesh=ConstructorIL.Primitives.CreateTorus(5,2,0x4DC2EA);
                    break;
                    case "cone":
                        mesh=ConstructorIL.Primitives.CreatePyramid(5,20,10,0x4DC2EA);
                    break;
                    case "pyramid":
                    mesh=ConstructorIL.Primitives.CreatePyramid(5,4,5,0x4DC2EA);
                    break;
                }
                mesh.position.copy(position);
                viewport.snapToGrid(mesh);
                viewport.HistoryRecord.do("Object: "+mesh.name+"Added to the Default layer");
                viewport.add(mesh);
            }

            if(event.dataTransfer.files.length>0){
                var fileType;
                var file;
                for (var fileIndex = 0; fileIndex < event.dataTransfer.files.length; fileIndex++) {
                    file = event.dataTransfer.files[fileIndex];
                    fileType = file.name.split('.').pop().toLowerCase();
                    switch (fileType) {
                        case 'stl':
                        ConstructorIL.File.loadSTL(file, viewport, 0xEE8136);
                        break;
                        case 'cil':
                        ConstructorIL.File.loadCIL(file, viewport, 0xEE8136);
                        break;
                        case 'obj':
                        ConstructorIL.File.loadOBJ(file, viewport, 0xEE8136);
                        break;
                    }
                }
            }

            if(event.dataTransfer.items.length>0||event.dataTransfer.mozItemCount>0){
                //var item;
                var data=event.dataTransfer.getData("colibri3d");
                var url=data.split(',')
                //var url="http://www.colibri3d.com/admin/3dusr/stl/NTIzNQ==ZGxkLnN0bA==.stl";
                for(var i=0;i<url.length;i++){
                    ConstructorIL.File.loadSTLfromURI("http://www.colibri3d.com/admin/3dusr/stl/"+url[i],viewport,0xEE8136);
                }
            }
        }
    },

    onResize: function(viewport) {
        return function(event) {
            viewport.Camera.aspect = viewport.HTMLContainer.width() / viewport.HTMLContainer.height();
            viewport.Camera.updateProjectionMatrix();
            viewport.Renderer.setSize(viewport.HTMLContainer.width(), viewport.HTMLContainer.height());
        }
    },

    onMouseDown: function(viewport) {
        return function(event) {
            if (event.button == 0) {
                event.preventDefault();
                var offset = viewport.HTMLContainer.offset();
                var vector = new THREE.Vector3(
                    ((event.clientX - offset.left) / viewport.HTMLContainer.width()) * 2 - 1, -((event.clientY - offset.top) / viewport.HTMLContainer.height()) * 2 + 1,
                    0.5);
                viewport.Projector.unprojectVector(vector, viewport.Camera);
                var raycaster = new THREE.Raycaster(viewport.Camera.position, vector.sub(viewport.Camera.position).normalize());
                if (pointShape && !pointShapeEdit) {
                    //inicio de punto a punto	

                    var intersects = raycaster.intersectObject(plane, false);
                    var geometria = new THREE.SphereGeometry(1.2, 5, 5);
                    var material = new THREE.MeshBasicMaterial({
                        color: 0x000000
                    });
                    var sprite = new THREE.Mesh(geometria, material);
                    if (intersects.length > 0) {
                        sprite.position.copy(intersects[0].point);
                        sprite.punto = points.length;
                        viewport.Tools.addEntity(sprite);
                        points.push(intersects[0].point);
                    }

                } else if (pointShape && pointShapeEdit) {

                    var intersects = raycaster.intersectObject(viewport.Tools.Object3D, true);
                    if (intersects.length > 0) {
                        for (var i = 0; i < intersects.length; i++) {
                            if (intersects[i].object.geometry instanceof THREE.SphereGeometry) {
                                spriteSeleccionado = intersects[i].object;
                            } else if (intersects[i].object instanceof THREE.Line) {
                                lines.push(intersects[i].object);
                            }
                        }
                    }
                } else if (measureByPoint) {
                    var temp = viewport.getEntities();
                    temp.push(plane);
                    var intersects = raycaster.intersectObjects(temp, false);
                    if (intersects.length > 0) {
                        if (points.length == 0) {
                            points.push(intersects[0].point);
                        } else {
                            var material = new THREE.LineBasicMaterial({
                                color: 0xff0000
                            });
                            var geometry = new THREE.Geometry();
                            geometry.vertices.push(points[0]);
                            geometry.vertices.push(intersects[0].point);
                            var line = new THREE.Line(geometry, material);
                            viewport.Tools.addEntity(line);
                            var distancia = intersects[0].point.distanceTo(points[0]);
                            var distanciax = intersects[0].point.x - points[0].x;
                            var distanciay = intersects[0].point.y - points[0].y;
                            var distanciaz = intersects[0].point.z - points[0].z;
                            //var spritey = ConstructorIL.Utils.createSpriteLabel( "Dist "+(Math.round(distancia*100)/100).toFixed(2)+" X= "+(Math.round(distanciax*100)/100).toFixed(2)+" Y= "+(Math.round(distanciay*100)/100).toFixed(2)+" Z= "+(Math.round(distanciaz*100)/100).toFixed(2)+"mm" );
                            var spritey = ConstructorIL.Utils.createSpriteLabel((Math.round(distancia * 100) / 100).toFixed(2) + "mm");
                            spritey.position.copy(intersects[0].point);
                            spritey.position.y += 3;
                            viewport.Tools.addEntity(spritey);
                            viewport.Tools.remove(spriteyTemporal);
                            points = [];
                        }
                    }

                }
            }
        }
    },

    onMouseMove: function(viewport) {
        return function(event) {
            if (pointShape) {
                if (event.button == 0) {
                    event.preventDefault();
                    var offset = viewport.HTMLContainer.offset();
                    var vector = new THREE.Vector3(
                        ((event.clientX - offset.left) / viewport.HTMLContainer.width()) * 2 - 1, -((event.clientY - offset.top) / viewport.HTMLContainer.height()) * 2 + 1,
                        0.5);
                    var raycaster;
                    viewport.Projector.unprojectVector(vector, viewport.Camera);
                    if (spriteSeleccionado != null) {
                        raycaster = new THREE.Raycaster(
                            viewport.Camera.position,
                            vector.sub(viewport.Camera.position).normalize()
                            );
                        var intersects = raycaster.intersectObject(plane, false);
                        spriteSeleccionado.position.copy(intersects[0].point);
                        points[spriteSeleccionado.punto].copy(intersects[0].point);
                        viewport.Tools.remove(lineaTemporal);
                        lineaTemporal = null;
                        var material = new THREE.LineBasicMaterial({
                            color: 0xff0000
                        });
                        var geometry = new THREE.Geometry();

                        if (!pointShapeCurved) {
                            for (var i = 0; i < points.length; i++) {
                                geometry.vertices.push(points[i]);
                            }
                        } else {
                            var line = new THREE.SplineCurve3(points);
                            var splinePoints = line.getPoints(100);
                            for (var i = 0; i < splinePoints.length; i++) {
                                geometry.vertices.push(splinePoints[i]);
                            }
                        }

                        lineaTemporal = new THREE.Line(geometry, material);
                        viewport.Tools.addEntity(lineaTemporal);
                        if (revolution && pointShapeEdit) {
                            for (var i = 0; i < points.length; i++) {
                                points[i].z = points[i].y;
                                points[i].y = 0;
                            }

                            points.push(points[0].clone());

                            if (revolucionTemporal != null)
                                viewport.Tools.remove(revolucionTemporal);

                            var mat = new THREE.MeshPhongMaterial({
                                transparent: true,
                                opacity: .5,
                                color: 0x00FF00,
                                ambient: 0x00FF00,
                                specular: 0x111111,
                                shininess: 200,
                                shading: THREE.FlatShading,
                                side:THREE.DoubleSide
                            });
                            var g;
                            if (revolutionRounded) {
                                var line = new THREE.SplineCurve3(points);
                                var points2 = line.getSpacedPoints(100);
                                g = new THREE.LatheGeometry(points2, 40);
                            } else {
                                g = new THREE.LatheGeometry(points, 40);
                            }
                            var rotMatrix = new THREE.Matrix4();
                            rotMatrix.makeRotationX(-1.57079633);
                            g.applyMatrix(rotMatrix);
                            g.computeFaceNormals();
                            revolucionTemporal = new ConstructorIL.Mesh(g, mat);
                            viewport.Tools.addEntity(revolucionTemporal);
                            for (var i = 0; i < points.length; i++) {
                                points[i].y = points[i].z;
                                points[i].z = 0;
                            }
                            points.pop();
                        }
                    }
                } /*else*/ if (/*event.button == 0 && */ !pointShapeEdit) {
                    //console.log("ELSE");
                    if (points.length > 0) {
                        event.preventDefault();
                        var offset = viewport.HTMLContainer.offset();
                        var vector = new THREE.Vector3(
                            ((event.clientX - offset.left) / viewport.HTMLContainer.width()) * 2 - 1, -((event.clientY - offset.top) / viewport.HTMLContainer.height()) * 2 + 1,
                            0.5);
                        var raycaster;
                        viewport.Projector.unprojectVector(vector, viewport.Camera);
                        var raycaster = new THREE.Raycaster(viewport.Camera.position, vector.sub(viewport.Camera.position).normalize());
                        var intersects = raycaster.intersectObject(plane, false);
                        if (intersects.length > 0) {
                            viewport.Tools.remove(lineaTemporal);
                            lineaTemporal = null;
                            var material = new THREE.LineBasicMaterial({
                                color: 0xff0000
                            });
                            var geometry;
                            points.push(intersects[0].point);
                            if (!pointShapeCurved) {
                                geometry = new THREE.Geometry();
                                for (var i = 0; i < points.length; i++) {
                                    geometry.vertices.push(points[i]);
                                }
                            } else {
                                var line = new THREE.SplineCurve3(points);
                                geometry = new THREE.Geometry();
                                var splinePoints = line.getPoints(100);
                                for (var i = 0; i < splinePoints.length; i++) {
                                    geometry.vertices.push(splinePoints[i]);
                                }
                            }
                            points.pop();
                            lineaTemporal = new THREE.Line(geometry, material);
                            viewport.Tools.addEntity(lineaTemporal);
                        }
                    }
                }
            } else if (measureByPoint) {
                var offset = viewport.HTMLContainer.offset();
                var vector = new THREE.Vector3(
                    ((event.clientX - offset.left) / viewport.HTMLContainer.width()) * 2 - 1, -((event.clientY - offset.top) / viewport.HTMLContainer.height()) * 2 + 1,
                    0.5);
                viewport.Projector.unprojectVector(vector, viewport.Camera);
                var raycaster = new THREE.Raycaster(viewport.Camera.position, vector.sub(viewport.Camera.position).normalize());
                var temp = viewport.getEntities();
                temp.push(plane);
                var intersects = raycaster.intersectObjects(temp, false);
                if (points.length > 0 && intersects.length > 0) {
                    viewport.Tools.remove(lineaTemporal);
                    viewport.Tools.remove(spriteyTemporal);
                    lineaTemporal = null;
                    var material = new THREE.LineBasicMaterial({
                        color: 0xff0000
                    });
                    var geometry = new THREE.Geometry();
                    geometry.vertices.push(points[0]);
                    geometry.vertices.push(intersects[0].point);
                    lineaTemporal = new THREE.Line(geometry, material);
                    viewport.Tools.addEntity(lineaTemporal);
                    var distancia = intersects[0].point.distanceTo(points[0]);
                    var distanciax = intersects[0].point.x - points[0].x;
                    var distanciay = intersects[0].point.y - points[0].y;
                    var distanciaz = intersects[0].point.z - points[0].z;
                    //spriteyTemporal = ConstructorIL.Utils.createSpriteLabel( "Dist "+(Math.round(distancia*100)/100).toFixed(2)+" X= "+(Math.round(distanciax*100)/100).toFixed(2)+" Y= "+(Math.round(distanciay*100)/100).toFixed(2)+" Z= "+(Math.round(distanciaz*100)/100).toFixed(2)+"mm" );
                    spriteyTemporal = ConstructorIL.Utils.createSpriteLabel((Math.round(distancia * 100) / 100).toFixed(2) + "mm");
                    spriteyTemporal.position.copy(intersects[0].point); //.set(-85,105,55);
                    spriteyTemporal.position.y += 3;
                    viewport.Tools.addEntity(spriteyTemporal);
                }
            } else if (event.button == 0) {
                viewport.BoundingBoxHelper.update();
                viewport.updatePropertiesControl(viewport.getSelectedEntities());
            }
        }
    },

    onMouseUp: function(viewport) {
        return function(event) {
            window.lastDownTarget = event.target;
            spriteSeleccionado = null;
            if (event.button == 0 && !viewport.cutByPlane) { //left-click
                event.preventDefault();
                if (!pointShape && !measureByPoint) { //prevent pointshape
                    var offset = viewport.HTMLContainer.offset();
                    var vector = new THREE.Vector3(
                        ((event.clientX - offset.left) / viewport.HTMLContainer.width()) * 2 - 1, -((event.clientY - offset.top) / viewport.HTMLContainer.height()) * 2 + 1,
                        0.5);
                    var raycaster;
                    viewport.Projector.unprojectVector(vector, viewport.Camera);
                    raycaster = new THREE.Raycaster(viewport.Camera.position, vector.sub(viewport.Camera.position).normalize());
                    var intersects = raycaster.intersectObjects(viewport.Layers.getEntities(), true);

                    if (!viewport.TransformControls.performedDrag) {
                        viewport.TransformControls.update();
                        if (intersects.length > 0) {

                            //Get the first intersected object
                            var selectedEntity = intersects[0].object;

                            //if that object is in selected state change it to de-selected
                            if (selectedEntity.Selected == true && event.ctrlKey) {
                                selectedEntity.Selected = false;
                            } else if(selectedEntity.selected!=true){
                                //Clear  selection if theres no Control Key pressed
                                if (!event.ctrlKey)
                                    viewport.clearSelection();
                                //Select the next Entity
                                selectedEntity.Selected = true;
                            }

                            var seleccionados = viewport.getSelectedEntities();
                            viewport.updatePropertiesControl(seleccionados);

                            if (seleccionados.length == 1) {                                
                                selectedEntity = seleccionados[0];
                                viewport.TransformControls.attach(selectedEntity);
                                viewport.Scene.add(viewport.TransformControls);
                                //$("#transformControls label").show(0);
                                $("#transformControls").show("200");

                            } else if(seleccionados.length>1){
                                viewport.TransformControls.detach('meh');
                                viewport.Scene.remove(viewport.TransformControls);
                                //$("#transformControls label").hide(0);
                                $("#snapToGridButton").show(0);
                                //$("#transformControls").hide("200");
                            }else{
                                viewport.TransformControls.detach('meh');
                                viewport.Scene.remove(viewport.TransformControls);
                                $("#transformControls").hide("200");
                            }
                        } else if (!event.ctrlKey) { //if no entity detected on the click .. remove the Transform Controls and Clear selection
                            viewport.clearSelection();
                            viewport.TransformControls.detach('meh');
                            viewport.Scene.remove(viewport.TransformControls);
                            $("#transformControls").hide("200");
                        }
                    } else {
                        viewport.TransformControls.performedDrag = false;
                    }
                    viewport.TransformControls.update();
                    viewport.BoundingBoxHelper.update();
                }
            }
        }
    },

    onKeyDown: function(viewport) {
        return function(event) {

            if (window.lastDownTarget === viewport.domElement) {
                if (event.ctrlKey) {
                    event.preventDefault();
                    switch (event.keyCode) {
                        case 65: //A
                        viewport.importModel();
                        break;
                        case 67: //C
                        viewport.ClipBoard.copy(viewport.getSelectedEntities());
                        break;
                        case 69://E
                        var entities=viewport.getSelectedEntities();
                        for(var entityIndex in entities){
                            entities[entityIndex].Selected=true;
                        }
                        break;
                        case 86: //V
                        viewport.ClipBoard.paste();
                        break;
                        case 88: //X
                        viewport.ClipBoard.cut(viewport.getSelectedEntities());
                        break;
                        case 78: //N
                        viewport.reset();
                        break;
                        // case 79: //O
                        //     viewport.importModel();
                        //     break;
                        case 80: //P
                        alert("Imprimir");
                        break;
                        case 90: //Z
                            //alert("Ctrl+Z");
                            viewport.HistoryRecord.unDo();
                            break;
                        case 89: //Y
                            //alert("Ctrl+Y");
                            viewport.HistoryRecord.reDo();
                            break;
                        }
                    } else {
                        switch (event.keyCode) {
                            case 27:

                            viewport.clearSelection();
                            viewport.Scene.remove(viewport.TransformControls);
                            $("#transformControls").hide("200");
                            break;
                        case 13: //enter

                        break;
                        case 46://Delete
                        var entities = viewport.getSelectedEntities();
                        for (var entity in entities) {
                            viewport.remove(entities[entity]);
                            viewport.TransformControls.detach();
                            viewport.TransformControls.update();
                            viewport.Scene.remove(viewport.TransformControls);
                            $("#transformControls").hide("200");
                        }
                        break;
                    }
                }
            }
            
        }
    }
}

ConstructorIL.Primitives = {
    CreateBox: function(x, y, z, meshcolor) {
        var geometry = new THREE.BoxGeometry(x, y, z)
        var rotMatrix = new THREE.Matrix4();
        rotMatrix.makeRotationX(1.57079633);
        geometry.applyMatrix(rotMatrix);
        geometry.computeFaceNormals();
        var mesh = new ConstructorIL.Mesh(geometry,
            new THREE.MeshPhongMaterial({
                color: meshcolor,
                ambient: meshcolor,
                specular: 0x111111,
                shininess: 200,
                shading: THREE.FlatShading
            })
             //ConstructorIL.Shaders.lava()

             );
        mesh.name = "Cubo";
        return mesh;
    },


    CreateCylinder: function(baseRadius, topRadius, height, meshcolor) {        
        var geometry = new THREE.CylinderGeometry(topRadius, baseRadius, height, 20, 1, false);
        var rotMatrix = new THREE.Matrix4();
        rotMatrix.makeRotationX(1.57079633);
        geometry.applyMatrix(rotMatrix);
        geometry.computeFaceNormals();
        var mesh = new ConstructorIL.Mesh(
            geometry,
            new THREE.MeshPhongMaterial({
                color: meshcolor,
                ambient: meshcolor,
                specular: 0x111111,
                shininess: 200
            }));
        mesh.name = "Cilindro";
        return mesh;
    },

    CreatePyramid: function(baseRadius, faces, height, meshcolor) {
        var geometry = new THREE.CylinderGeometry(0.01, baseRadius, height, faces, 2, false);
        var rotMatrix = new THREE.Matrix4();
        rotMatrix.makeRotationX(1.57079633);
        geometry.applyMatrix(rotMatrix);
        geometry.computeFaceNormals();
        var mesh = new ConstructorIL.Mesh(
            geometry,
            new THREE.MeshPhongMaterial({
                color: meshcolor,
                ambient: meshcolor,
                specular: 0x111111,
                shininess: 200,
                shading: THREE.FlatShading
            }));
        mesh.name = "Piramide";
        return mesh;

    },

    CreateSphere: function(radius, meshcolor) {

        var geometry = new THREE.SphereGeometry(radius, 20, 20);
        var rotMatrix = new THREE.Matrix4();
        rotMatrix.makeRotationX(1.57079633);
        geometry.applyMatrix(rotMatrix);
        geometry.computeFaceNormals();
        var mesh = new ConstructorIL.Mesh(
            geometry,
            new THREE.MeshPhongMaterial({
                color: meshcolor,
                ambient: meshcolor,
                specular: 0x111111,
                shininess: 200,
            })

            );
        mesh.name = "Esfera";
        return mesh;
    },

    CreateTorus: function(outerRadius, innerRadius, meshcolor) {

        //THREE.TorusGeometry( radius, tube, segmentsR, segmentsT, arc );
        var geometry = new THREE.TorusGeometry(outerRadius, innerRadius, 20, 40);
        var rotMatrix = new THREE.Matrix4();
        rotMatrix.makeRotationX(1.57079633);
        geometry.applyMatrix(rotMatrix);
        geometry.computeFaceNormals();
        var mesh = new ConstructorIL.Mesh(
            geometry,
            new THREE.MeshPhongMaterial({
                color: meshcolor,
                ambient: meshcolor,
                specular: 0x111111,
                shininess: 200,
                shading: THREE.FlatShading
            }));
        mesh.name = "Toroide";
        return mesh;
    },
}

ConstructorIL.CSG = {

    CutByPlane:function(plane,object){
        var boxSize=2600;
        var boxGeometry=new THREE.BoxGeometry(boxSize,boxSize,boxSize);
        var boxMaterial=new THREE.MeshBasicMaterial({color:0xFF0000, transparent:true, opacity:0.5});
        var box=new ConstructorIL.Mesh(boxGeometry,boxMaterial);
        plane.geometry.computeFaceNormals();
        viewport.TransformControls.detach(plane);

        box.rotation.copy(plane.rotation);
        box.position.copy(plane.position);

        var axis=new THREE.Vector3();
        axis.copy(plane.geometry.faces[0].normal).normalize();
        
        box.translateOnAxis(axis,boxSize/2);
        box.updateMatrix();

        var mesh=ConstructorIL.CSG.Difference(entities[0],box,0xEE8136);
        
        box.translateOnAxis(axis,-boxSize);
        box.updateMatrix();
        
        var mesh2=ConstructorIL.CSG.Difference(entities[0],box,0xEE8136);
        return [mesh1,mesh2]
    },

    //Union of A with B
    Union: function(A, B, meshcolor) {
        var geometry_A=A.geometry.clone();
        var geometry_B=B.geometry.clone();
        geometry_A.applyMatrix(A.matrix);
        geometry_B.applyMatrix(B.matrix);
        var bspA = new ThreeBSP(geometry_A);
        var bspB = new ThreeBSP(geometry_B);
        var mesh = bspA.union(bspB).toMesh(new THREE.MeshPhongMaterial({
            color: meshcolor,
            ambient: meshcolor,
            specular: 0x111111,
            shininess: 200,
            shading: THREE.FlatShading
        }));
        if(mesh.geometry.vertices.length>2){
            ConstructorIL.Utils.fixWindingOrder(mesh);
            //var pos=ConstructorIL.Utils.getCentroid(mesh);
            //THREE.GeometryUtils.center( mesh.geometry );
            //mesh.position.copy(pos);
            return new ConstructorIL.Mesh(mesh.geometry, mesh.material);
        }else{
            console.warn("Union: bad object geometry or too complex to apply the operation");
            return null;
        }
    },

    //Intersection of A on B
    Intersect: function(A, B, meshcolor) {
        var geometry_A=A.geometry.clone();
        var geometry_B=B.geometry.clone();
        geometry_A.applyMatrix(A.matrix);
        geometry_B.applyMatrix(B.matrix);
        var bspA = new ThreeBSP(geometry_A);
        var bspB = new ThreeBSP(geometry_B);
        var mesh = bspA.intersect(bspB).toMesh(new THREE.MeshPhongMaterial({
            color: meshcolor,
            ambient: meshcolor,
            specular: 0x111111,
            shininess: 200,
            shading: THREE.FlatShading
        }));
        if(mesh.geometry.vertices.length>2){
            ConstructorIL.Utils.fixWindingOrder(mesh);
            //var pos=ConstructorIL.Utils.getCentroid(mesh);
            //THREE.GeometryUtils.center( mesh.geometry );
            //mesh.position.copy(pos);
            return new ConstructorIL.Mesh(mesh.geometry, mesh.material);
        }else{
            console.warn("Intersect: bad object geometry or too complex to apply the operation");
            return null;
        }
    },

    //Difference of B from A (A without B)
    Difference: function(A, B, meshcolor) {
    	var geometry_A=A.geometry.clone();
    	var geometry_B=B.geometry.clone();
    	geometry_A.applyMatrix(A.matrix);
    	geometry_B.applyMatrix(B.matrix);
        var bspA = new ThreeBSP(geometry_A);
        var bspB = new ThreeBSP(geometry_B);
        var mesh = bspA.subtract(bspB).toMesh(new THREE.MeshPhongMaterial({
            color: meshcolor,
            ambient: meshcolor,
            specular: 0x111111,
            shininess: 200,
            shading: THREE.FlatShading
        }));
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
        //var pos=ConstructorIL.Utils.getCentroid(mesh);
        //THREE.GeometryUtils.center( mesh.geometry );
        //mesh.position.copy(pos);
       if(mesh.geometry.vertices.length>2){
            ConstructorIL.Utils.fixWindingOrder(mesh);
            //var pos=ConstructorIL.Utils.getCentroid(mesh);
            //THREE.GeometryUtils.center( mesh.geometry );
            //mesh.position.copy(pos);
            return new ConstructorIL.Mesh(mesh.geometry, mesh.material);
        }else{
            console.warn("Difference: bad object geometry or too complex to apply the operation");
            return null;
        }
    }
}

ConstructorIL.File = {

    saveSTL: function(fileName, object3D, asString) {
        var exporter = new THREE.STLExporter();
        var output = exporter.parse(object3D);
        if (exporter instanceof THREE.ObjectExporter) {
            output = JSON.stringify(output, null, '\t');
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        }
        if (asString) {
            return output;
        } else {

            var blob = new Blob([output], {
                type: 'text/plain'
            });
            saveAs(blob, fileName + ".stl");
        }
    },

    saveBinarySTL: function(fileName, object3D, asString) {
        var geometry;
        var face = [];
        var faceCount = 0;
        var matrixWorldNormal=new THREE.Matrix3();
        var tmpVertex_A=new THREE.Vector3();
        var tmpVertex_B=new THREE.Vector3();
        var tmpVertex_C=new THREE.Vector3();
        var tmpNormal=new THREE.Vector3();
        object3D.traverse(function(object) {
            if (object instanceof ConstructorIL.Mesh) {
                geometry = object.geometry;
                faceCount += geometry.faces.length;
                matrixWorldNormal.getNormalMatrix(object.matrixWorld);
                for (var faceIndex in geometry.faces) {
                    tmpNormal=new THREE.Vector3();
                    tmpNormal.copy(geometry.faces[faceIndex].normal).applyMatrix3(matrixWorldNormal).normalize();
                    // tmpVertex_A.copy( geometry.vertices[geometry.faces[faceIndex].a]).applyMatrix4(object.matrixWorld);
                    // tmpVertex_B.copy( geometry.vertices[geometry.faces[faceIndex].b]).applyMatrix4(object.matrixWorld);
                    // tmpVertex_C.copy( geometry.vertices[geometry.faces[faceIndex].c]).applyMatrix4(object.matrixWorld);
                    face.push({
                        normal_x: tmpNormal.x,
                        normal_y: tmpNormal.y,
                        normal_z: tmpNormal.z,
                        a: (new THREE.Vector3().copy(geometry.vertices[geometry.faces[faceIndex].a]).applyMatrix4(object.matrixWorld)),
                        b: (new THREE.Vector3().copy(geometry.vertices[geometry.faces[faceIndex].b]).applyMatrix4(object.matrixWorld)),
                        c: (new THREE.Vector3().copy(geometry.vertices[geometry.faces[faceIndex].c]).applyMatrix4(object.matrixWorld)),
                        byteCount: 0
                    });
                }
            }
        });

        var faceByteLenght = 50; //(3[x,y,z]*4[bytesPerFloat])*4[3vertices&normal]+2[AttByteCount]
        var arrayBuffferSize = 84 + faceByteLenght * faceCount;
        var arrayBuffer = new ArrayBuffer(arrayBuffferSize);
        var dataView = new DataView(arrayBuffer);;
        var offset = 80;


        dataView.setInt32(offset, faceCount, true);
        offset += 4;
        for (var faceIndex in face) {
            dataView.setFloat32(offset, face[faceIndex].normal_x, true);
            offset += 4;
            dataView.setFloat32(offset, face[faceIndex].normal_y, true);
            offset += 4;
            dataView.setFloat32(offset, face[faceIndex].normal_z, true);
            offset += 4;
            dataView.setFloat32(offset, face[faceIndex].a.x, true);
            offset += 4;
            dataView.setFloat32(offset, face[faceIndex].a.y, true);
            offset += 4;
            dataView.setFloat32(offset, face[faceIndex].a.z, true);
            offset += 4;
            dataView.setFloat32(offset, face[faceIndex].b.x, true);
            offset += 4;
            dataView.setFloat32(offset, face[faceIndex].b.y, true);
            offset += 4;
            dataView.setFloat32(offset, face[faceIndex].b.z, true);
            offset += 4;
            dataView.setFloat32(offset, face[faceIndex].c.x, true);
            offset += 4;
            dataView.setFloat32(offset, face[faceIndex].c.y, true);
            offset += 4;
            dataView.setFloat32(offset, face[faceIndex].c.z, true);
            offset += 4;
            dataView.setUint16(offset, 0);
            offset += 2;
        }

        if (asString) {
            return arrayBuffer;
        } else {
            var blob = new Blob([dataView], {
                type: 'application/octet-stream'
            });
            saveAs(blob, fileName + ".stl");
        }

    },

    loadSTLfromURI: function(URI, vport, meshcolor) {
        // $.get(URI, function(data) {
        //     var geometry = new THREE.STLLoader().parse(data);
        //     geometry.sourceType = "stl";
        //     //geometry.sourceFile = file.name;

        //     var material = new THREE.MeshPhongMaterial({
        //         color: meshcolor,
        //         ambient: meshcolor,
        //         specular: 0x111111,
        //         shininess: 200,
        //         shading: THREE.FlatShading
        //     });
        //     var mesh = new ConstructorIL.Mesh(geometry, material);
        //     ConstructorIL.GeometryUtils.computeUvs(mesh.geometry);
        //     mesh.geometry.computeLineDistances();
        //     //mesh.geometry.computeTangents();
        //     mesh.geometry.mergeVertices();
        //     mesh.geometry.computeVertexNormals();
        //     mesh.geometry.computeFaceNormals();
        //     ConstructorIL.GeometryUtils.computeUvs(mesh.geometry);

        //     //ConstructorIL.Utils.fixWindingOrder(mesh);
        //     vport.HistoryRecord.do("Object: "+mesh.name+" Loaded to the Default layer");
        //     viewport.snapToGrid(mesh);
        //     vport.add(mesh);
        //     var pos=ConstructorIL.Utils.getCentroid(mesh);
        //     THREE.GeometryUtils.center( mesh.geometry );
        //     mesh.position.copy(pos);
        // });

var request=ConstructorIL.Utils.createCORSRequest("GET",URI);
request.onload=function(){

}
request.send();

},

loadSTLFromArrayBuffer:function(string,vport){
    try{
        var geometry = new THREE.STLLoader().parse(string);
        geometry.sourceType = "stl";
        var material = new THREE.MeshPhongMaterial({
            color: 0xEE8136,
            ambient: 0xEE8136,
            specular: 0x111111,
            shininess: 200,
            shading: THREE.FlatShading
        });
        var mesh = new ConstructorIL.Mesh(geometry, material);
        ConstructorIL.GeometryUtils.computeUvs(mesh.geometry);
        mesh.geometry.computeLineDistances();
            //mesh.geometry.computeTangents();
            mesh.geometry.mergeVertices();
            mesh.geometry.computeVertexNormals();
            mesh.geometry.computeFaceNormals();
            ConstructorIL.GeometryUtils.computeUvs(mesh.geometry);
            
            ConstructorIL.Utils.fixWindingOrder(mesh);
            vport.HistoryRecord.do("Object: Loaded to the root layer");
            viewport.snapToGrid(mesh);
            vport.add(mesh);
            var pos=ConstructorIL.Utils.getCentroid(mesh);
            THREE.GeometryUtils.center( mesh.geometry );
            mesh.position.copy(pos);
        }catch(err)
        {
            alert(err.message+"\n"+"\nstring:\n\n"+string);
        }
    },

    loadSTL: function(file, vport, meshcolor, fromString) {

        function load(ev) {

            var contents = ev.target.result;

            var geometry = new THREE.STLLoader().parse(contents);
            geometry.sourceType = "stl";
            geometry.sourceFile = file.name;

            var material = new THREE.MeshPhongMaterial({
                color: meshcolor,
                ambient: meshcolor,
                specular: 0x111111,
                shininess: 200,
                shading: THREE.FlatShading
            });
            var mesh = new ConstructorIL.Mesh(geometry, material);
            mesh.name = file.name;
            ConstructorIL.GeometryUtils.computeUvs(mesh.geometry);
            mesh.geometry.computeLineDistances();
            //mesh.geometry.computeTangents();
            mesh.geometry.mergeVertices();
            mesh.geometry.computeVertexNormals();
            mesh.geometry.computeFaceNormals();
            ConstructorIL.GeometryUtils.computeUvs(mesh.geometry);
            
            ConstructorIL.Utils.fixWindingOrder(mesh);
            vport.HistoryRecord.do("Object: "+mesh.name+" Loaded to the root layer");
            viewport.snapToGrid(mesh);
            vport.add(mesh);
            if (THREE.REVISION < 68) {
                var pos=ConstructorIL.Utils.getCentroid(mesh);
                THREE.GeometryUtils.center( mesh.geometry );
                mesh.position.copy(pos);
            } else {
                //mesh.geometry.center();
                window.alert("version mas nueva que la 68");
            }
        };

        if (fromString) {
            var geometry = new THREE.STLLoader().parse(file);
            geometry.sourceType = "stl";
            geometry.sourceFile = file.name;

            var material = new THREE.MeshPhongMaterial({
                color: meshcolor,
                ambient: meshcolor,
                specular: 0x111111,
                shininess: 200,
                shading: THREE.FlatShading
            });
            //material.side=THREE.DoubleSide;
            THREE.GeometryUtils.center(geometry);
            mesh = new ConstructorIL.Mesh(geometry, material);
            mesh.name = file.name;
            ConstructorIL.Utils.fixWindingOrder(mesh);
            vport.HistoryRecord.do("Object: "+mesh.name+" Loaded to the root layer");
            vport.add(mesh);

        } else {
            var reader = new FileReader();
            var mesh;
            reader.onload = load;
            reader.readAsArrayBuffer(file);
        }
    },

    saveOBJ: function(fileName, scene, asString) {
        var exporter = new THREE.OBJExporter();
        var output = '';
        var untitled = 1;
        for (var i in scene.children) {
            if (scene.children[i] instanceof THREE.Mesh) {
                if (scene.children[i].name === 'undefined' || scene.children[i].name == "") {
                    output += 'o untitled' + untitled + '\n';
                    untitled++;
                } else {
                    output += 'o ' + scene.children[i].name + '\n';
                }
                output += exporter.parse(scene.children[i].geometry);
            }
        }
        //var output = exporter.parse( scene );
        //var output = exporter.parse( scene.children[4].geometry );
        if (exporter instanceof THREE.ObjectExporter) {
            output = JSON.stringify(output, null, '\t');
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        }

        if (asString) {
            return output;
        } else {
            var blob = new Blob([output], {
                type: 'text/plain'
            });
            saveAs(blob, fileName + ".obj");
            // var blob = new Blob( [ output ], { type: 'text/plain' } );
            // var objectURL = URL.createObjectURL( blob );

            // window.open( objectURL, '_blank' );
            // window.focus();
        }
    },

    loadOBJ: function(file, vport, meshcolor, asString) {
        var reader = new FileReader();
        reader.onload = load;

        function load(ev) {

            var contents = ev.target.result;

            var objects = new THREE.OBJLoader().parse(contents);
            //object.name = file.name;
            //object.material=new THREE.MeshLambertMaterial( { color: color, ambient: color, specular: color, shading:THREE.FlatShading} ) ;
            //vport.add( object );
            for (var i = 0; i < objects.length; i++) {
                if (objects[i] instanceof THREE.Mesh) {
                    THREE.GeometryUtils.center(objects[i].geometry);
                    objects[i].material = new THREE.MeshPhongMaterial({
                        color: meshcolor,
                        ambient: meshcolor,
                        specular: 0x111111,
                        shininess: 200,
                        shading: THREE.FlatShading
                    });
                    vport.HistoryRecord.do("Object: "+objects[i].name+" Loaded to the root layer");
                    viewport.add(objects[i]);
                }
            }

        };
        reader.readAsText(file);
    },

    saveCIL: function(fileName, scene, asString) {
        console.log("saveCIL clicked");
        var entities = [];
        var arrayBuffferSize = 0;
        var arrayBuffer;
        var dataView;
        var offset = 0;
        scene.traverse(function(object) {
            if (object instanceof ConstructorIL.Mesh) {
                var color = object.material.color;
                var mesh = {
                    layer: object.userData,
                    color: color,
                    r: color.r * 255,
                    g: color.g * 255,
                    b: color.b * 255,
                    a: object.material.opacity * 255,
                    typeO: 0,
                    vertexCount: object.geometry.vertices.length,
                    vertices: object.geometry.vertices,
                    triangleCount: object.geometry.faces.length,
                    triangles: object.geometry.faces,
                    matrixWorld:object.matrixWorld,
                    //Color&LayerData+vertexData+TriangleData
                    byteCount: 17 + object.geometry.vertices.length * 24 + object.geometry.faces.length * 12,
                }
                entities.push(mesh);
                console.log("Mesh procesado");
            }
        });
console.log("terminado");
for (var i = 0; i < entities.length; i++)
    arrayBuffferSize += entities[i].byteCount;

arrayBuffer = new ArrayBuffer(arrayBuffferSize);
dataView = new DataView(arrayBuffer);

var entity;
var tmpVertex;
for (var i = 0; i < entities.length; i++) {
    entity = entities[i];

    dataView.setInt32(offset, entity.layer, true);
    offset += 4;

    dataView.setUint8(offset, entity.a);
    offset += 1;
    dataView.setUint8(offset, entity.r);
    offset += 1;
    dataView.setUint8(offset, entity.g);
    offset += 1;
    dataView.setUint8(offset, entity.b);
    offset += 1;
    dataView.setUint8(offset, entity.typeO);
    offset += 1;

    dataView.setInt32(offset, entity.vertexCount, true);
    offset += 4;

    for (var j = 0; j < entity.vertexCount; j++) {
        tmpVertex=new THREE.Vector3();
        tmpVertex.copy(entity.vertices[j]).applyMatrix4(entity.matrixWorld);
        dataView.setFloat64(offset, tmpVertex.x, true);
        offset += 8;
        dataView.setFloat64(offset, tmpVertex.y, true);
        offset += 8;
        dataView.setFloat64(offset, tmpVertex.z, true);
        offset += 8;
    }

    dataView.setInt32(offset, entity.triangleCount, true);
    offset += 4;

    for (var j = 0; j < entity.triangleCount; j++) {
        dataView.setInt32(offset, entity.triangles[j].a, true);
        offset += 4;
        dataView.setInt32(offset, entity.triangles[j].b, true);
        offset += 4;
        dataView.setInt32(offset, entity.triangles[j].c, true);
        offset += 4;
    }
}
if (asString) {
    return arrayBuffer;
} else {
    var blob = new Blob([dataView], {
        type: 'application/octet-stream'
    });
    saveAs(blob, fileName + ".cil");
}
},

loadCILFromArrayBuffer:function(arraybuffer,vport){
        //var buffer = ev.target.result;
        var data = new DataView(arraybuffer);
        var offset = 0;
        var entities = [];

        var layer;
        var r, g, b, a;
        var color;
        var type;
        var x, y, z;
        var v1, v2, v3;
        var geometry;
        var objectCounter=1;
        while (offset < data.byteLength) {
            geometry = new THREE.Geometry();

            layer = data.getUint32(offset, true);
            offset += 4;

            a = data.getUint8(offset);
            offset += 1;
            r = data.getUint8(offset);
            offset += 1;
            g = data.getUint8(offset);
            offset += 1;
            b = data.getUint8(offset);
            offset += 1;


            //color=r.toString(16)+g.toString(16)+b.toString(16);
            //color=parseInt('0x'+color.replace(/0/g,"00"),16);
            color = new THREE.Color();
            color.setRGB(r / 255, g / 255, b / 255);

            type = data.getInt8(offset);
            offset += 1;

            switch (type) {
                case 0: //Mesh
                var vertexCount = data.getUint32(offset, true);
                offset += 4;
                for (var i = 0; i < vertexCount; i++) {
                    x = data.getFloat64(offset, true);
                    offset += 8;
                    y = data.getFloat64(offset, true);
                    offset += 8;
                    z = data.getFloat64(offset, true);
                    offset += 8;
                    geometry.vertices.push(new THREE.Vector3(x, y, z))
                }
                var triangleCount = data.getUint32(offset, true);
                offset += 4;
                for (var i = 0; i < triangleCount; i++) {
                    v1 = data.getInt32(offset, true);
                    offset += 4;
                    v2 = data.getInt32(offset, true);
                    offset += 4;
                    v3 = data.getInt32(offset, true);
                    offset += 4;
                    geometry.faces.push(new THREE.Face3(v1, v2, v3));
                }
                    //THREE.GeometryUtils.center(geometry);
                    geometry.mergeVertices();
                    geometry.computeBoundingBox();
                    geometry.computeBoundingSphere();
                    geometry.computeFaceNormals();
                    geometry.computeVertexNormals();
                    //viewport.HistoryRecord.do("Object: "+mesh.name+"Added to the Default layer");
                    var tmp=new ConstructorIL.Mesh(geometry, new THREE.MeshPhongMaterial({
                        color: 0xEE8136,
                        ambient: 0xEE8136,
                        specular: 0x111111,
                        shininess: 200,
                        shading: THREE.FlatShading
                    }));
                    //tmp.name=file.name+"_"+objectCounter;
                    objectCounter++;
                    vport.HistoryRecord.do("Object: "+tmp.name+" Loaded to the root Layer");
                    vport.add(tmp);
                    var pos=ConstructorIL.Utils.getCentroid(tmp);
                    THREE.GeometryUtils.center( tmp.geometry );
                    tmp.position.copy(pos);

                    break;
                    case 1:
                    break;
                }
            }
        },

        loadCIL: function(file, vport, meshcolor) {
            var reader = new FileReader();
            var mesh;

            reader.onload = load;

            function load(ev) {

                var buffer = ev.target.result;
                var data = new DataView(buffer);
                var offset = 0;
                var entities = [];

                var layer;
                var r, g, b, a;
                var color;
                var type;
                var x, y, z;
                var v1, v2, v3;
                var geometry;
                var objectCounter=1;
                while (offset < data.byteLength) {
                    geometry = new THREE.Geometry();

                    layer = data.getUint32(offset, true);
                    offset += 4;

                    a = data.getUint8(offset);
                    offset += 1;
                    r = data.getUint8(offset);
                    offset += 1;
                    g = data.getUint8(offset);
                    offset += 1;
                    b = data.getUint8(offset);
                    offset += 1;


                //color=r.toString(16)+g.toString(16)+b.toString(16);
                //color=parseInt('0x'+color.replace(/0/g,"00"),16);
                color = new THREE.Color();
                color.setRGB(r / 255, g / 255, b / 255);

                type = data.getInt8(offset);
                offset += 1;

                switch (type) {
                    case 0: //Mesh
                    var vertexCount = data.getUint32(offset, true);
                    offset += 4;
                    for (var i = 0; i < vertexCount; i++) {
                        x = data.getFloat64(offset, true);
                        offset += 8;
                        y = data.getFloat64(offset, true);
                        offset += 8;
                        z = data.getFloat64(offset, true);
                        offset += 8;
                        geometry.vertices.push(new THREE.Vector3(x, y, z))
                    }
                    var triangleCount = data.getUint32(offset, true);
                    offset += 4;
                    for (var i = 0; i < triangleCount; i++) {
                        v1 = data.getInt32(offset, true);
                        offset += 4;
                        v2 = data.getInt32(offset, true);
                        offset += 4;
                        v3 = data.getInt32(offset, true);
                        offset += 4;
                        geometry.faces.push(new THREE.Face3(v1, v2, v3));
                    }
                        //THREE.GeometryUtils.center(geometry);
                        geometry.mergeVertices();
                        geometry.computeBoundingBox();
                        geometry.computeBoundingSphere();
                        geometry.computeFaceNormals();
                        geometry.computeVertexNormals();
                        //viewport.HistoryRecord.do("Object: "+mesh.name+"Added to the Default layer");
                        var tmp=new ConstructorIL.Mesh(geometry, new THREE.MeshPhongMaterial({
                            color: meshcolor,
                            ambient: meshcolor,
                            specular: 0x111111,
                            shininess: 200,
                            shading: THREE.FlatShading
                        }));
                        tmp.name=file.name+"_"+objectCounter;
                        objectCounter++;
                        vport.HistoryRecord.do("Object: "+tmp.name+" Loaded to the root layer");
                        vport.add(tmp);
                        var pos=ConstructorIL.Utils.getCentroid(tmp);
                        THREE.GeometryUtils.center( tmp.geometry );
                        tmp.position.copy(pos);

                        break;
                        case 1:
                        break;
                    }
                }
            };
            return reader.readAsArrayBuffer(file);
        },

    //Funcion para importar archivos, 
    //genera la ventana de seleccion y llama a la funciona adecuada para procesar el archivo selecciondo
    importHandle: function(vport, color) {
        return function() {
            var file;
            var fileType;
            for (var fileIndex = 0; fileIndex < this.files.length; fileIndex++) {
                file = this.files[fileIndex];
                fileType = file.name.split('.').pop().toLowerCase();
                switch (fileType) {
                    case 'stl':
                    ConstructorIL.File.loadSTL(file, vport, color);
                    break;
                    case 'cil':
                    ConstructorIL.File.loadCIL(file, vport, color);
                    break;
                    case 'obj':
                    ConstructorIL.File.loadOBJ(file, vport, color);
                    break;
                }
            }
        }
    },

    importImageHandle: function(viewport) {
        return function() {
            var file;
            var fileType;

            var reader = new FileReader();
            
            reader.onloadend = function (e) {
                var image = document.createElement( 'img' );
                image.setAttribute('src', e.target.result);
                window.setTimeout(function(){
                    var texture = new THREE.Texture();
                    texture.image=image;
                    texture.needsUpdate = true;
                    var plane = new ConstructorIL.Mesh( new THREE.PlaneGeometry( image.width/10, image.height/10, 1, 1 ), 
                        new THREE.MeshPhongMaterial( { 
                            color: 0xffffff,
                            map:texture,
                            side:THREE.DoubleSide
                        } ) );
                    viewport.HistoryRecord.do("Image: "+file.name+" Added to the viewport");
                    viewport.addEntity(plane);
                },1);

            }

            for (var fileIndex = 0; fileIndex < this.files.length; fileIndex++) {
                file = this.files[fileIndex];
                
                reader.readAsDataURL(file);

            }
        }
    },

    importLocalImage:function(path){
        var reader = new FileReader();
        var image;
        reader.onload = function (e) {
            image = document.createElement( 'img' );
            image.setAttribute('src', e.target.result);
        }
        //reader.readAsDataURL(path);
        return image;   
    }
}

ConstructorIL.Profile={
}

ConstructorIL.Profile.Cura ={
    /* Old
    base:{
        layer_height : 0.2,
        wall_thickness : 0.4,
        retraction_enable : true,
        solid_layer_thickness : 0.6,
        fill_density : 05,
        nozzle_size : 0.35,
        print_speed : 100,
        print_temperature : 220,
        print_temperature2 : 0,
        print_temperature3 : 0,
        print_temperature4 : 0,
        print_bed_temperature : 70,
        support : 'None',
        platform_adhesion : 'None',
        support_dual_extrusion : 'Both',
        wipe_tower : False,
        wipe_tower_volume : 15,
        ooze_shield : False,
        filament_diameter : 1.75,
        filament_diameter2 : 0,
        filament_diameter3 : 0,
        filament_diameter4 : 0,
        filament_flow : 100.0,
        retraction_speed : 120,
        retraction_amount : 10,
        retraction_dual_amount : 16.5,
        retraction_min_travel : 3,
        retraction_combing : True,
        retraction_minimal_extrusion : 0,
        retraction_hop : 0,
        bottom_thickness : 0.2,
        layer0_width_factor : 120,
        object_sink : 0.0,
        overlap_dual : 0.15,
        travel_speed : 140.0,
        bottom_layer_speed : 30,
        infill_speed : 40,
        inset0_speed : 25,
        insetx_speed : 60,
        cool_min_layer_time : 5,
        fan_enabled : true,
        skirt_line_count : 0,
        skirt_gap : 2.0,
        skirt_minimal_length : 150.0,
        fan_full_height : 0.5,
        fan_speed : 100,
        fan_speed_max : 100,
        cool_min_feedrate : 10,
        cool_head_lift : False,
        solid_top : True,
        solid_bottom : True,
        fill_overlap : 30,
        support_type : 'Grid',
        support_angle : 60,
        support_fill_rate : 05,
        support_xy_distance : 0.7,
        support_z_distance : 0.15,
        spiralize : False,
        simple_mode : False,
        brim_line_count : 20,
        raft_margin : 0,
        raft_line_spacing : 3.0,
        raft_base_thickness : 0.3,
        raft_base_linewidth : 1.0,
        raft_interface_thickness : 0.27,
        raft_interface_linewidth : 0.4,
        raft_airgap : 0.22,
        raft_surface_layers : 2,
        fix_horrible_union_all_type_a : true,
        fix_horrible_union_all_type_b : false,
        fix_horrible_use_open_bits : false,
        fix_horrible_extensive_stitching : false,
        plugin_config : '',
        object_center_x : -1,
        object_center_y : -1,
    },
    
    */
    base:{
        layer_height : 0.2,
        wall_thickness : 0.7,
        retraction_enable : true,
        solid_layer_thickness : 1,
        fill_density : 10,
        nozzle_size : 0.35,
        print_speed : 30,
        print_temperature : 220,
        print_temperature2 : 0,
        print_temperature3 : 0,
        print_temperature4 : 0,
        print_bed_temperature : 70,
        support : 'None',
        platform_adhesion : 'None',
        support_dual_extrusion : 'Both',
        wipe_tower : false,
        wipe_tower_volume : 15,
        ooze_shield : false,
        filament_diameter : 1.74,
        filament_diameter2 : 0,
        filament_diameter3 : 0,
        filament_diameter4 : 0,
        filament_flow : 100.0,
        retraction_speed : 120,
        retraction_amount : 10,
        retraction_dual_amount : 16.5,
        retraction_min_travel : 3,
        retraction_combing : true,
        retraction_minimal_extrusion : 0,
        retraction_hop : 0,
        bottom_thickness : 0.2,
        layer0_width_factor : 120,
        object_sink : 0.0,
        overlap_dual : 0.15,
        travel_speed : 130.0,
        bottom_layer_speed : 30,
        infill_speed : 40,
        inset0_speed : 25,
        insetx_speed : 30,
        cool_min_layer_time : 5,
        fan_enabled : true,
        skirt_line_count : 2,
        skirt_gap : 2.0,
        skirt_minimal_length : 150.0,
        fan_full_height : 0.5,
        fan_speed : 100,
        fan_speed_max : 100,
        cool_min_feedrate : 10,
        cool_head_lift : false,
        solid_top : true,
        solid_bottom : true,
        fill_overlap : 30,
        support_type : 'Grid',
        support_angle : 60,
        support_fill_rate : 5,
        support_xy_distance : 0.7,
        support_z_distance : 0.15,
        spiralize : false,
        simple_mode : false,
        brim_line_count : 20,
        raft_margin : 0,
        raft_line_spacing : 3.0,
        raft_base_thickness : 0.3,
        raft_base_linewidth : 1.0,
        raft_interface_thickness : 0.27,
        raft_interface_linewidth : 0.4,
        raft_airgap : 0.22,
        raft_surface_layers : 2,
        fix_horrible_union_all_type_a : true,
        fix_horrible_union_all_type_b : false,
        fix_horrible_use_open_bits : false,
        fix_horrible_extensive_stitching : false,
        plugin_config : '',
        object_center_x : -1,
        object_center_y : -1
    }
}

ConstructorIL.Profile.CuraEngine ={
    base:{
        autoCenter: 1,
        initialSpeedupLayers:4,
        minimalFeedrate:10,
        //preSwitchExtruderCode:'',
        supportXYDistance:700,
        insetXSpeed:30,
        retractionZHop:0,
        //::::
        // extruderOffset[3].X:0,
        // xtruderOffset[3].Y:0,
        gcodeFlavor:2,
        //postSwitchExtruderCode:'',
        retractionSpeed:120,
        filamentFlow:100,
        infillOverlap:30,
        inset0Speed:25,
        coolHeadLift:0,
        extrusionWidth:350,
        upSkinCount:6,
        initialLayerSpeed:30,
        minimalLayerTime:5,
        infillSpeed:40,
        supportExtruder:-1,
        fanSpeedMax:100,
        enableCombing:1,
        fanSpeedMin:100,
        supportZDistance:150,
        supportEverywhere:0,
        filamentDiameter:1740,
        initialLayerThickness:200,
        supportAngle:-1,
        fanFullOnLayerNr:2,
        //extruderOffset[1].X: 0
        //extruderOffset[1].Y:21600,
        layerThickness:200,
        minimalExtrusionBeforeRetraction:0,
        retractionMinimalDistance:3000,
        skirtMinLength:150000,
        objectSink:0,
        retractionAmount:10000,
        skirtLineCount:2,
        skirtDistance:2000,

        // extruderOffset[2].Y:0,
        // extruderOffset[2].X:0,
        posx:0,
        posy:0,
        printSpeed:30,
        fixHorrible:1,
        layer0extrusionWidth:420,
        moveSpeed:130,
        supportLineDistance:7000,
        retractionAmountExtruderSwitch:16500,
        sparseInfillLineDistance:7000,
        insetCount:2,
        downSkinCount:6,
        multiVolumeOverlap:150,

    }

}

ConstructorIL.Profile.Utils = {

    createCORSRequest: function (method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS not supported.
            xhr = null;
        }
        return xhr;
    },

    parseCuraProfile: function (file){
        var text;
        var fileReader= new FileReader();
        var dictionary={};
        fileReader.onload=function(event){
            text=event.target.result;
            var lines=text.split("\n");
            var line;
            var pair;
            var parameter=/^\w+(\s*\=\s*)(-?(?:\d*\.)?\d+|\w+)?/;
            var section=/\[\w+\]/;
            var multiline=/^\w+\.\w+(\s*\=\s*)(.*)?/;
            
            var lineIndex;
            for(var lineIndex=0;lineIndex<lines.length; lineIndex++){
                line=lines[lineIndex];
                line.replace(/(\r\n|\n|\r)/gm,"")
                console.log("======"+line+"=======")
                if(section.test(line)){
                    console.log("seccion - Ignored");
                    continue;
                }else if(parameter.test(line)){
                    console.log('       - Stored as parameter');
                    pair=line.split("=");
                    dictionary[pair[0].replace(/(\r\n\s|\n|\r|\s)/gm,"")]=pair[1];
                }else if(multiline.test(line)){
                    console.log('       - Storing as Multiline');
                    pair=line.split("=");
                    var key=pair[0].replace(/(\r\n\s|\n|\r|\s)/gm,"")
                    var value=pair[1];
                    lineIndex++;

                    for(var multilineIndex=lineIndex;multilineIndex<lines.length;multilineIndex++){
                        line=lines[multilineIndex];
                        if(multiline.test(line)){
                            lineIndex=multilineIndex;
                            dictionary[key]=value;
                            break;
                        }else{
                            value+='\n'+line;
                        }
                    }
                    
                    console.log('       - Stored as Multiline');
                }else{
                    console.log('       - Ignored');
                }
            }
            console.log(dictionary);
            console.log("========= New Profile =======");
            console.log(curaProfileToCuraEngineProfile(dictionary));
            
        }

        fileReader.readAsText(file)
        return dictionary;
    },

    curaProfileToCuraEngineProfile: function (curaProfile){

        var curaEngineProfile = {
            layerThickness: parseFloat(curaProfile['layer_height'] * 1000),
            initialLayerThickness : parseFloat(curaProfile['bottom_thickness']) > 0.0 ? parseFloat(curaProfile['bottom_thickness']) * 1000 : parseFloat(curaProfile['layer_height']) * 1000,
            filamentDiameter: curaProfile['filament_diameter'] * 1000,
            filamentFlow: curaProfile['filament_flow'],
            
            extrusionWidth: calculateEdgeWidth(curaProfile) * 1000,

            layer0extrusionWidth: calculateEdgeWidth(curaProfile) * curaProfile['layer0_width_factor'] / 100 * 1000,
            insetCount: calculateLineCount(curaProfile),
            downSkinCount: curaProfile['solid_bottom'] == 'True' ? calculateSolidLayerCount(curaProfile) : 0,
            upSkinCount: curaProfile['solid_top'] == 'True' ? calculateSolidLayerCount(curaProfile) : 0,


            infillOverlap: curaProfile['fill_overlap'],
            initialSpeedupLayers: 4,
            initialLayerSpeed: curaProfile['bottom_layer_speed'],
            printSpeed: curaProfile['print_speed'],
            infillSpeed: curaProfile['infill_speed'] > 0 ? curaProfile['infill_speed'] : curaProfile['print_speed'],
            
            inset0Speed: curaProfile['inset0_speed'] > 0 ?curaProfile['inset0_speed'] : curaProfile['print_speed'],

            
            insetXSpeed: curaProfile['insetx_speed'] > 0 ? curaProfile['insetx_speed'] : curaProfile['print_speed'],
            moveSpeed: curaProfile['travel_speed'],
            fanSpeedMin: curaProfile['fan_enabled'] == 'True' ? curaProfile['fan_speed'] : 0,
            fanSpeedMax:  curaProfile['fan_enabled'] == 'True'? curaProfile['fan_speed_max'] : 0,
            supportAngle: curaProfile['support'] == 'None' ? -1 : curaProfile['support_angle'],
            supportEverywhere: curaProfile['support'] == 'Everywhere' ? 1 : 0,
            supportLineDistance:  curaProfile['support_fill_rate'] > 0 ?  100 * calculateEdgeWidth(curaProfile) * 1000 /curaProfile['support_fill_rate'] : -1,
            supportXYDistance: 1000 * curaProfile['support_xy_distance'],
            supportZDistance: 1000 * curaProfile['support_z_distance'],
            supportExtruder: curaProfile['support_dual_extrusion'] == 'First extruder'  ? 0 : (( curaProfile['support_dual_extrusion'] == 'Second extruder' && /*minimalExtruderCount()*/1 > 1) ? 1 : -1),
            retractionAmount: curaProfile['retraction_enable'] == 'True' ? curaProfile['retraction_amount'] * 1000 : 0,
            retractionSpeed: curaProfile['retraction_speed'],
            retractionMinimalDistance: curaProfile['retraction_min_travel'] * 1000,
            retractionAmountExtruderSwitch: curaProfile['retraction_dual_amount'] * 1000,
            retractionZHop: curaProfile['retraction_hop'] * 1000,
            minimalExtrusionBeforeRetraction: curaProfile['retraction_minimal_extrusion'] * 1000,
            enableCombing: curaProfile['retraction_combing'] == 'True' ? 1 : 0,
            multiVolumeOverlap: curaProfile['overlap_dual'] * 1000,
            objectSink: Math.max(0, curaProfile['object_sink'] * 1000),
            minimalLayerTime: curaProfile['cool_min_layer_time'],
            minimalFeedrate: curaProfile['cool_min_feedrate'],
            coolHeadLift: curaProfile['cool_head_lift'] == 'True' ? 1 : 0,
            startCode: '',//getAlterationFileContents('start.gcode', /*extruderCount*/1),
            endCode: '',//getAlterationFileContents('end.gcode', /*extruderCount*/1),
            preSwitchExtruderCode: '',//getAlterationFileContents('preSwitchExtruder.gcode', /*extruderCount*/1),
            postSwitchExtruderCode: '',//getAlterationFileContents('postSwitchExtruder.gcode', /*extruderCount*/1),

            // extruderOffset[1].X: getMachineSettingFloat('extruder_offset_x1') * 1000,
            // extruderOffset[1].Y: getMachineSettingFloat('extruder_offset_y1') * 1000,
            // extruderOffset[2].X: getMachineSettingFloat('extruder_offset_x2') * 1000,
            // extruderOffset[2].Y: getMachineSettingFloat('extruder_offset_y2') * 1000,
            // extruderOffset[3].X: getMachineSettingFloat('extruder_offset_x3') * 1000,
            // extruderOffset[3].Y: getMachineSettingFloat('extruder_offset_y3') * 1000,
            // extruderOffset[1].X: 0,
            // extruderOffset[1].Y: 0,
            // extruderOffset[2].X: 0,
            // extruderOffset[2].Y: 0,
            // extruderOffset[3].X: 0,
            // extruderOffset[3].Y: 0,
            extruderOffset:[{X:0,Y:0},{X:0,Y:0},{X:0,Y:0}],
            fixHorrible: 0,
        }

        var fanFullHeight = curaProfile['fan_full_height'] * 1000;
        curaEngineProfile['fanFullOnLayerNr'] = (fanFullHeight - curaEngineProfile['initialLayerThickness'] - 1) / curaEngineProfile['layerThickness'] + 1
        if (curaEngineProfile['fanFullOnLayerNr'] < 0)
            curaEngineProfile['fanFullOnLayerNr'] = 0;
        if (curaProfile['support_type'] == 'Lines')
            curaEngineProfile['supportType'] = 1;

        if (curaProfile['fill_density'] == 0)
            curaEngineProfile['sparseInfillLineDistance'] = -1;
        else if (curaProfile['fill_density'] == 100){
            curaEngineProfile['sparseInfillLineDistance'] = curaEngineProfile['extrusionWidth'];
            //Set the up/down skins height to 10000 if we want a 100% filled object.
            // This gives better results then normal 100% infill as the sparse and up/down skin have some overlap.
            curaEngineProfile['downSkinCount'] = 10000
            curaEngineProfile['upSkinCount'] = 10000
        }else{
            curaEngineProfile['sparseInfillLineDistance'] = 100 * calculateEdgeWidth(curaProfile) * 1000 / curaProfile['fill_density']
        }

        if (curaProfile['platform_adhesion'] == 'Brim'){
            curaEngineProfile['skirtDistance'] = 0
            curaEngineProfile['skirtLineCount'] = curaProfile['brim_line_count']
        }else if (curaProfile['platform_adhesion'] == 'Raft'){
            curaEngineProfile['skirtDistance'] = 0
            curaEngineProfile['skirtLineCount'] = 0
            curaEngineProfile['raftMargin'] = curaProfile['raft_margin'] * 1000
            curaEngineProfile['raftLineSpacing'] = curaProfile['raft_line_spacing'] * 1000
            curaEngineProfile['raftBaseThickness'] = curaProfile['raft_base_thickness'] * 1000
            curaEngineProfile['raftBaseLinewidth'] = curaProfile['raft_base_linewidth']* 1000
            curaEngineProfile['raftInterfaceThickness'] = curaProfile['raft_interface_thickness'] * 1000
            curaEngineProfile['raftInterfaceLinewidth'] = curaProfile['raft_interface_linewidth'] * 1000
            curaEngineProfile['raftInterfaceLineSpacing'] = curaProfile['raft_interface_linewidth'] * 1000 * 2.0
            curaEngineProfile['raftAirGapLayer0'] = curaProfile['raft_airgap'] * 1000
            curaEngineProfile['raftBaseSpeed'] = curaProfile['bottom_layer_speed']
            curaEngineProfile['raftFanSpeed'] = 100
            curaEngineProfile['raftSurfaceThickness'] = curaEngineProfile['raftInterfaceThickness']
            curaEngineProfile['raftSurfaceLinewidth'] = calculateEdgeWidth(curaProfile) * 1000
            curaEngineProfile['raftSurfaceLineSpacing'] = calculateEdgeWidth(curaProfile) * 1000 * 0.9
            curaEngineProfile['raftSurfaceLayers'] = curaProfile['raft_surface_layers']
            curaEngineProfile['raftSurfaceSpeed'] = curaProfile['bottom_layer_speed']
        }else{
            curaEngineProfile['skirtDistance'] = curaProfile['skirt_gap'] * 1000
            curaEngineProfile['skirtLineCount'] = curaProfile['skirt_line_count']
            curaEngineProfile['skirtMinLength'] = curaProfile['skirt_minimal_length'] * 1000
        }

        if (curaProfile['fix_horrible_union_all_type_a'] == 'True')
            curaEngineProfile['fixHorrible'] |= 0x01
        if (curaProfile['fix_horrible_union_all_type_b'] == 'True')
            curaEngineProfile['fixHorrible'] |= 0x02
        if (curaProfile['fix_horrible_use_open_bits'] == 'True')
            curaEngineProfile['fixHorrible'] |= 0x10
        if (curaProfile['fix_horrible_extensive_stitching'] == 'True')
            curaEngineProfile['fixHorrible'] |= 0x04

        if (curaEngineProfile['layerThickness'] <= 0)
            curaEngineProfile['layerThickness'] = 1000
        // if profile.getMachineSetting('gcode_flavor') == 'UltiGCode':
        //  curaProfile['gcodeFlavor'] = 1
        // elif profile.getMachineSetting('gcode_flavor') == 'MakerBot':
        //  curaProfile['gcodeFlavor'] = 2
        // elif profile.getMachineSetting('gcode_flavor') == 'BFB':
        //  curaProfile['gcodeFlavor'] = 3
        // elif profile.getMachineSetting('gcode_flavor') == 'Mach3':
        //  curaProfile['gcodeFlavor'] = 4
        // elif profile.getMachineSetting('gcode_flavor') == 'RepRap (Volumetric)':
        //  curaProfile['gcodeFlavor'] = 5
        curaEngineProfile['gcodeFlavor']=2

        if (curaProfile['spiralize'] == 'True')
            curaEngineProfile['spiralizeMode'] = 1
        if (curaProfile['simple_mode'] == 'True')
            curaEngineProfile['simpleMode'] = 1
        if (curaProfile['wipe_tower'] == 'True' && extruderCount > 1)
            curaEngineProfile['wipeTowerSize'] = Math.sqrt(curaProfile['wipe_tower_volume'] * 1000000000 / curaProfile['layerThickness'])
        if (curaProfile['ooze_shield'] == 'True')
            curaEngineProfile['enableOozeShield'] = 1
        return curaEngineProfile;
    },

    toString:function(profile){
        var text='';
        for (var p in profile) {
            if (profile.hasOwnProperty(p)) {
                //tabjson.push('"'+p +'"'+ ':' + obj[p]);
                text+=p+"="+profile[p]+"\n";
            }
        } 
        return text;
    },

    handler: function (event){
        for(var fileIndex=0;fileIndex<event.target.files.length;fileIndex++){
            parseCuraProfile(event.target.files[fileIndex]);
        }
    },

    calculateLineCount: function (curaProfile){
        var wallThickness = curaProfile['wall_thickness'];
        var nozzleSize = curaProfile['nozzle_size'];

        if (wallThickness < 0.01)
            return 0;
        if (wallThickness < nozzleSize)
            return 1;
        if (curaProfile['spiralize'] == 'True' || curaProfile['simple_mode'] == 'True')
            return 1;

        var lineCount = wallThickness / (nozzleSize - 0.0001);
        if (lineCount < 1)
            lineCount = 1;
        var lineWidth = wallThickness / lineCount;
        lineWidthAlt = wallThickness / (lineCount + 1);
        if (lineWidth > nozzleSize * 1.5)
            return lineCount + 1;
        return lineCount;
    },

    calculateSolidLayerCount: function (curaProfile){
        var layerHeight = curaProfile['layer_height'];
        var solidThickness = curaProfile['solid_layer_thickness'];
        if (layerHeight == 0.0)
            return 1;
        return Math.ceil(solidThickness / (layerHeight - 0.0001));
    },

    calculateObjectSizeOffsets: function (curaProfile){
        var size = 0.0

        if (curaProfile['platform_adhesion'] == 'Brim'){
            size += curaProfile['brim_line_count'] * calculateEdgeWidth(curaProfile)
        }
        else if (curaProfile['platform_adhesion'] == 'Raft'){

        }else if (curaProfile['skirt_line_count'] > 0){
            size += curaProfile['skirt_line_count'] * calculateEdgeWidth(curaProfile) + curaProfile['skirt_gap']
        }

        //Comentado por cura
        //if curaProfile['enable_raft'] != 'False':
        //  size += profile.curaProfile['raft_margin') * 2
        //if curaProfile['support') != 'None':
        //  extraSizeMin = extraSizeMin + numpy.array([3.0, 0, 0])
        //  extraSizeMax = extraSizeMax + numpy.array([3.0, 0, 0])
        return size
    },

    calculateEdgeWidth: function (curaProfile){
        var wallThickness = curaProfile['wall_thickness'];
        var nozzleSize = curaProfile['nozzle_size'];

        if (curaProfile['spiralize'] == 'True' || curaProfile['simple_mode'] == 'True')
            return wallThickness

        if (wallThickness < 0.01)
            return nozzleSize;
        if (wallThickness < nozzleSize)
            return wallThickness;

        var lineCount =wallThickness / (nozzleSize - 0.0001)
        if (lineCount == 0)
            return nozzleSize;
        var lineWidth = wallThickness / lineCount;
        var lineWidthAlt = wallThickness / (lineCount + 1)
        if (lineWidth > nozzleSize * 1.5)
            return lineWidthAlt;
        return lineWidth;
    }
}

ConstructorIL.Shaders={
    lava:function(){
        ConstructorIL.Shaders.Uniforms.lava2.texture1.value.wrapS = ConstructorIL.Shaders.Uniforms.lava2.texture1.value.wrapT = THREE.RepeatWrapping;
        ConstructorIL.Shaders.Uniforms.lava2.texture2.value.wrapS = ConstructorIL.Shaders.Uniforms.lava2.texture2.value.wrapT = THREE.RepeatWrapping;
        return new THREE.ShaderMaterial({
            uniforms:ConstructorIL.Shaders.Uniforms.lava2,
            vertexShader: ConstructorIL.Shaders.Vertex.lava,
            fragmentShader: ConstructorIL.Shaders.Fragment.lava2
        });
    }
}

ConstructorIL.Shaders.Uniforms={
    lava : {
        fogDensity: { type: "f", value: 0.45 },
        fogColor: { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },
        time: { type: "f", value: 1.0 },
        resolution: { type: "v2", value: new THREE.Vector2() },
        uvScale: { type: "v2", value: new THREE.Vector2( 3.0, 1.0 ) },
        texture1: { type: "t", value: THREE.ImageUtils.loadTexture( "textures/lava/cloud.png" ) },
        texture2: { type: "t", value: THREE.ImageUtils.loadTexture( "textures/lava/lavatile.jpg" ) }

    },
    lava2:{
        time: { type: "f", value: 1.0 },  
        uvScale: { type: "v2", value: new THREE.Vector2( 1.0, 1.0 ) },
        iResolution:{type:"v3", value: new THREE.Vector3(128,72,1)}, 
        texture1: { type: "t", value: THREE.ImageUtils.loadTexture( "textures/lava/noise.png" ) },
        texture2: { type: "t", value: THREE.ImageUtils.loadTexture( "textures/lava/lavatile.jpg" ) }

    }

}

ConstructorIL.Shaders.Vertex={
    singleColor:'\
    void main() {\
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\
    }\
    ',

    lava:'\
    uniform vec2 uvScale;\
    varying vec2 vUv;\
    \
    void main()\
    {\
        \
        vUv = uvScale * uv;\
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\
        gl_Position = projectionMatrix * mvPosition;\
        \
    }\
    '
}

ConstructorIL.Shaders.Fragment={
    singleColor:'\
    void main() {\
        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); \
    }\
    ',

    lava:'  uniform float time;\
    uniform vec2 resolution;\
    \
    uniform float fogDensity;\
    uniform vec3 fogColor;\
    \
    uniform sampler2D texture1;\
    uniform sampler2D texture2;\
    \
    varying vec2 vUv;\
    \
    void main( void ) {\
        \
        vec2 position = -1.0 + 2.0 * vUv;\
        \
        vec4 noise = texture2D( texture1, vUv );\
        vec2 T1 = vUv + vec2( 1.5, -1.5 ) * time  *0.02;\
        vec2 T2 = vUv + vec2( -0.5, 2.0 ) * time * 0.01;\
        \
        T1.x += noise.x * 2.0;\
        T1.y += noise.y * 2.0;\
        T2.x -= noise.y * 0.2;\
        T2.y += noise.z * 0.2;\
        \
        float p = texture2D( texture1, T1 * 2.0 ).a;\
        \
        vec4 color = texture2D( texture2, T2 * 2.0 );\
        vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );\
        \
        if( temp.r > 1.0 ){ temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }\
        if( temp.g > 1.0 ){ temp.rb += temp.g - 1.0; }\
        if( temp.b > 1.0 ){ temp.rg += temp.b - 1.0; }\
        \
        gl_FragColor = temp;\
        \
        float depth = gl_FragCoord.z / gl_FragCoord.w;\
        const float LOG2 = 1.442695;\
        float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\
        fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\
        \
        gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\
        \
    }\
    ',

    lava2:'\
    uniform float time;\
    uniform vec3 iResolution;\
    uniform sampler2D texture1;\
    uniform sampler2D texture2;\
    \
    float hash21(in vec2 n){ return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }\
    mat2 makem2(in float theta){float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);}\
    float noise( in vec2 x ){return texture2D(texture1, x*.01).x;}\
    \
    vec2 gradn(vec2 p)\
    {\
        float ep = .09;\
        float gradx = noise(vec2(p.x+ep,p.y))-noise(vec2(p.x-ep,p.y));\
        float grady = noise(vec2(p.x,p.y+ep))-noise(vec2(p.x,p.y-ep));\
        return vec2(gradx,grady);\
    }\
    \
    float flow(in vec2 p)\
    {\
        float z=2.;\
        float rz = 0.;\
        vec2 bp = p;\
        for (float i= 1.;i < 7.;i++ )\
            {\
                p += time*1.5;\
                \
                bp += time*2.;\
                \
                vec2 gr = gradn(i*p*.34+time*1.);\
                \
                gr*=makem2(time*10.-(0.05*p.x+0.03*p.y)*40.);\
                \
                p += gr*.5;\
                \
                rz+= (sin(noise(p)*7.)*0.5+0.5)/z;\
                \
                p = mix(bp,p,.8);\
                \
                z *= 1.4;\
                p *= 2.;\
                bp *= 1.9;\
            }\
            return rz;  \
        }\
        \
        void main()\
        {\
            vec2 p = gl_FragCoord.xy / iResolution.xy-0.5;\
            p.x *= iResolution.x/iResolution.y;\
            p*= 3.;\
            float rz = flow(p);\
            \
            vec3 col = vec3(.2,0.07,0.01)/rz;\
            col=pow(col,vec3(1.4));\
            gl_FragColor = vec4(col,1.0);\
        }\
        '

    }