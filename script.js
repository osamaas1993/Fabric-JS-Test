/* @format */

console.log("This is javascript");

//////////////////////////////////////////////////////////////////////////////////// CANVAS CREATION

//function for creating the canvas, the function includes its parameters
function initCanvas(id) {
  return new fabric.Canvas(id, {
    width: 1000,
    height: 700,
    isDrawingMode: false,
    snapAngle: 10,
    skipTargetFind: false,
    backgroundColor: "white",
  });
}
//setting the canvas background through URL
function setBackground(url, canvas) {
  fabric.Image.fromURL(url, function (img) {
    canvas.backgroundImage = img;
    canvas.renderAll();
  });
}
//creating a canvas that takes its options from the initCanvas function, the ID parameter is the canvas html ID
const canvas = initCanvas("canvasID");

//////////////////////////////////////////////////////////////////////////////////// VARIOUS SETTINGS
//modes objects and currentMode variable
const modes = {
  pan: "panMode",
  build: "buildMode",
  draw: "drawMode",
};

var currentMode = "buildMode";
let mousePressed = false;
let drawWidth = 1;
let color = "#000000";

// updating the active mode button with the current mode
function changeModeName() {
  if (currentMode === "panMode") {
    document.getElementById(
      "currentModeDiv"
    ).innerHTML = `Active Mode : <strong>Pan mode</strong>`;
  } else if (currentMode === "drawMode") {
    document.getElementById(
      "currentModeDiv"
    ).innerHTML = `Active Mode : <strong>Draw mode</strong>`;
  } else {
    document.getElementById(
      "currentModeDiv"
    ).innerHTML = `Active Mode : <strong>Build/Select mode</strong>`;
  }
}
// modifying the drawing width using the slider
function setWidthListener() {
  const widthPicker = document.getElementById("drawing-line-width");
  widthPicker.addEventListener("change", function (event) {
    drawWidth = Number(event.target.value);
    console.log("The drawing width is :" + event.target.value);
    canvas.freeDrawingBrush.width = drawWidth;
    document.getElementById("widthSelector").innerHTML = event.target.value;
  });
}
// modifying the opacity  using the slider
function setOpacityListener() {
  const opacityPicker = document.getElementById("object-opacity");
  var activeSelection = canvas.getActiveObject();
  if (activeSelection != "undefined") {
    opacityPicker.addEventListener("change", function (event) {
      console.log("The new opacity is :" + event.target.value);
      document.getElementById("opacitySelector").innerHTML = event.target.value;
      canvas.getActiveObject().opacity = Number(event.target.value);
      canvas.renderAll();
    });
  } else if ((activeSelection = "undefined")) {
    console.log("no active selection");
  }
}

// modifying the drawing color using the color picker
function setColorListener() {
  const colorPicker = document.getElementById("colorPicker");
  colorPicker.addEventListener("change", function (event) {
    color = event.target.value;
    console.log(event.target.value);
    const e = canvas.getActiveObjects();
    canvas.freeDrawingBrush.color = color;
    canvas.getActiveObject().fill = color;
    canvas.renderAll();
  });
}
//////////////////////////////////////////////////////////////////////////////////// MODES
// clear canvas function
function clearCanvas(canvas) {
  canvas.getObjects().forEach(function (o) {
    if (o !== canvas.backgroundImage) {
      canvas.remove(o);
    }
  });
}

// clear Selection function
function clearSelection() {
  const e = canvas.getActiveObjects();
  e.forEach((element) => canvas.remove(element));
}
document.addEventListener("keydown", (event) => {
  var name = event.key;
  // Alert the key name and key code on keydown
  if (name === "Delete") {
    clearSelection();
  }
});

// copy and paste using ctrl+c / ctrl+v
document.addEventListener(
  "keydown",
  (event) => {
    var name = event.key;
    var code = event.code;
    if (name === "Control") {
      // Do nothing.
      return;
    }
    if (event.ctrlKey && name === "c") {
      copy();
    }
  },
  false
);

document.addEventListener(
  "keydown",
  (event) => {
    var name = event.key;
    var code = event.code;
    if (name === "Control") {
      // Do nothing.
      return;
    }
    if (event.ctrlKey && name === "v") {
      paste();
    }
  },
  false
);

// making group function and ungroup functions
let currentSelection = {};
function groupObjects() {
  var selectedObjects = canvas.getActiveObjects();
  currentSelection.value = new fabric.Group(selectedObjects, {
    left: canvas.getActiveObject().getBoundingRect(true, true).left,
    top: canvas.getActiveObject().getBoundingRect(true, true).top,
  });
  clearSelection();
  canvas.add(currentSelection.value);
  console.log("elements were grouped");
}

function unGroupObjects() {
  canvas.getActiveObject().toActiveSelection();
  console.log("elements were ungrouped");
}

//for the toggle pan button
function togglePan() {
  if (currentMode !== "panMode") {
    currentMode = "panMode";
    canvas.isDrawingMode = false;
    canvas.skipTargetFind = true;
    console.log(currentMode);
  } else {
    (currentMode = "buildMode"), console.log(currentMode);
  }
}

//for the toggle build/select button
function toggleBuild() {
  if (currentMode !== "buildMode") {
    currentMode = "buildMode";
    canvas.skipTargetFind = false;
    canvas.isDrawingMode = false;
    console.log(currentMode);
  }
}

//for the toggle draw button and drawing paramters
function toggleDraw() {
  if (currentMode !== "drawMode") {
    currentMode = "drawMode";
    console.log(currentMode);
    canvas.isDrawingMode = true;
    //drawing propoerties below
    canvas.freeDrawingBrush.strokeLineCap = "round"; //options are "butt" "round" "square"
    canvas.freeDrawingBrush.strokeLineJoin = "miter"; //options are "bevel", "round", "miter"
  } else {
    (currentMode = "buildMode"), console.log(currentMode);
    canvas.isDrawingMode = false;
  }
}

//////////////////////////////////////////////////////////////////////////////////// OBJECT CREATION - COPY - PASTE

// object creation functions
function createRectangle() {
  var rect = new fabric.Rect({
    width: 100,
    height: 100,
    fill: color,
    top: -50,
    left: canvas.width / 2,
    originX: "center",
    originY: "center",
    objectCaching: false,
  });
  canvas.add(rect);
  canvas.renderAll();
  console.log("create rectangle button");
  rect.animate("top", canvas.height / 2, {
    onChange: canvas.renderAll.bind(canvas),
    duration: 1000,
    easing: fabric.util.ease.easeInOutCubic,
  });
  rect.on("selected", function () {
    //rect.opacity=0.75 ;
  });
  rect.on("deselected", function () {
    //rect.opacity=1 ;
  });
}

function createCircle() {
  var circle = new fabric.Circle({
    radius: 50,
    fill: color,
    top: -50,
    left: canvas.width / 2,
    originX: "center",
    originY: "center",
    objectCaching: false,
  });
  canvas.add(circle);
  canvas.renderAll();
  circle.animate("top", canvas.height / 2, {
    onChange: canvas.renderAll.bind(canvas),
    duration: 1000,
    easing: fabric.util.ease.easeInOutCubic,
  });
  console.log("create circle button");
  circle.on("selected", function () {
    //circle.opacity=0.75 ;
  });
  circle.on("deselected", function () {
    //circle.opacity=1 ;
  });
}

//COPY AND PASTE FUNCTIONS
function copy() {
  var activeSelection = canvas.getActiveObject();
  if (activeSelection != null) {
    canvas.getActiveObject().clone(function (cloned) {
      _clipboard = cloned;
    });
  }
}

function paste() {
  // clone again, so you can do multiple copies.
  _clipboard.clone(function (clonedObj) {
    canvas.discardActiveObject();
    clonedObj.set({
      left: clonedObj.left + 10,
      top: clonedObj.top + 10,
      evented: true,
      objectCaching: true,
    });
    if (clonedObj.type === "activeSelection") {
      // active selection needs a reference to the canvas.
      clonedObj.canvas = canvas;
      clonedObj.forEachObject(function (obj) {
        canvas.add(obj);
      });
      // this should solve the unselectability
      clonedObj.setCoords();
    } else {
      canvas.add(clonedObj);
    }
    _clipboard.top += 10;
    _clipboard.left += 10;
    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
  });
}

//the setPanEvents include the mouse down, up, and moving parameters for when we are in pan mode
function setMouseEvents(canvas) {
  canvas.on("mouse:down", function (event) {
    if (currentMode === modes.pan) {
      (mousePressed = true),
        console.log("mouse was pressed in pan mode"),
        canvas.setCursor("grab"),
        canvas.renderAll();
    } else if (currentMode === modes.draw) {
      (mousePressed = true),
        console.log("mouse was pressed in draw mode"),
        canvas.setCursor("crosshair"),
        canvas.renderAll();
    } else {
      console.log("mouse was pressed");
    }
  });

  canvas.on("mouse:move", function (event) {
    if (mousePressed && currentMode === modes.pan) {
      const mEvent = event.e;
      const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
      canvas.relativePan(delta);
      console.log("mouse is moving in pan mode");
      canvas.setCursor("grab");
      canvas.renderAll();
    } else if (mousePressed && currentMode === modes.draw) {
      console.log("mouse is moving in draw mode");
      canvas.renderAll();
    }
  });

  canvas.on("mouse:up", function (event) {
    mousePressed = false;
    console.log("mouse is up");
    canvas.setCursor("default");
    canvas.renderAll();
  });
}

// zooming ability on canvas
canvas.on("mouse:wheel", function (opt) {
  var delta = opt.e.deltaY;
  var zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});

//////////////////////////////////////////////////////////////////////////////////// SPRITES
function addSprite() {
  //fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";
  fabric.Object.prototype.transparentCorners = true;
  i = canvas.width / 2; //left
  j = canvas.height / 2; //top
  fabric.Sprite.fromURL(
    "lib/walking man 01 - horizontal sprite.png",
    createSprite(i, j)
  );

  function createSprite(i, j) {
    return function (sprite) {
      sprite.set({
        left: i,
        top: j,
        opacity: 1,
        objectCaching: false,
        fill: color,
        //lockMovementY: true,
      });
      sprite.on("selected", function () {
        //sprite.opacity=0.75 ;
      });
      sprite.on("deselected", function () {
        //sprite.opacity=1 ;
      });
      sprite.perPixelTargetFind = true;
      canvas.add(sprite);
      sprite.play();

      console.log("sprite created");
      /*setTimeout(function () {
				sprite.set("dirty", true);
			}, fabric.util.getRandomInt(1, 10) * 100); */
    };
  }
  (function render() {
    canvas.renderAll();
    fabric.util.requestAnimFrame(render);
  })();
}

function hideShow() {
  if ((canvas.getActiveObject().visible = true)) {
    canvas.getActiveObject().visible = false;
    canvas.renderAll();
  } else {
    canvas.getActiveObject().visible = true;
    canvas.renderAll();
  }
}

//////////////////////////////////////////////////////////////////////////////////// ANIMATE
//the function moveRect apparently applies to all objects and not just rectangles
function moveRect() {
  var activeRect = canvas.getActiveObject();
  if (activeRect != null) {
    activeRect.animate(
      "left",
      activeRect.left === 0
        ? Math.random() * canvas.width
        : Math.random() * canvas.width,
      {
        duration: 2000,
        onChange: canvas.renderAll.bind(canvas),
        easing: fabric.util.ease.easeInOutCubic,
      }
    );
  } else {
    console.log("no active selection");
  }
}

//////////////////////////////////////////////////////////////////////////////////// BUTTON POSITIONING
var btn = document.getElementById("currentModeDiv"),
  btnWidth = 85,
  btnHeight = 18;

function positionBtn(obj) {
  var absCoords = canvas.getAbsoluteCoords(obj);
  btn.style.left = absCoords.left - btnWidth / 2 + "px";
  btn.style.top = absCoords.top - btnHeight / 2 + "px";
}

////////////////////////////////////////
setBackground("lib/section 3.jpg", canvas);
setMouseEvents(canvas);

setColorListener();
setWidthListener();
setOpacityListener();
//  document.getElementById("canvas-mode").innerHTML = currentMode

/*
To develop :
1. the delete button only removes individual objects but not groups
2. error when changing color and there is not active selection
*/
