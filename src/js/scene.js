
// Canvas

alert("use (hold) arrow keys to move slider up and down ; rotate");

const canvas = document.querySelector('canvas.scene');
var controls;


// Scene
const scene = new THREE.Scene();

// Lights
const light = new THREE.DirectionalLight(0xffffff, 0.1);
light.position.set(0,2,20);
scene.add(light);

// Sizes
const sizes = {
    width: window.innerWidth * 0.65,
    height: window.innerHeight * 0.85
};


const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
window.addEventListener('resize', () =>
{
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});


// Camera setup


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000 );

controls = new THREE.OrbitControls (camera, renderer.domElement);
controls.enableZoom = false;
controls.keys = { LEFT: 0, RIGHT: 0, UP: 0, BOTTOM: 0 }
//controls.keyboard = true;
//controls.
camera.position.set(0,2,20);
camera.lookAt(0,0,0);

//controls.update();
scene.add(camera);



//  Renderer

renderer.setSize(sizes.width, sizes.height);
// sets up the background color
renderer.setClearColor(0x000000);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// Animate
const animate = () =>
{
    //controls.update();
  //  controls.update();
    window.requestAnimationFrame(animate);
	renderer.render( scene, camera );
    
};

animate();