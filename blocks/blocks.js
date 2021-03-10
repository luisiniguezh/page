
 $("#splash").ready()
        {
              setTimeout(function() {
                     jQuery(document).ready(function() {

                          $("#sonidos").click(function(){
                          $("#soundControls").toggle();
                          $("#scenaryControls").hide();

                        });
                        $("#LimpiarEscenario").click(function(){
                          location.reload();
                        });

                        $("#closeBtnMsk").click(function(){
                          $("#soundControls").hide();
                        });

/*
                        if(window.Android.ExisteSesion())
                        {
                            var username= window.Android.getUsername();
                            var folder= window.Android.getFolder();
                            var avatar= window.Android.getAvatar();
                            var url = "http://www.colibri3d.com/admin/3dusr/"+folder+"/"+avatar;
                            $('#etqUsername').text(username);
                            $('#imgProfile').attr("src", url);
                            $("#btnSesion").val('Cerrar sesión');

                        }*/

                          $('#splash').fadeOut("150");
                          $('#splash').hide();
                    });
                                 //   });
                                }, 3000);

       }
/*$(window).load(function(){
	$('#introWeb').modal('show');
});*/


/* ============ R67 OVERRIDES =======*/
THREE.MOUSE = {};

THREE.MOUSE.LEFT =0;
/* ============ R67 OVERRIDES =======*/

/* ============ VARS =========*/
var VARS={};
	
	VARS.MOUSE={};

    VARS.MACHINE={

    };

    VARS.MACHINE.COLIBRI={

    };

    VARS.MACHINE.COLBRI_HOME={

    };

	VARS.CAMERA={
		FRONT:0,
		BACK:1,
		LEFT:2,
		RIGHT:3,
		TOP:4,
		BOTTOM:5,
		LEFR:6,
		FRRI:7,
		RIBA:8,
		BALE:10,
		LETO:11,
		FRTO:12,
		RITO:13,
		BATO:14,
		LEBO:15,
		FRBO:16,
		RIBO:17,
		BABO:18,
		LEFRTO:19,
		LEFRBO:20,
		FRRITO:21,
		FRRIBO:22,
		RIBATO:23,
		RIBABO:24,
		BALETO:25,
		BALEBO:26,
		ISO:27
	};

	VARS.CAMERACUBE={
		SIZE:8,
		ROTATESPEED:0.55,
		TEXTCOLOR:0x188db5,
		COLOR:0xEFEFEF,
		SELECTION:0X0FD855

	};

	VARS.HISTORY={
		ADD:0,
		REMOVE:1,
		TRANSFORM:2
	};
/* ============ VARS =========*/

/*============== Camera cube ===================*/
var CameraCube = function(viewport, domElement){ 
		var object3D;
		var ambientLight;
		var hemisphereLight;
		var mouse = new THREE.Vector2(-200,-200), INTERSECTED={};
		var scene;
		var renderer;

		this.container = document.createElement('div');
		
		$(this.container).width('135px');
		$(this.container).height('135px');
		//$(this.container).css({border:"1px solid #000"});
		
		renderer = new THREE.WebGLRenderer({
	        antialias: true,
	        alpha: true
	    });
	    renderer.setSize($(this.container).width(), $(this.container).height());
	    
	    scene = new THREE.Scene();

	    

	    

	   	object3D=createCube();
	   	


    	scene.add(object3D);


	    this.camera = new THREE.PerspectiveCamera(viewport.Camera.fov, $(this.container).width() / $(this.container).height(), 0.01, 100*VARS.CAMERACUBE.SIZE);
	    this.camera.up.copy(viewport.Camera.up);
	    

		var innerControls=new THREE.OrbitControls(this.camera, renderer.domElement);
		innerControls.rotateSpeed=VARS.CAMERACUBE.ROTATESPEED;
		innerControls.mouseButtons={ ORBIT: THREE.MOUSE.LEFT, /*ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.MIDDLE */};	
		innerControls.noPan=true;
		innerControls.noZoom=true;
		var outerControls=new THREE.OrbitControls(viewport.Camera, renderer.domElement);
		outerControls.rotateSpeed=VARS.CAMERACUBE.ROTATESPEED;
		outerControls.noPan=true;
		outerControls.noZoom=true;
		outerControls.mouseButtons={ ORBIT: THREE.MOUSE.LEFT, /*ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.MIDDLE */};	
		var externalControls=new THREE.OrbitControls(this.camera, viewport.Renderer.domElement);
		externalControls.noPan=true;
		externalControls.noZoom=true;
		var dragging={value:false};	

		ambientLight = new THREE.AmbientLight(0x999999);
	    scene.add(ambientLight);

	    var light = new THREE.DirectionalLight( 0x777777, 0.76 );
	    scene.add(light);

	    var pointLight = new THREE.PointLight( 0xDDDDDD, 0.6, 90 );
	    scene.add(pointLight);

		$(this.container).append(renderer.domElement);
		domElement.appendChild(this.container);
		
		renderer.domElement.addEventListener( 'mousemove', onMouseMove(renderer, mouse, {top:domElement.offsetTop, left:domElement.offsetLeft }, dragging), false );
		renderer.domElement.addEventListener( 'mouseup', onMouseUp(INTERSECTED,viewport, this.camera, object3D,[innerControls,outerControls,externalControls], dragging), false );
		
		this.setPosition(0,0);

		var normalizedVector=new THREE.Vector3().copy(viewport.Camera.position).normalize();
		innerControls.rotateUp(degToRad(-5));
		this.camera.position.copy(normalizedVector).multiplyScalar(15*VARS.CAMERACUBE.SIZE);
		
		outerControls.target=viewport.Controls.target;
		
		outerControls.update();
		innerControls.update();
		externalControls.update();

		this.camera.updateMatrix();

		Render(renderer, scene, light , pointLight,viewport.FPS, mouse, INTERSECTED, this.camera, object3D.children);
	
};


function onMouseMove( renderer, mouse, offset, dragging) {

	return function (event){
		event.preventDefault();

		mouse.x = ( (event.clientX - ( renderer.domElement.offsetParent.offsetLeft + offset.left) ) / renderer.domElement.width ) * 2 - 1;
		mouse.y = - ( (event.clientY - ( renderer.domElement.offsetParent.offsetLeft + offset.top) ) /renderer.domElement.height ) * 2 + 1;
		
		dragging.value=event.buttons===0?false:true;
		
	};
}

//object3D 
function onMouseUp(INTERSECTED, viewport, camera, object3D, controls, dragging ){
	return function( event ){

		if(event.button === 0 && INTERSECTED.object && !dragging.value){
			//viewport.setView(INTERSECTED.object.name);
			var normalizedVector = new THREE.Vector3().copy(viewport.Camera.position).normalize();
			camera.position.copy(normalizedVector).multiplyScalar(15*VARS.CAMERACUBE.SIZE);
			controls[0].rotateUp(degToRad(-5));
			controls[1].target=viewport.Controls.target;
			for(var control in controls)
				controls[control].update();
		
		}

		dragging.value=false;


	};
}



//mouse camera object3D

function Render( renderer, scene, light, pointLight, fps, mouse, INTERSECTED, camera, objects ){
	if(!fps)fps=30;
	var raycaster = new THREE.Raycaster();
	var renderTasks=function(){
        setTimeout(function(){
        	light.position.copy(camera.position).multiplyScalar(2);
        	pointLight.position.copy(camera.position).multiplyScalar(3);
            renderer.setClearColor(0x000000,0);
            camera.updateMatrixWorld();

			// find intersections

			//raycaster.setFromCamera( mouse, camera );
			raycaster = projector.pickingRay( mouse2D.clone(), camera );
			var intersects = raycaster.intersectObjects( objects );
			
			if ( intersects.length > 0 ) {

				if ( INTERSECTED.object != intersects[ 0 ].object ) {

					if ( INTERSECTED.object ) INTERSECTED.object.material.emissive.setHex( INTERSECTED.object.currentHex );

					INTERSECTED.object = intersects[ 0 ].object;
					INTERSECTED.object.currentHex = INTERSECTED.object.material.emissive.getHex();
					INTERSECTED.object.material.emissive.setHex( VARS.CAMERACUBE.SELECTION );

				}

			} else {

				if ( INTERSECTED.object ) INTERSECTED.object.material.emissive.setHex( INTERSECTED.object.currentHex );

				INTERSECTED.object = null;

			}

            renderer.render(scene, camera);
            requestAnimationFrame(renderTasks);


        },1000/fps);
    };
    requestAnimationFrame(renderTasks);
}

function createCube(){
	var cube=new THREE.Object3D();
	var backgroundCube= new THREE.Mesh(new THREE.BoxGeometry(4.9,4.9,4.9), new THREE.MeshBasicMaterial({color:VARS.CAMERACUBE.TEXTCOLOR}));//Primitives.CreateBox(4.9,4.9,4.9,VARS.CAMERACUBE.TEXTCOLOR);
	cube.add(backgroundCube);
	var faceGeometry=new THREE.BoxGeometry(3,3,1);
	
	var texture = THREE.ImageUtils.loadTexture("img/ES_MX/CameraCube/front.png");

	texture.minFilter=THREE.LinearFilter;


    var frontFace = new THREE.Mesh(	faceGeometry, 
    							new THREE.MeshPhongMaterial({
    								color:VARS.CAMERACUBE.COLOR,
							        map: texture,//THREE.ImageUtils.loadTexture("img/ES_MX/CameraCube/front.png"),
							        side: THREE.DoubleSide,
							        transparent:true,
							        opacity:1,
    							})
    						);
	frontFace.position.y=-2;
   	frontFace.rotation.x=Math.PI/2;
   	frontFace.rotation.y=Math.PI;

    frontFace.name=VARS.CAMERA.FRONT;
    cube.add(frontFace);
    
    
    texture = THREE.ImageUtils.loadTexture("img/ES_MX/CameraCube/back.png");
	texture.minFilter=THREE.LinearFilter;
    var backFace = new THREE.Mesh(	faceGeometry, 
    							new THREE.MeshPhongMaterial({
    								color:VARS.CAMERACUBE.COLOR,
							        map: texture,
							        side: THREE.DoubleSide,
							        transparent:true,
							        opacity:1,
    							})
    						);
    
    cube.add(backFace);
    backFace.rotation.x = Math.PI/2;
    backFace.position.y = 2;
    backFace.name = VARS.CAMERA.BACK;
    
    texture = THREE.ImageUtils.loadTexture("img/ES_MX/CameraCube/left.png");
	texture.minFilter = THREE.LinearFilter;
    var leftFace = new THREE.Mesh(	faceGeometry, 
    							new THREE.MeshPhongMaterial({
    								color:VARS.CAMERACUBE.COLOR,
							        map: texture,
							        side: THREE.DoubleSide,
							        transparent:true,
							        opacity:1,
    							})
    						);

    cube.add(leftFace);
    leftFace.position.x=- 2;
    leftFace.rotation.y = Math.PI/2;
    leftFace.rotation.x = Math.PI/2;
    leftFace.name = VARS.CAMERA.LEFT;
    
    texture = THREE.ImageUtils.loadTexture("img/ES_MX/CameraCube/right.png");
	texture.minFilter = THREE.LinearFilter;
    var rightFace = new THREE.Mesh(	faceGeometry, 
    							new THREE.MeshPhongMaterial({
    								color:VARS.CAMERACUBE.COLOR,
							        map: texture,
							        side: THREE.DoubleSide,
							        transparent:true,
							        opacity:1,
    							})
    						);
    
    cube.add(rightFace);
    rightFace.position.x=2;
    rightFace.rotation.x=Math.PI/2;
	rightFace.rotation.y=-Math.PI/2;
    rightFace.name=VARS.CAMERA.RIGHT;

    texture = THREE.ImageUtils.loadTexture("img/ES_MX/CameraCube/top.png");
	texture.minFilter=THREE.LinearFilter;
    var topFace = new THREE.Mesh(	faceGeometry, 
    							new THREE.MeshPhongMaterial({
    								color:VARS.CAMERACUBE.COLOR,
							        map: texture,
							        side: THREE.DoubleSide,
							        transparent:true,
							        opacity:1,
    							})
    						);
	cube.add(topFace);
    topFace.position.z=2;
	
	topFace.rotation.y=Math.PI;
    topFace.name=VARS.CAMERA.TOP;
    
    texture = THREE.ImageUtils.loadTexture("img/ES_MX/CameraCube/bottom.png");
	texture.minFilter=THREE.LinearFilter;
    var bottomFace = new THREE.Mesh(	faceGeometry, 
    							new THREE.MeshPhongMaterial({
    								color:VARS.CAMERACUBE.COLOR,
							        map: texture,
							        side: THREE.DoubleSide,
							        transparent:true,
							        opacity:1,
    							})
    						);

	cube.add(bottomFace);
    bottomFace.position.z=-2;
    bottomFace.rotation.x=Math.PI;
    bottomFace.rotation.y=Math.PI;
    bottomFace.name=VARS.CAMERA.BOTTOM;
    
    /*
    	l=left
    	r=right
    	b=bottom
    	t=top
    	f=front
    	k=back
    */

    var cornerGeometry=new THREE.BoxGeometry(1,1,1);

    var flb_corner = new THREE.Mesh(cornerGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    flb_corner.name = VARS.CAMERA.LEFRBO;
    var flt_corner = new THREE.Mesh(cornerGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    flt_corner.name = VARS.CAMERA.LEFRTO;
    var frb_corner = new THREE.Mesh(cornerGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    frb_corner.name = VARS.CAMERA.FRRIBO;
    var frt_corner = new THREE.Mesh(cornerGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    frt_corner.name = VARS.CAMERA.FRRITO;
    var krb_corner = new THREE.Mesh(cornerGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    krb_corner.name = VARS.CAMERA.RIBABO;
    var krt_corner = new THREE.Mesh(cornerGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    krt_corner.name = VARS.CAMERA.RIBATO;
    var klb_corner = new THREE.Mesh(cornerGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    klb_corner.name = VARS.CAMERA.BALEBO;
    var klt_corner = new THREE.Mesh(cornerGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    klt_corner.name = VARS.CAMERA.BALETO;

    var edgeGeometry= new THREE.BoxGeometry(1,1,3);

    var fl_edge = new THREE.Mesh(edgeGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    fl_edge.name=VARS.CAMERA.LEFR;
    var fr_edge = new THREE.Mesh(edgeGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    fr_edge.name=VARS.CAMERA.FRRI;
    var ft_edge = new THREE.Mesh(edgeGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    ft_edge.name=VARS.CAMERA.FRTO;
    var fb_edge = new THREE.Mesh(edgeGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    fb_edge.name=VARS.CAMERA.FRBO;
    var kl_edge = new THREE.Mesh(edgeGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    kl_edge.name=VARS.CAMERA.BALE;
    var kr_edge = new THREE.Mesh(edgeGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    kr_edge.name=VARS.CAMERA.RIBA;
    var kt_edge = new THREE.Mesh(edgeGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    kt_edge.name=VARS.CAMERA.BATO;
    var kb_edge = new THREE.Mesh(edgeGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    kb_edge.name=VARS.CAMERA.BABO;
    var tl_edge = new THREE.Mesh(edgeGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    tl_edge.name=VARS.CAMERA.LETO;
    var tr_edge = new THREE.Mesh(edgeGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    tr_edge.name=VARS.CAMERA.RITO;
    var bl_edge = new THREE.Mesh(edgeGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    bl_edge.name=VARS.CAMERA.LEBO;
    var br_edge = new THREE.Mesh(edgeGeometry, new THREE.MeshPhongMaterial({color:VARS.CAMERACUBE.COLOR}));
    br_edge.name=VARS.CAMERA.RIBO;

	cube.add(fl_edge);
	fl_edge.translateX(-2);
	fl_edge.translateY(-2);

	cube.add(fr_edge);
	fr_edge.translateX(2);
	fr_edge.translateY(-2);	

	cube.add(ft_edge);
	ft_edge.translateY(-2);
	ft_edge.translateZ(2);
	ft_edge.rotation.y=Math.PI/2;
	
	cube.add(fb_edge);
	fb_edge.translateY(-2);
	fb_edge.translateZ(-2);
	fb_edge.rotation.y=Math.PI/2;

	cube.add(kl_edge);
	kl_edge.translateX(-2);
	kl_edge.translateY(2);

	cube.add(kr_edge);
	kr_edge.translateX(2);
	kr_edge.translateY(2);

	cube.add(kt_edge);
	kt_edge.translateY(2);
	kt_edge.translateZ(2);
	kt_edge.rotation.y=Math.PI/2;

	cube.add(kb_edge);
	kb_edge.translateY(2);
	kb_edge.translateZ(-2);
	kb_edge.rotation.y=Math.PI/2;

	cube.add(tl_edge);
	tl_edge.translateX(-2);
	tl_edge.translateZ(2);
	tl_edge.rotation.x=Math.PI/2;
	
	cube.add(tr_edge);
	tr_edge.translateX(2);
	tr_edge.translateZ(2);
	tr_edge.rotation.x=Math.PI/2;
	
	cube.add(bl_edge);
	bl_edge.translateX(-2);
	bl_edge.translateZ(-2);
	bl_edge.rotation.x=Math.PI/2;
	
	cube.add(br_edge);
	br_edge.translateX(2);
	br_edge.translateZ(-2);
	br_edge.rotation.x=Math.PI/2;

	cube.add(flb_corner);
	flb_corner.position.set(-2,-2,-2);
	cube.add(flt_corner);
	flt_corner.position.set(-2,-2,2);
	cube.add(frb_corner);
	frb_corner.position.set(2,-2,-2);
	cube.add(frt_corner);
	frt_corner.position.set(2,-2,2);
	
	cube.add(krb_corner);
	krb_corner.position.set(2,2,-2);
	cube.add(krt_corner);
	krt_corner.position.set(2,2,2);
	cube.add(klb_corner);
	klb_corner.position.set(-2,2,-2);
	cube.add(klt_corner);
	klt_corner.position.set(-2,2,2);
	cube.scale.set(VARS.CAMERACUBE.SIZE,VARS.CAMERACUBE.SIZE,VARS.CAMERACUBE.SIZE);
	cube.translateY(1);
	cube.rotateOnAxis(new THREE.Vector3(0,1,0), -Math.PI/2);
	cube.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI/2);

	return cube;
}

CameraCube.prototype.setPosition=function(top, left){
	$(this.container).css({
        position: "absolute",
        top: top + "px",
        left: left + "px"
    });
};

/*============== Camera Cube ===================*/




/* ============== Add & Remove ================*/
$(agregar).on("click",function() {

     isCtrlDown = false;
     scene.add( rollOverMesh );
     //$('#principal').css({'cursor': 'url(cursors/add.cur), pointer'});
 });

$(borrar).on("click",function() {

   isCtrlDown = true;
   scene.remove( rollOverMesh );
   //$('#principal').css({'cursor': 'url(cursors/remove.cur), pointer'});
  });
/* ============== Add & Remove ================*/
// revolutions per second
var angularSpeed = 0.2; 
var lastTime = 0;
  var contenedor;
// this function is executed on each animation frame
function animar(){
	setTimeout( function() {
	  	contenedor = document.getElementById( 'cuboMuestra' );
		document.body.appendChild( contenedor );
	    // update
	    var time = (new Date()).getTime();
	    var timeDiff = time - lastTime;
	    var angleChange = angularSpeed * timeDiff * Math.PI / 1000;
	    cuboMuestra.rotation.y += angleChange;
	    cuboMuestra.rotation.x += angleChange;
	    //cube.rotation.z += angleChange;
	    lastTime = time;

	    // render
	    
			renderizador.setClearColor(0x00000,0);
	    // request new frame
	    requestAnimationFrame(function(){
	        animar();
	    });
	}, 1000 / 30 );
	renderizador.render(escena, camara);
}

// renderer
var renderizador = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderizador.setSize(100, 100);
document.getElementById( 'cuboMuestra' ).appendChild(renderizador.domElement);

//renderizador.antialias=true;

// camera
var camara = new THREE.PerspectiveCamera(45, 1, 1, 1000);
camara.position.z = 500;

// scene
var escena = new THREE.Scene();

//luz
luz = new THREE.DirectionalLight( 0xFFFFFF, 1 );
luz.position.set( 0, 0, 40 );
escena.add(luz);
        
// cuboMuestra
cuboMuestra = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 200), new THREE.MeshPhongMaterial({color:0xffffff,transparent:true, side:THREE.DoubleSide}));
//cuboMuestra.overdraw = true;
//cuboMuestra.material.map = THREE.ImageUtils.loadTexture( "textures/Hojas.png");

escena.add(cuboMuestra);

// start animation
animar();

  

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var materialCubo=new THREE.MeshPhongMaterial({color:0xffffff,ambient:0xffffff,transparent:true, side:THREE.DoubleSide});
var tex2 = THREE.ImageUtils.loadTexture( "textures/1/1.png");
tex2.needsUpdate = true;
materialCubo.map = tex2;
materialCubo.identificador="1/1";
materialCubo.needsUpdate = true;

var container;
var camera, scene, renderer;
var projector, plane, cube;
var mouse2D, mouse3D, raycaster,
rollOveredFace, isShiftDown = false,
theta = 45 * 0.5, isCtrlDown = false;

var rollOverMesh, rollOverMaterial;
var voxelPosition = new THREE.Vector3(), tmpVec = new THREE.Vector3(), normalMatrix = new THREE.Matrix3();
var cubeGeo, cubeMaterial;
var i, intersector;

var objects = [];
var gui;
init();
animate();
var parameters;

var soundRemove, soundAdd, soundBackground;
var musicPlaying=true;effectsPlaying=true;

var light;
var moon,ovni,skyBoxLuna,skyBoxExtraterrestres;
var cubeOpacity=1;
var plano;

var fileInput=document.createElement('input');
fileInput.setAttribute("type", "file");
fileInput.multiple=true;
fileInput.accept=".bloc";

$(fileInput).on("change",function() {
            var file;
   var objects;
            for (var fileIndex = 0; fileIndex < this.files.length; fileIndex++) {
    file = this.files[fileIndex];
                loadBLOC(file);
            }
        });
$(fileInput).on("click",function() {this.value = '';});

function init() {


	$("#btnSesion").on('click',function (ev){
		if($('#etqUsername').text().search("Anónimo")!= -1){

             $('#mensajePassword').text("");
             $('#mensajeCorreo').text("");
             $('#inputPassword').val("");
             $('#inputCorreo').val("");
             $('#LogIn').modal('show');
        }
        else
        {
            $('#etqUsername').text("Anónimo");
            $('#imgProfile').attr("src", "images/avatar.png");
            $('#btnSesion').val('Iniciar Sesión');
             window.Android.CerrarSesion();

        }


	});


	$("#botonRegistrar").on('click',function (ev){
		window.open("http://www.colibri3d.com/admin/");
	});

	$("#botonFace").on('click',function (ev){
		 window.Android.IniciarSesionFacebook();
	});

	 $('#registro').validate({
   	 rules:{
      inputCorreo:{required:true,email:true},
      inputPassword:{required:true}
    },
    submitHandler: function (form) {
      event.preventDefault();
      $.ajax({
        url: 'http://www.colibri3d.com/appweb/iniciaSesion2.php',
        type: 'POST',
        data: $(form).serialize(),
        dataType: "json",
      beforeSend : function() {
        $('#botonIniciar').attr('disabled', 'disabled');
      },
      success: function(result) {
        if (result.username== "!existe") {

            //console.log(result);
        	$('#mensajeCorreo').text("Correo no existente");
        	$('#mensajePassword').text("");
        	$('#botonIniciar').removeAttr("disabled");
        } 
        else if(result.username == "redes")
        {
			//console.log("redes sociales");
			$('#mensajePassword').text("Estas registrado en redes sociales");
			$('#mensajeCorreo').text("");
			$('#botonIniciar').removeAttr("disabled");
        }
        else if(result.username == "!passw")
        {
        	//console.log("no pass");
        	$('#mensajePassword').text("Password incorrecto");
        	$('#mensajeCorreo').text("");
        	$('#botonIniciar').removeAttr("disabled");
        }
        else {
            /*si el correo y contraseña son correctas */
            $('#botonIniciar').removeAttr("disabled");
           $("#btnSesion").val('Cerrar sesion');
        	var url = "http://www.colibri3d.com/admin/3dusr/"+result.folder+"/"+result.avatar;
        	$('#etqUsername').text(result.username);
        	$('#imgProfile').attr("src", url);
        	$('#LogIn').modal('hide');
        	window.Android.GuardaSesion(result.username, result.folder, result.avatar);

			};
	      },
            error: function() {
                   console.log('error');
                }

	      });

	      return false;
	    }
	  });
	
	$("#botonEstandar").on('click',function (ev){
		plano.visible=true;
		ovni.visible=false;
		skyBoxExtraterrestres.visible=false;

		moon.visible=false;
		skyBoxLuna.visible=false;
	});
	$("#botonLuna").on('click',function (ev){
		plano.visible=false;
		moon.visible=true;
		skyBoxLuna.visible=true;

		ovni.visible=false;
		skyBoxExtraterrestres.visible=false;
	});
	$("#botonInvasion").on('click',function (ev){
		plano.visible=false;
		ovni.visible=true;
		skyBoxExtraterrestres.visible=true;

		moon.visible=false;
		skyBoxLuna.visible=false;
	});
	$("#music").on('click',function (ev){
		if(musicPlaying)
		{
			musicPlaying=false;
			$("#music").attr("src", "icons/Mute.png");
			soundBackground.pause();
		}
		else
		{
			musicPlaying=true;
			$("#music").attr("src", "icons/Sound.png");
			soundBackground.play();
		}
	});
	$("#effects").on('click',function (ev){
		if(effectsPlaying)
		{
			effectsPlaying=false;
			$("#effects").attr("src", "icons/Mute.png");
		}
		else
		{
			effectsPlaying=true;
			$("#effects").attr("src", "icons/Sound.png");
		}
	});
	$("#music_slider").noUiSlider({
        connect: "lower",
        range: {
            min: 1,
            max: 10
        },
        start: 5,
        step: 1	
	});
	$("#music_slider").on({
		slide:function(){
        	soundBackground.volume($("#music_slider").val()/10);
        	$("#volumenMusic").text(Math.round($("#music_slider").val()));
        }
	});
	$("#transparency_slider").noUiSlider({
        connect: "lower",
        range: {
            min: 2,
            max: 10
        },
        start: 10,
        step: 1	
	});
	$("#transparency_slider").on({
		slide:function(){
			cubeOpacity=$("#transparency_slider").val()/10;
			cuboMuestra.material.opacity=cubeOpacity;
			//materialCubo.opacity=cubeOpacity;
			//Cambio 
			var tmp=materialCubo.identificador;//
			materialCubo=new THREE.MeshPhongMaterial({color:materialCubo.color,ambient:materialCubo.color,transparent:true, side:THREE.DoubleSide, opacity: cubeOpacity, map: materialCubo.map});
			materialCubo.identificador=tmp;//

			materialCubo.needsUpdate = true;
			
        }
	});
	
	$("#effect_slider").noUiSlider({
        connect: "lower",
        range: {
            min: 1,
            max: 10
        },
        start: 10,
        step: 1	                
	});
	$("#effect_slider").on({
		slide:function(){
        	soundRemove.volume($("#effect_slider").val()/10);
        	soundAdd.volume($("#effect_slider").val()/10);
        	$("#volumenEffects").text(Math.round($("#effect_slider").val()));
        }
	});
	soundRemove = new Howl({urls: ["sound/remove.wav"]})
	soundAdd = new Howl({urls: ["sound/add.wav"]})
	soundBackground = new Howl({
	  //urls: ['sound/background.mp3'],
	  urls: ['sound/moonlight1.mp3'],
	  autoplay: true,
	  loop: true,
	  volume: 0.5
	});
	/*var audio = new Audio('sound/background.mp3');
	audio.play();*/
	container = document.getElementById( 'principal' );

	document.body.appendChild( container );
	//$('#principal').css({'cursor': 'url(cursors/add.cur), pointer'});
	/*var info = document.createElement('div');
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	
	info.innerHTML = '<a href="ayuda" target="_blank" class="inform">Informaci&oacute;n</a>';//<br><button onclick="myFunction()">Guardar</button>';
	
	container.appendChild( info );
	*/
	
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;	
	
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 30000;
	
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	
	camera.position.set(-500,400,320);

	/*SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;	
	Camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.01, 10000);
    Camera.position.y = -250;
    Camera.position.z = 200;
    Camera.position.x = 160;
    Camera.lookAt(new THREE.Vector3(0, 0, 0));
    Camera.name = "Camera";
    Camera.up.set(0, 0, 1);
    Camera.updateMatrix();*/

	scene = new THREE.Scene();

	/*flashlight = new THREE.SpotLight(0xffffff,4,40);
	camera.add(flashlight);
	flashlight.position.set(0,0,1);
	flashlight.target = camera;				
	scene.add(flashlight);*/
	//headlight = THREE.AmbientLight( 0xFFFFFF );
	headlight = new THREE.DirectionalLight( 0xFFFFFF, 0.3 );
	//headlight.castShadow = true;
	scene.add (headlight);

	rollOverGeo = new THREE.BoxGeometry( 5, 5, 5 );
	rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0x3377ff, opacity: 0.2, transparent: true } );
	rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	scene.add( rollOverMesh );

	cubeGeo = new THREE.BoxGeometry( 5, 5, 5 );

	projector = new THREE.Projector();


	var size = 200, step = 5;

	var geometry = new THREE.Geometry();

	for ( var i = - size; i <= size; i += step ) {

		geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
		geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

		geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
		geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );
	}
	var geometria=new THREE.PlaneGeometry( 400, 400, 1, 1 );
	var materialplano=new THREE.MeshPhongMaterial( { color: 0x99aaff, ambient:0x99aaff, side: THREE.DoubleSide});//,opacity: 0.5, transparent: true} );
	//extraterrestres
	plano=new THREE.Mesh(geometria, materialplano);
	plano.rotation.x=-(Math.PI/2);
	plano.position.y=-.5;
	scene.add(plano);
	plano.receiveShadow=true;
	plano.visible=false;

	var material = new THREE.LineBasicMaterial( { color: 0x303030, opacity: 0.3, transparent: false } );

	var line = new THREE.Line( geometry, material );
	line.type = THREE.LinePieces;
	scene.add( line );

	plane = new THREE.Mesh( new THREE.PlaneGeometry( 400, 400 ), new THREE.MeshBasicMaterial() );
	plane.rotation.x = - Math.PI / 2;
	plane.visible = false;
	scene.add( plane );

	objects.push( plane );

	mouse2D = new THREE.Vector3( 0, 10000, 0.5 );


	var ambientLight = new THREE.AmbientLight( 0x808080 );
	scene.add( ambientLight );
	light = new THREE.DirectionalLight( 0xFFFFFF, 0.7 );
	 light.position.set( 400, 400, 400 );
	 //light.target.position.copy( scene.position );
	 /*light.castShadow = true;
	 light.shadowCameraLeft = -60;
	 light.shadowCameraTop = -60;
	 light.shadowCameraRight = 60;
	 light.shadowCameraBottom = 60;*/
	 //light.shadowCameraNear = 200;
	 //light.shadowCameraFar = 2000;
	 //light.shadowBias = -.0001;
	 light.shadowMapWidth = light.shadowMapHeight = 2048;
	 //light.shadowDarkness = .3;
	 light.shadowCameraRight    =  400;
	 light.shadowCameraLeft     = -400;
	 light.shadowCameraTop      =  400;
	 light.shadowCameraBottom   = -400;
	 light.castShadow=true;
	 light.shadowDarkness = 0.5;
	 //light.shadowCameraVisible = true;
	 scene.add( light );

	//scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0025 );

	renderer = new THREE.WebGLRenderer();
	renderer.shadowMapEnabled=true;
	renderer.shadowMapSoft=true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;
	
	renderer.setClearColor( 0xc0c0c0 );
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );
	controls = new THREE.OrbitControls( camera, renderer.domElement );


	/* ===== Camera Cube ======= */
	var cameraCube = new CameraCube({Renderer: renderer, Camera:camera, Controls:controls}, container)
	/* ===== Camera Cube ======= */


	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );

	window.addEventListener( 'resize', onWindowResize, false );
	
	/*var imagePrefix = "images/dawnmountain-";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";*/
	/*var imagePrefix = "images/lake1_";
	var directions  = ["ft", "bk", "up", "dn", "rt", "lf"];
	var imageSuffix = ".jpg";*/
	

	//gui = new dat.GUI({ autoPlace: false });
	/*gui = new dat.GUI();
	parameters = 
	{
		color: "#26A9E0", // color (change "#" to "0x")
		opacity: 1,
		visible: true,
		Textura: "-Color",
		guardarSTL: function(){myFunctionSTL()}
	};
	//gui.addColor( parameters, 'color' );
	var cubeColor = gui.addColor( parameters, 'color' ).name('Color').listen();
	cubeColor.onChange(function(value) // onFinishChange
	{   cube.material.color.setHex( value.replace("#", "0x") );   });
	var cubeOpacity = gui.add( parameters, 'opacity' ).min(0).max(1).step(0.01).name('Opacidad').listen();
	cubeOpacity.onChange(function(value)
	{   cube.material.opacity = value;   });

	var lst="-Color,Agua".split(',');

	var Textura = gui.add(parameters, 'Textura', lst );
	gui.add( parameters, 'guardarSTL' ).name("Guardar STL");
	gui.open();*/
	
	$("#rotate-right").on('mouseup',function(){
		controls.rotateLeft(degToRad(-10));
		controls.update();
	});
	$("#rotate-left").on('mouseup',function(){
		controls.rotateLeft(degToRad(10));
		controls.update();
	});
	$("#rotate-up").on('mouseup',function(){
		controls.rotateUp(degToRad(-10));
		controls.update();
	});
	$("#rotate-down").on('mouseup',function(){
		controls.rotateUp(degToRad(10));
		controls.update();
	});

	$("#cameraHome").on('mouseup',function(){
		var viewVector = new THREE.Vector3(-500,400,320);
		camera.position.copy(viewVector);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        controls.position0 = viewVector;
        controls.target = new THREE.Vector3(0, 0, 0);
        controls.update();
	});

	//extraterrestres
	var imagePrefix = "images/darkskies_";
	var directions  = ["ft", "bk", "up", "dn", "rt", "lf"];
	var imageSuffix = ".jpg";
	var skyGeometry = new THREE.BoxGeometry( 20000, 20000, 20000 );				
	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	skyBoxExtraterrestres = new THREE.Mesh( skyGeometry, skyMaterial );
	skyBoxExtraterrestres.visible=false;
	scene.add( skyBoxExtraterrestres );

	//luna
	var imagePrefix = "images/cwd_";
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	skyBoxLuna = new THREE.Mesh( skyGeometry, skyMaterial );
	scene.add( skyBoxLuna );
	
	//luna
	moonGeo=new THREE.SphereGeometry( 400, 30, 30);
	moonMaterial = new THREE.MeshBasicMaterial({color:0xFF0000});
	//moonMaterial.ambient = cubeMaterial.color;
	moon = new THREE.Mesh( moonGeo, moonMaterial );
	
	
	//moon.material.opacity = parameters.opacity;
	//moon.material.transparent = true;
	//scene.add(moon);
	moon.translateY(-280);
	var squareGeo=new THREE.BoxGeometry( 800, 800, 800);
	var square= new THREE.Mesh(squareGeo, new THREE.MeshBasicMaterial(  ));
	//scene.add(square);
	square.translateY(400);
	
	var bspA = new ThreeBSP(moon);
    var bspB = new ThreeBSP(square);
    moon = bspA.subtract(bspB).toMesh(new THREE.MeshPhongMaterial({shading: THREE.SmoothShading, side: THREE.DoubleSide}));

    moon.geometry.computeFaceNormals();
	moon.geometry.computeVertexNormals();
	moon.matrixAutoUpdate = false;
	moon.updateMatrix();
	moon.material.map = THREE.ImageUtils.loadTexture( "images/moon.jpg");
	moon.translateY(-.5);
	moon.updateMatrix();
	//moon.castShadow = true;
	moon.receiveShadow = true;
	//moon.visible=false;
	scene.add(moon);

	//extraterrestres
	var contents;
	var oReq = new XMLHttpRequest();
	oReq.open("GET", "modelos/ovni.stl", true);
	oReq.responseType = "arraybuffer";
	oReq.onload = function (oEvent) {
	  var arrayBuffer = oReq.response; // Note: not oReq.responseText
	  if (arrayBuffer) {
	    var contents = new Uint8Array(arrayBuffer);
	    var ovniGeometry = new THREE.STLLoader().parse(arrayBuffer);
	    THREE.GeometryUtils.center(ovniGeometry);
		ovni=new THREE.Mesh(ovniGeometry, new THREE.MeshPhongMaterial({shading: THREE.SmoothShading, side: THREE.DoubleSide}));
		ovni.geometry.computeFaceNormals();
		ovni.geometry.computeVertexNormals();
		computeUvs(ovni.geometry);
		ovni.matrixAutoUpdate = false;
		ovni.updateMatrix();
		var ovniTexture = THREE.ImageUtils.loadTexture( "images/nave.png");
		ovniTexture.wrapS = ovniTexture.wrapT = THREE.ClampToEdgeWrapping;
		//ovniTexture.repeat.set( 1, 1 );					
		ovni.translateY(-100.2);						
	    ovni.material.map = ovniTexture;
	    var rotMatrix = new THREE.Matrix4();
        rotMatrix.makeRotationX(-Math.PI/2);
        ovniGeometry.applyMatrix(rotMatrix);
        ovniGeometry.computeFaceNormals();
		ovni.updateMatrix();
		ovni.name="OVNI";
		//ovni.castShadow = true;
		ovni.receiveShadow = true;
        //ovni.translateY(-5);
		scene.add(ovni);
		ovni.visible=false;
	  }
	};

	oReq.send(null);

	//piedra
	/*oReq = new XMLHttpRequest();
	oReq.open("GET", "modelos/piedra alta.stl", true);
	oReq.responseType = "arraybuffer";
	var piedra;
	oReq.onload = function (oEvent) {
	  var arrayBuffer = oReq.response; // Note: not oReq.responseText
	  if (arrayBuffer) {
	    var contents = new Uint8Array(arrayBuffer);
	    var piedraGeometry = new THREE.STLLoader().parse(arrayBuffer);
	    THREE.GeometryUtils.center(piedraGeometry);
		piedra=new THREE.Mesh(piedraGeometry, new THREE.MeshPhongMaterial({shading: THREE.SmoothShading, side: THREE.DoubleSide}));
		piedra.geometry.computeFaceNormals();
		piedra.geometry.computeVertexNormals();
		computeUvs(piedra.geometry);
		piedra.matrixAutoUpdate = false;
		piedra.updateMatrix();
		//var piedraTexture = THREE.ImageUtils.loadTexture( "images/mountain.jpg");
		//piedraTexture.wrapS = piedraTexture.wrapT = THREE.ClampToEdgeWrapping
		//piedraTexture.repeat.set( 1, 10);					
		piedra.translateY(100.2);	
		//piedra.rotation.x = - Math.PI / 2;
        piedra.updateMatrix();		
        var rotMatrix = new THREE.Matrix4();
        rotMatrix.makeRotationX(-Math.PI/2);
        piedraGeometry.applyMatrix(rotMatrix);			
	    piedra.material.map = THREE.ImageUtils.loadTexture( "images/mountain.jpg");
	    

        piedraGeometry.computeFaceNormals();
		piedra.updateMatrix();
		piedra.name="piedra";
		//piedra.castShadow = true;
		piedra.receiveShadow = true;
        //piedra.translateY(-5);
		scene.add(piedra);
		piedra.visible=true;
	  }
	};

	oReq.send(null);*/
	
	
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function getRealIntersector( intersects ) {

	for( i = 0; i < intersects.length; i++ ) {

		intersector = intersects[ i ];

		if ( intersector.object != rollOverMesh ) {

			return intersector;

		}

	}

	return null;

}

function setVoxelPosition( intersector ) {

	if ( intersector.face === null ) {

		console.log( intersector )

	}

	normalMatrix.getNormalMatrix( intersector.object.matrixWorld );

	tmpVec.copy( intersector.face.normal );
	tmpVec.applyMatrix3( normalMatrix ).normalize();

	voxelPosition.addVectors( intersector.point, tmpVec );
	voxelPosition.divideScalar( 5 ).floor().multiplyScalar( 5 ).addScalar( 2.5 );

}
var quitoCubo=false;
function onDocumentMouseMove( event ) {
	if(isCtrlDown && !quitoCubo)
	{
		//scene.remove( rollOverMesh );
		quitoCubo=true;
	}
	else if(!isCtrlDown && quitoCubo)
	{
		//scene.add( rollOverMesh );
		quitoCubo=false;
	}
	event.preventDefault();

	mouse2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
var lastClickTime = 0;
function onDocumentMouseDown( event ) {
	
	event.preventDefault();

	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {

		intersector = getRealIntersector( intersects );


		if ( isCtrlDown ) {

			if ( intersector.object != plane ) {

				scene.remove( intersector.object );
				objects.splice( objects.indexOf( intersector.object ), 1 );
				if(effectsPlaying)
					soundRemove.play();
			}


		} else if(event.button==0) {
			/*var current = new Date().getTime();
			var delta = current - lastClickTime;
			if (delta < 350) 
			{
				return;
			}
				else
			{*/
				intersector = getRealIntersector( intersects );
				setVoxelPosition( intersector );
				//cubeMaterial=null;
				/*cubeMaterial = new THREE.MeshPhongMaterial();
				cubeMaterial.color.setHex( cubeColor.replace("#", "0x") );
				cubeMaterial.ambient = cubeMaterial.color;*/
				var voxel = new THREE.Mesh( cubeGeo, materialCubo);
				voxel.geometry.buffersNeedUpdate = true;
				voxel.geometry.uvsNeedUpdate = true;
				voxel.castShadow = true;
				//voxel.receiveShadow = true;
				//voxel.material.opacity = cubeOpacity;
				//voxel.material.transparent = true;
				voxel.position.copy( voxelPosition );
				//voxel.matrixAutoUpdate = false;
				//voxel.updateMatrix();
				//voxel.material.map = THREE.ImageUtils.loadTexture( "textures/"+parameters.Textura+".png");

				/*if(parameters.Textura==="-Color")
				{
					voxel.material.color.setHex( parameters.color.replace("#", "0x") );
					
				}*/
				scene.add( voxel );
				objects.push( voxel );
				if(effectsPlaying)
					soundAdd.play();

			//}
		}
	}				
	//lastClickTime = current;
}

function exportScene ( exporterClass ) {

	var exporter = new exporterClass();

	var output = exporter.parse( scene );

	if ( exporter instanceof THREE.ObjectExporter ) {
		output = JSON.stringify( output, null, '\t' );
		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );
	}

	var blob = new Blob( [ output ], { type: 'text/plain' } );
	saveAs(blob, "BlocksWeb.stl");

}			

function onDocumentKeyDown( event ) {
	switch( event.keyCode ) {
		case 16: isShiftDown = true; break;
		case 17: isCtrlDown = true; 
			scene.remove( rollOverMesh );
			//$('#principal').css({'cursor': 'url(cursors/remove.cur), pointer'});
			break;
	}
}

function onDocumentKeyUp( event ) {

	switch ( event.keyCode ) {

		case 16: isShiftDown = false; break;
		case 17: isCtrlDown = false; 
			scene.add( rollOverMesh );
			//$('#principal').css({'cursor': 'url(cursors/add.cur), pointer'});
			break;

	}

}


function animate() {
	setTimeout( function() {
		requestAnimationFrame( animate );
	}, 1000 / 15 );
	render();

}

function render() {
	headlight.position.copy(camera.position);

	raycaster = projector.pickingRay( mouse2D.clone(), camera );

	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {

		intersector = getRealIntersector( intersects );

		if ( intersector ) {

			setVoxelPosition( intersector );
			rollOverMesh.position = voxelPosition;
		}

	}


	renderer.render( scene, camera );

}
function openBlock()
{
	$("#scenaryControls").hide();
	$(fileInput).click();
}
function myFunctionSTL()
{
	scene.remove( rollOverMesh );
	scene.remove( plane );
	scene.remove( moon );
	scene.remove( ovni );
	scene.remove( skyBoxLuna );
	scene.remove( skyBoxExtraterrestres );
	scene.remove( plano );
	exportScene( THREE.STLExporter );
	scene.add( plane );
	scene.add( rollOverMesh );
	scene.add( moon );
	scene.add( ovni );
	scene.add( skyBoxLuna );
	scene.add( skyBoxExtraterrestres );
	scene.add( plano );
}
function myFunctionBloc()
{
	scene.remove( rollOverMesh );
	scene.remove( plane );
	scene.remove( moon );
	scene.remove( ovni );
	scene.remove( skyBoxLuna );
	scene.remove( skyBoxExtraterrestres );
	scene.remove( plano );
	var data=generateBLOCFromScene(scene);
	scene.add( plane );
	scene.add( rollOverMesh );
	scene.add( moon );
	scene.add( ovni );
	scene.add( skyBoxLuna );
	scene.add( skyBoxExtraterrestres );
	scene.add( plano );
	var blob = new Blob([data], {
        type: 'application/octet-stream'
    });
    saveAs(blob, "BlocksWeb.bloc");
}
function degToRad(value) 
{
    return value * Math.PI / 180;
}
function computeUvs(geometry) {
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
$("#owl-demo").owlCarousel({
  items : 10,
  itemsDesktop : [1199, 10],
  itemsDesktopSmall : [979, 9],
  itemsTablet : [768, 8],
  itemsMobile : [479, 7] 
});
$('#meshcolor').spectrum(new colorPickerOpts(function(color){
	cubeColor=color.toHexString();
	$("#meshcolor").css("background-color",cubeColor);
	
	var mt=new THREE.MeshPhongMaterial({color:cubeColor,transparent:true, side:THREE.DoubleSide, opacity: cubeOpacity});
	textura="1/1.png";
	mt.identificador=textura.split(".")[0];				
	//textura="textures/"+textura;
	var tex = THREE.ImageUtils.loadTexture( "textures/"+textura);
	tex.needsUpdate = true;
	mt.map = tex;				
	cuboMuestra.material = mt;
	cuboMuestra.geometry.buffersNeedUpdate = true;
	cuboMuestra.geometry.uvsNeedUpdate = true;
	mt.needsUpdate = true;

	//materialCubo
	materialCubo=new THREE.MeshPhongMaterial({color:cubeColor,ambient:cubeColor,transparent:true, side:THREE.DoubleSide, opacity: cubeOpacity});
	materialCubo.identificador=textura.split(".")[0];
	var tex2 = THREE.ImageUtils.loadTexture( "textures/"+textura);
	tex2.needsUpdate = true;
	materialCubo.map = tex2;
	materialCubo.needsUpdate = true;
}));

$("#gridMinorLineColor").spectrum(new colorPickerOpts(function(color){
	viewport.Grid.MinorLineColor=color.toHexString();
	localStorage.setItem('ConstructorIL.Scene.Grid.MinorLineColor',color.toHexString());
}));

$("#gridMajorLineColor").spectrum(new colorPickerOpts(function(color){
	viewport.Grid.MajorLineColor=color.toHexString();
	localStorage.setItem('ConstructorIL.Scene.Grid.MajorLineColor',color.toHexString());
}));

$("#gridMidLineColor").spectrum(new colorPickerOpts(function(color){
	viewport.Grid.MidLineColor=color.toHexString();
	localStorage.setItem('ConstructorIL.Scene.Grid.MidLineColor',color.toHexString());
}));

$("#printingBoxColor").spectrum(new colorPickerOpts(function(color){
	viewport.PrintingBox.Color=color.toHexString();
	localStorage.setItem('ConstructorIL.Scene.PrintingBox.Color',color.toHexString());
}));

$("#backgroundColor").spectrum(new colorPickerOpts(function(color){
	viewport.BackgroundColor=color;
	localStorage.setItem('ConstructorIL.Scene.Background.Color',color.toHexString());
}));
function colorPickerOpts(callback){
	return {
		change:callback,
		color: "white",
	    flat: false,
	    showInput: true,
	    showInitial: true,
	    allowEmpty: true,
	    showAlpha: false,
	    disabled: false,
	    localStorageKey: "ConstructorIL.meshColor",
	    showPalette: true,
	    showPaletteOnly: false,//Restrict Palette to dev defined colors
	    togglePaletteOnly: true,
	    showSelectionPalette: true,
	    clickoutFiresChange: true,
	    hideAfterPaletteSelect:true,
	    cancelText: "Cancelar",
	    chooseText: "Seleccionar",
	    togglePaletteMoreText: ">",
	    togglePaletteLessText: "<",
	    containerClassName: "colorpicker-container",
	    replacerClassName: "colorpicker-button",
	    preferredFormat: "hex",
	    //maxSelectionSize: int,
	    palette: [
	    	//GrayScale
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(153, 153, 153)","rgb(183, 183, 183)",
			"rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(239, 239, 239)", "rgb(243, 243, 243)", "rgb(255, 255, 255)"],
			//Basic Colors
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
			//Chroma
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
	        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
	        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
	        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
	        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
	        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
	        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
	        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
	        "rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)",
	        "rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)",
	        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
	        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
	    ]
	}
}
function cambiaTextura(textura)
{
	
	var mt=new THREE.MeshPhongMaterial({color:0xffffff,transparent:true, side:THREE.DoubleSide, opacity: cubeOpacity});
	mt.identificador=textura.split(".")[0];
	//textura="textures/"+textura;
	var tex = THREE.ImageUtils.loadTexture( "textures/"+textura);
	tex.needsUpdate = true;
	mt.map = tex;				
	cuboMuestra.material = mt;
	cuboMuestra.geometry.buffersNeedUpdate = true;
	cuboMuestra.geometry.uvsNeedUpdate = true;
	mt.needsUpdate = true;

	//materialCubo
	materialCubo=new THREE.MeshPhongMaterial({color:0xffffff,transparent:true, side:THREE.DoubleSide, opacity: cubeOpacity});
	materialCubo.identificador=mt.identificador=textura.split(".")[0];
	var tex2 = THREE.ImageUtils.loadTexture( "textures/"+textura);
	tex2.needsUpdate = true;
	materialCubo.map = tex2;
	materialCubo.needsUpdate = true;
}

function generateBLOCFromScene(scene){
    var objetos = [];
    var arrayBuffer;
    var dataView;
    var offset = 0;
    scene.traverse(function(object) {
        if (object instanceof THREE.Mesh) {
            var color = object.material.color;
            var id=object.material.identificador.split("/");
            object.geometry.computeBoundingBox();
            object.updateMatrixWorld();
            object.geometry.boundingBox.min.applyMatrix4(object.matrixWorld)
            var mesh = {
                position:{
                    x:Math.floor(object.geometry.boundingBox.min.x),
                    y:Math.floor(object.geometry.boundingBox.min.y),
                    z:Math.floor(object.geometry.boundingBox.min.z)
                },
                dimension:{
                    x:5,
                    y:5,
                    z:5
                },
                color:{
                    r: color.r * 255,
                    g: color.g * 255,
                    b: color.b * 255,
                    a: object.material.opacity * 255
                },
                
                material:{
                    collection:id[0],
                    texture:id[1]
                }
            }
            objetos.push(mesh);
            console.log("Mesh procesado");
        }
    });
    console.log("terminado");

    
    var object;
    var headerMaxLength=64;
    var header="Generado por Interlatin ConstructorIL 2"
    var headerArray=header.split("");
    var magicNumber=64;
    var fileLength=21*objetos.length+70;
    arrayBuffer = new ArrayBuffer(fileLength);//64 bytes para Header + Bytes numero magico + longitud del archivo
    dataView = new DataView(arrayBuffer);

    for (offset = 0; offset < headerMaxLength; offset++) {
        if(offset<header.length)
            dataView.setUint8(offset, header.charCodeAt(offset));
        else
            dataView.setUint8(offset, 32);
    };
    
    dataView.setUint16(offset, magicNumber);
    offset += 2;
    dataView.setUint32(offset, fileLength, true);
    offset += 4;
    

    for (var i = 0; i < objetos.length; i++){
        object = objetos[i];

        dataView.setInt32(offset, object.position.x, true);
        offset += 4;
        dataView.setInt32(offset, object.position.y, true);
        offset += 4;
        dataView.setInt32(offset, object.position.z, true);
        offset += 4;

        dataView.setUint8(offset, object.dimension.x);
        offset += 1;
        dataView.setUint8(offset, object.dimension.y);
        offset += 1;
        dataView.setUint8(offset, object.dimension.z);
        offset += 1;

        dataView.setUint8(offset, object.color.r);
        offset += 1;
        dataView.setUint8(offset, object.color.g);
        offset += 1;
        dataView.setUint8(offset, object.color.b);
        offset += 1;
        dataView.setUint8(offset, object.color.a);
        offset += 1;
        dataView.setUint8(offset, object.material.collection);
        offset += 1;
        dataView.setUint8(offset, object.material.texture);
        offset += 1;
        
    }
    return arrayBuffer;
}

function loadBLOC(file){
    var reader = new FileReader();
    var mesh;

    reader.onload = load;

    function load(ev) {

        var buffer = ev.target.result;
        var data = new DataView(buffer);
        var offset = 64;
        var magicNumber=64;

        var geometry;
        var objectMaterial;
        
        var position;
        var dimension;
        var color;
        var materialData;

        var fileMagicNumber=data.getUint16(offset);
        offset+=2;
        var fileLength=data.getUint32(offset,true);
        offset+=4;

        if(fileMagicNumber!=magicNumber)
            alert("Wrong File Type or Corrupted File");
        if(fileLength!=data.byteLength)
            alert("Corrupted File");

        while (offset < data.byteLength) {
            position={};
            dimension={};
            color={};
            materialData={};

            position.x=data.getInt32(offset, true);
            offset+=4;
            position.y=data.getInt32(offset,true);
            offset+=4;
            position.z=data.getInt32(offset, true);
            offset+=4;

            dimension.x=data.getUint8(offset);
            offset+=1;
            dimension.y=data.getUint8(offset);
            offset+=1;
            dimension.z=data.getUint8(offset);
            offset+=1;

            color.r=data.getUint8(offset);
            offset+=1;
            color.g=data.getUint8(offset);
            offset+=1;
            color.b=data.getUint8(offset);
            offset+=1;
            color.a=data.getUint8(offset);
            offset+=1;

            materialData.collection=data.getUint8(offset);
            offset+=1;
            materialData.texture=data.getUint8(offset);
            offset+=1;

            geometry= new THREE.BoxGeometry(dimension.x,dimension.y,dimension.z);
            if(materialData.collection==1&&materialData.texture==1){

                objectMaterial=new THREE.MeshPhongMaterial({
                    transparent:true,
                    color:new THREE.Color().setRGB(color.r / 255, color.g / 255, color.b / 255),
                    ambient:new THREE.Color().setRGB(color.r / 255, color.g / 255, color.b / 255),
                    opacity:color.a/255,
                    side:THREE.DoubleSide
                });
                objectMaterial.identificador=materialData.collection+"/"+materialData.texture;
                var texture = THREE.ImageUtils.loadTexture("textures/"+materialData.collection+"/"+materialData.texture+".png");
                texture.needsUpdate = true;
                objectMaterial.map = texture;
                objectMaterial.needsUpdate = true;
            }else{
                objectMaterial=new THREE.MeshPhongMaterial({
                    transparent:true,
                    color:new THREE.Color().setRGB(color.r / 255, color.g / 255, color.b / 255),
                    ambient:new THREE.Color().setRGB(color.r / 255, color.g / 255, color.b / 255),
                    opacity:color.a/255,
                    side:THREE.DoubleSide
                });
                objectMaterial.identificador=materialData.collection+"/"+materialData.texture;
                var texture = THREE.ImageUtils.loadTexture("textures/"+materialData.collection+"/"+materialData.texture+".png");
                texture.needsUpdate = true;
                objectMaterial.map = texture;		                    
                objectMaterial.needsUpdate = true;
            }
            var mesh=new THREE.Mesh(geometry, objectMaterial);
            
            mesh.geometry.buffersNeedUpdate = true;
            mesh.geometry.uvsNeedUpdate = true;
            //mesh.material.needsUpdate = true
            mesh.castShadow = true;
            //computeUvs(mesh.geometry);
            scene.add(mesh);
            
            mesh.geometry.computeBoundingBox();

            mesh.position.set(position.x+mesh.geometry.boundingBox.max.x,position.y+mesh.geometry.boundingBox.max.y,position.z+mesh.geometry.boundingBox.max.z);
            objects.push(mesh);
        }
    };
    return reader.readAsArrayBuffer(file);
}

function sayHello(name) {
    return "Hello " + name;
}
