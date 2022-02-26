console.log ("This is javascript")

/* const canvas = new fabric.Canvas('canvas', {
    width: 500,
    height: 500,
   
    isDrawingMode: true,
    });

fabric.Image.fromURL ('https://cdn.pixabay.com/photo/2016/11/23/13/48/beach-1852945_960_720.jpg', (img) => {
    canvas.backgroundImage = img 
    canvas.renderAll()
})
*/


function initCanvas(id) {
    return new fabric.Canvas(id, {
        width: 500,
        height: 500,
        isDrawingMode: false,
        selection : false,
    });
}

function setBackground(url, canvas) {
    fabric.Image.fromURL(url, function (img) {
            canvas.backgroundImage = img;
            canvas.renderAll();
        });
}
const canvas = initCanvas ('canvas');
let mousePressed = false;


let currentMode = '';
const modes = {
    pan : 'pan'
    };

function togglePan() {
    if (currentMode === 'pan') {
        currentMode = '';
        console.log(currentMode);
        }
    else {
        currentMode = 'pan',
        console.log(currentMode);
        }
};

setBackground ('https://cdn.pixabay.com/photo/2016/11/23/13/48/beach-1852945_960_720.jpg', canvas)

////////////////////////////////////////////////////////////////////////////////////////////////////
// mouse over
canvas.on("mouse:move", function (event) {
    if (mousePressed && currentMode === modes.pan) {
        const mEvent = event.e;
        const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
        canvas.relativePan(delta);
        canvas.setCursor ('crosshair'),
        canvas.renderAll()
}})

canvas.on("mouse:down", function (event) {
    if (currentMode === modes.pan){
        mousePressed = true,
        console.log ("Mouse Pressed parameter is now :" + mousePressed),
        canvas.setCursor ('grab'),
        canvas.renderAll()
    }

})

canvas.on("mouse:up", function (event) {
    mousePressed = false,
    console.log ("Mouse Pressed parameter is now :" + mousePressed)
    canvas.setCursor ('default'),
    canvas.renderAll()
})


/* mouse left the canvas
canvas.on("mouse:out", () =>{
    console.log ("the mouse left the canvas")
})*/

canvas.renderAll();

