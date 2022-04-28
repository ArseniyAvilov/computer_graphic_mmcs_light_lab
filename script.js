var cubeRotation = 0.0;


//main();

window.onload = function main() {
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    function initProgram(VS, FS){
        let vertexShaderSource = document.querySelector(VS).text;
        let fragmentShaderSource = document.querySelector(FS).text;


        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const shaderProgram = createProgram(gl, vertexShader, fragmentShader);


    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uPMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uMVMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, "uNMatrix"),
            lightMatrix: gl.getUniformLocation(shaderProgram, "uLightMatrix"),
            pointLightLocation: gl.getUniformLocation(shaderProgram, "uPointLightLocation"),
            color: gl.getUniformLocation(shaderProgram, "uColor"),

        }
    };

    return programInfo;
    }

    let lambertProgram = initProgram("#LambertVS", "#LambertFS");
    let phongProgram = initProgram("#PhongVS", "#PhongFS");
    let blinnProgram = initProgram("#BlinnVS", "#BlinnFS");
    let celProgram = initProgram("#CelVS", "#CelFS");
    let minnaertProgram = initProgram("#MinnaertVS", "#MinnaertFS");


    let pMatrix = mat4.create();
    let lightMatrix = mat4.create();

    //BUFFERS time
    const buffers = initBuffers(gl);

    var then = 0;

    let rotateMatrix = [[0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0]];

    var lastTime = 0;
    let rY = 0;
    
    function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;
            rY += (45 * elapsed) / 1000.0;
        }
        lastTime = timeNow;
    }


    programInfo = phongProgram;
    function render(now) {
        now *= 0.0001;  // convert to seconds
        const deltaTime = now - then;
        then = now; 


        window.onkeydown = (e) => {
        if (e.code === 'Digit1'){programInfo = lambertProgram;}
        else if (e.code === 'Digit2'){programInfo = phongProgram;}
        else if (e.code === 'Digit3'){programInfo = blinnProgram;}
        else if (e.code === 'Digit4'){programInfo = celProgram;}
        else if (e.code === 'Digit5'){programInfo = minnaertProgram;}}
        
        drawScene(deltaTime);
        requestAnimationFrame(render);
        animate();
    }
  
    requestAnimationFrame(render);

function initBuffers(gl) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


    const positions = [
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);

    
    const vertexNormals = [
            // Front
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
        
            // Back
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
        
            // Top
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
        
            // Bottom
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
        
            // Right
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
        
            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
          ];

    vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    // vertexNormalBuffer.itemSize = 3;
    // vertexNormalBuffer.numItems = vertexNormals / 3;

    return {
        position: positionBuffer,
        normal: vertexNormalBuffer,
        indices: indexBuffer,
    };
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function drawCube(deltaTime, translateList, rotateList, c, color){

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, pMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, mvMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.lightMatrix, false, lightMatrix);
        
        var normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, mvMatrix);
        gl.uniformMatrix3fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix);
    }

    let mvMatrix = mat4.create();

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix,
        mvMatrix,
        translateList);


    
    lightMatrix = mat4.identity(lightMatrix);
    mat4.rotateY(lightMatrix, lightMatrix, degToRad(rY));
    mat4.translate(lightMatrix, lightMatrix, [0.0, 0.0, -10.0]);
    
    mat4.rotate(mvMatrix,
                mvMatrix,
            cubeRotation,
            rotateList);


    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.useProgram(programInfo.program);

    setMatrixUniforms();
    gl.uniform3fv(programInfo.uniformLocations.color, color);
    gl.uniform3fv(programInfo.uniformLocations.pointLightLocation, [-5.0, -1.5, -10.5]);

    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);


    cubeRotation += deltaTime;
}

function drawScene(deltaTime){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFz1FER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;

    mat4.perspective(pMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    const zOffset = -10;
    const yOffset = -2.5;
    const side = 2;
    const space = 0.5;
    const center = [0, yOffset, zOffset];



    //midTop
    drawCube(deltaTime, translateList=[0, yOffset+side+space, zOffset], rotateList=rotateMatrix[0], c=center, color=[1.0, 0.7, 0.0]);

    //midBotton
    drawCube(deltaTime, translateList=center, rotateList=rotateMatrix[1], c=center, color=[0.0, 0.7, 1.0]);

    //left
    drawCube(deltaTime, translateList=[-(side+space), yOffset, zOffset], rotateList=rotateMatrix[2], c=center, color=[0.0, 1.0, 0.7]);

    //right
    drawCube(deltaTime, translateList=[side+space, yOffset, zOffset], rotateList=rotateMatrix[3], c=center, color=[0.7, 0.0, 1.0]);
}


}

function createShader(gl, type, source) {
    let shader = gl.createShader(type);   // создание шейдера
    gl.shaderSource(shader, source);      // устанавливаем шейдеру его программный код
    gl.compileShader(shader);             // компилируем шейдер
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {                        // если компиляция прошла успешно - возвращаем шейдер
      return shader;
    }
   
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
  
  
  function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
   
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }