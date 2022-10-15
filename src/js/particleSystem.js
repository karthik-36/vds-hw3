var data = [];
var allParticles;
var geo = new THREE.BufferGeometry;
const bounds = {};
var plane;
var svg1 = d3.select("svg");


var posArr = new Float32Array(data.length*3);
var colors = new Float32Array(data.length*3);
var color = new THREE.Color();

var z = 0;

var rotation = 0;

var colorsRange = d3.scaleQuantize()
    .domain([0, 367])
    .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
        "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);

var  colorsRangeGrey = d3.scaleQuantize()
.domain([0, 367])
.range(['#ffffff','#969696','#969696','#969696','#969696','#737373','#525252','#252525','#222222']);


var particles = new THREE.Group()

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        e.preventDefault();
        if(z < 5){
            z = z + 0.01;  
        }
    }
    else if (e.keyCode == '40') {
        e.preventDefault();
        if(z > -5){
            z = z - 0.01;
        }     
    }
    else if (e.keyCode == '37') {
   
        e.preventDefault();
        rotateObject(allParticles , 0, +1, 0);

        let svg2 = document.getElementById('my_dataviz');
        rotation--;
        svg2.style.transform
        = 'rotate('+rotation+'deg)';
    }
    else if (e.keyCode == '39') {
        // right arrow

        e.preventDefault();
        rotateObject(allParticles , 0, -1, 0);
        let svg2 = document.getElementById('my_dataviz');
        rotation++;
        svg2.style.transform
        = 'rotate('+rotation+'deg)';
  
        
    }

    
    z = Math.round((z + Number.EPSILON) * 100) / 100;
    console.log(z);
    svg1.selectAll("*").remove();
     updatePlane(z);
     createSideCircle(z);

     updateParticleColor(z);

   
}




var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

function rotateObject(object, degreeX = 0, degreeY = 0, degreeZ = 0) {
    object.rotateX(THREE.Math.degToRad(degreeX));
    object.rotateY(THREE.Math.degToRad(degreeY));
    object.rotateZ(THREE.Math.degToRad(degreeZ));
}

const createCylinder = () => {

    // get the radius and height based on the data bounds
    const radius = (bounds.maxX - bounds.minX) / 2.0 + 1;
    const height = (bounds.maxY - bounds.minY) + 1;

    // create a cylinder to contain the particle system
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
    const cylinder = new THREE.Mesh(geometry, material);



    // add the containment to the scene
    scene.add(cylinder);
};

var createSideCircle = (z) => {

    z = z + 5;
    //console.log(data);
    let markerData = data.filter((d, i) => { 
        return  (Math.round((d.Z + Number.EPSILON) * 100) / 100 === z) })
    svg
        .selectAll("myCircles")
        .data(markerData)
        .join("circle")
        .attr("cx", d => 300 + d.X * 50)
        .attr("cy", d => 350 + d.Y * 50)
        .attr("r", 5)
        .style("fill", d => colorsRange(d.concentration))



}

const updateParticleColor = (z) => {

    let x = 0;


    for (let i = 0; i < data.length; i = i + 2){
       
        if(Math.abs(Math.round((data[i].Z - 5 + Number.EPSILON) * 100) / 100 - z) < 0.1){
            color.set(colorsRange(data[i].concentration))
        }else{
            color.set(colorsRangeGrey(data[i].concentration))
        }
  
        colors[x] = color.r
        colors[x+1] = color.g
        colors[x+2] = color.b

        x = x + 3;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    //data = data.filter((x) => {x})
  
}

// creates the particle system

// const createParticleSystem1 = (data) => {

//     // draw your particle system here!
    

//     const geo = new THREE.BufferGeometry();
//     geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0,0,0]), 3));

//     for (let i = 0; i < data.length; i = i++) {

//         // console.log(data[i]);
//         //const mat1 = new THREE.MeshBasicMaterial({ color: colors(data[i].concentration) });
//         const mat1 = new THREE.PointsMaterial({ size: 0.1, color: colors(data[i].concentration) });
//        // const mat1 = new THREE.MeshBasicMaterial({ color: "rgb(150,150,150)" , opacity: 0.1 , transparent : true });
//         const particle = new THREE.Points(geo, mat1)
//         particle.position.x = data[i].X;
//         particle.position.z = data[i].Y;
//         particle.position.y = data[i].Z - 5;
        
//         particles.add(particle);
//     }
//     scene.add(particles);


//     // const geo = new THREE.SphereGeometry(0.04);
//     // for (let i = 0; i < data.length; i++) {

//     //     // console.log(data[i]);
//     //     const mat1 = new THREE.MeshBasicMaterial({ color: colors(data[i].concentration) });
//     //    // const mat1 = new THREE.MeshBasicMaterial({ color: "rgb(150,150,150)" , opacity: 0.1 , transparent : true });
//     //     const particle = new THREE.Mesh(geo, mat1)
//     //     particle.velocity = new THREE.Vector3(
//     //         data[i].U,
//     //         data[i].V,
//     //         data[i].W)
//     //     // particle.acceleration = new THREE.Vector3(0,-0.001,0)
//     //     particle.position.x = data[i].X;
//     //     particle.position.z = data[i].Y;
//     //     particle.position.y = data[i].Z - 5;
//     //     particles.add(particle)
//     // }
//     // scene.add(particles);

// };



const createParticleSystem = (data) => {

    //  attribute once
    
    

    let x = 0;
    posArr = new Float32Array(data.length*3);
    colors = new Float32Array(data.length*3);

    

    
  
    for (let i = 0; i < data.length; i = i + 2){
       
      //  if(Math.abs(Math.round((data[i].Z - 5 + Number.EPSILON) * 100) / 100 - z) < 0.1){
            color.set(colorsRange(data[i].concentration))
       // }else{
       //     color.set(colorsRangeGrey(data[i].concentration))
       // }
  
        colors[x] = color.r
        colors[x+1] = color.g
        colors[x+2] = color.b

        posArr[x] = data[i].X
        posArr[x+1] = data[i].Z - 5;
        posArr[x+2] = data[i].Y
        x = x + 3;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterials = new THREE.PointsMaterial( {
        transparent: true,
        vertexColors: true,
        size: 0.14,
        opacity: 0.8
    } );

    allParticles = new THREE.Points(geo, particleMaterials)
    scene.add(allParticles);

    // geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0,0,0]), 3));

    // for (let i = 0; i < data.length; i = i++) {

    //     // console.log(data[i]);
    //     //const mat1 = new THREE.MeshBasicMaterial({ color: colors(data[i].concentration) });
    //     const mat1 = new THREE.PointsMaterial({ size: 0.1, color: colors(data[i].concentration) });
    //    // const mat1 = new THREE.MeshBasicMaterial({ color: "rgb(150,150,150)" , opacity: 0.1 , transparent : true });
    //     const particle = new THREE.Points(geo, mat1)
    //     particle.position.x = data[i].X;
    //     particle.position.z = data[i].Y;
    //     particle.position.y = data[i].Z - 5;

    //     particles.add(particle);
    // }
    // scene.add(particles);


    // const geo = new THREE.SphereGeometry(0.04);
    // for (let i = 0; i < data.length; i++) {

    //     // console.log(data[i]);
    //     const mat1 = new THREE.MeshBasicMaterial({ color: colors(data[i].concentration) });
    //    // const mat1 = new THREE.MeshBasicMaterial({ color: "rgb(150,150,150)" , opacity: 0.1 , transparent : true });
    //     const particle = new THREE.Mesh(geo, mat1)
    //     particle.velocity = new THREE.Vector3(
    //         data[i].U,
    //         data[i].V,
    //         data[i].W)
    //     // particle.acceleration = new THREE.Vector3(0,-0.001,0)
    //     particle.position.x = data[i].X;
    //     particle.position.z = data[i].Y;
    //     particle.position.y = data[i].Z - 5;
    //     particles.add(particle)
    // }
    // scene.add(particles);

};

const createPlane = (z) => {


    const geometry = new THREE.PlaneGeometry(13, 13);
    const material = new THREE.MeshBasicMaterial({ color: "rgba(50,50,250)", side : THREE.DoubleSide , opacity: 0.6, transparent: true });
    plane = new THREE.Mesh(geometry, material);
    z = 0;

    //plane.rotation.set(new THREE.Vector3( 0, 0, 0));
    rotateObject(plane, 90, 0, 0);
    plane.position.set(0, z , 0);
    scene.add(plane);

};

 let updatePlane = function(z){
    plane.position.set(0, z, 0);
}

const loadData = (file) => {

    // read the csv file
    d3.csv(file).then(function (fileData)
    // iterate over the rows of the csv file
    {
        fileData.forEach(d => {
            // get the min bounds
            bounds.minX = Math.min(bounds.minX || Infinity, d.Points0);
            bounds.minY = Math.min(bounds.minY || Infinity, d.Points1);
            bounds.minZ = Math.min(bounds.minZ || Infinity, d.Points2);

            // get the max bounds
            bounds.maxX = Math.max(bounds.maxX || -Infinity, d.Points0);
            bounds.maxY = Math.max(bounds.maxY || -Infinity, d.Points1);
            bounds.maxZ = Math.max(bounds.maxY || -Infinity, d.Points2);

            // add the element to the data collection
            data.push({
                // concentration density
                concentration: Number(d.concentration),
                // Position
                X: Number(d.Points0),
                Y: Number(d.Points1),
                Z: Number(d.Points2),
                // Velocity
                U: Number(d.velocity0),
                V: Number(d.velocity1),
                W: Number(d.velocity2)
            })
        });

        // draw the containment cylinder
        // TODO: Remove after the data has been rendered
        //createCylinder()
        // create the particle system
        createParticleSystem(data);

        createPlane();

        createSideCircle(0);

    })


};


loadData('data/058.csv');