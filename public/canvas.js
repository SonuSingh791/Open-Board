
let canvas = document.querySelector("canvas");
let pencilColors = document.querySelectorAll(".pencil-color");
let pencilWidth = document.querySelector(".pencil-width-container input");
let eraserWidthEle = document.querySelector(".eraser-width-container input")
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");
let undoRedoTracker = [];
let trackIdx = 0;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let mouseDown = false;
let tool = canvas.getContext("2d");
let penColor = "black"
let penWidth = pencilWidth.value;
let eraserWidth = eraserWidthEle.value;
tool.strokeStyle = penColor;
tool.lineWidth = pencilWidth;
let eraserColor = "white";
/*
tool.beginPath();       // New Graphics (path) (line)
tool.moveTo(10,10);     // Starting Point   
tool.lineTo(100,100);   // End Point
tool.stroke();          // Fill Color (Fill Graphics)
*/
pencilColors.forEach((color) => {
    color.addEventListener("click", (e) => {
        penColor = color.classList[0];
        tool.strokeStyle = penColor;
    })
})

pencilWidth.addEventListener("change", (e) => {
    penWidth = pencilWidth.value;
    tool.lineWidth = penWidth;
})
eraserWidthEle.addEventListener("change", (e) => {
    eraserWidth = eraserWidthEle.value;
    tool.lineWidth = eraserWidth;
})
eraser.addEventListener("click", (e) => {
    if(eraser.classList.contains("active")){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }
    else{
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})
pencil.addEventListener("click", (e) => {
    tool.strokeStyle = penColor;
    tool.lineWidth = penWidth;
})
canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    // beginPath({x:e.clientX, y:e.clientY});

    // Send data to server
    let data = {x:e.clientX, y:e.clientY};
    socket.emit("beginPath", data);
});
canvas.addEventListener("mousemove", (e) => {
    if(mouseDown){
        // drawStroke({x:e.clientX, y:e.clientY});

        let data = {x:e.clientX, y:e.clientY,
                    color: eraser.classList.contains("active")?eraserColor:penColor,
                    width: eraser.classList.contains("active")?eraserWidth:penWidth
        };
        socket.emit("drawStroke", data);
    }
});
canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    trackIdx = undoRedoTracker.length - 1;
})

undo.addEventListener("click", (e) => {
    console.log(trackIdx)
    if(trackIdx > 0) {trackIdx--;
    // let trackObj = {
    //     trackVal:trackIdx,
    //     undoRedoTracker
    // }
    // undoRedoCanvas(trackObj);

    let data = {
        trackVal:trackIdx,
        undoRedoTracker
    }
    socket.emit("undoRedo", data);
}
})

redo.addEventListener("click", (e) => {
    if(trackIdx < undoRedoTracker.length - 1 ){ trackIdx++;
    // let trackObj = {
    //     trackVal:trackIdx,
    //     undoRedoTracker
    // }
    // undoRedoCanvas(trackObj);

    let data = {
        trackVal:trackIdx,
        undoRedoTracker
    }
    socket.emit("undoRedo", data);
}
})

function undoRedoCanvas(trackObj){
    let track = trackObj.trackVal;
    let undoRedoTracker = trackObj.undoRedoTracker;
    let url = undoRedoTracker[track];
    let img = new Image();
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
}

function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);

    tool.stroke();
}

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.png";
    a.click();
})

socket.on("beginPath", (data) => {
    // Data from server
    beginPath(data);
})
socket.on("drawStroke", (data) => {
    // Data from server
    drawStroke(data);
})
socket.on("undoRedo", (data) => {
    // Data from server
    undoRedoCanvas(data);
})
