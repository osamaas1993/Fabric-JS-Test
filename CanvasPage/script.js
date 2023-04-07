/* @format */

console.log("This is javascript");
// set canvas width and height to the window width and height
function setCanvasSize() {
  canvas.setHeight(Number(window.innerHeight));
  canvas.setWidth(Number(window.innerWidth));
}

//////////////////////////////////////////////////////////////////////////////////// CANVAS CREATION

//function for creating the canvas, the function includes its parameters
function initCanvas(id) {
  return new fabric.Canvas(id, {
    height: 1000,
    width: 1000,
    isDrawingMode: false,
    snapAngle: 10,
    skipTargetFind: false,
    backgroundColor: "white",
    uniformScaling: false,
    selection: true,
    backgroundCaching: true,
  });
}
//setting the canvas background through URL
function setBackground(url, canvas) {
  fabric.Image.fromURL(url, function () {
    canvas.setBackgroundColor({ source: url, repeat: "repeat" }, function () {
      canvas.renderAll();
    });
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
  animate: "animateMode",
  lineArrow: "lineArrowMode",
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
  } else if (currentMode === "animateMode") {
    document.getElementById(
      "currentModeDiv"
    ).innerHTML = `Active Mode : <strong>Animate mode</strong>`;
  } else {
    document.getElementById(
      "currentModeDiv"
    ).innerHTML = `Active Mode : <strong>Build/Select mode</strong>`;
    /*document.getElementById(
      "instructions"
    ).innerHTML = `<p>Select an object to edit it, or shift left click to create guide</p>`;*/
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
    canvas.freeDrawingBrush.color = color;
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().fill = color;
    }
    canvas.renderAll();
  });
}

// modifying the element fill
// listen to checkbox with id "fill"

function setFillListener() {
  const fillCheck = document.getElementById("objectFill");
  fillCheck.addEventListener("change", function () {
    activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set("fill", color);
      console.log("fill checkbox is checked");
      canvas.renderAll();
    } else {
      console.log("no active selection");
    }
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
    canvas.skipTargetFind = false;
    console.log(currentMode);
    removeCirclePointer();
  } else {
    (currentMode = "buildMode"), console.log(currentMode);
  }
}

//for the toggle animate button
function toggleAnimate() {
  if (currentMode !== "animateMode") {
    currentMode = "animateMode";
    canvas.isDrawingMode = false;
    canvas.skipTargetFind = false;
    console.log(currentMode);
    canvas.selection = true;
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
    removeCirclePointer();
    canvas.selection = true;
  }
}

//for the toggle line arrow button
/*
function createLineArrow() {
  if (currentMode !== "lineArrowMode") {
    currentMode = "lineArrowMode";
    canvas.skipTargetFind = false;
    canvas.isDrawingMode = false;
    console.log(currentMode);
    removeCirclePointer();
    canvas.selection = true;
  }
}
*/
//for the toggle draw button and drawing paramters
function toggleDraw() {
  if (currentMode !== "drawMode") {
    currentMode = "drawMode";
    console.log(currentMode);
    canvas.isDrawingMode = true;
    //drawing propoerties below
    canvas.freeDrawingBrush.strokeLineCap = "round"; //options are "butt" "round" "square"
    canvas.freeDrawingBrush.strokeLineJoin = "miter"; //options are "bevel", "round", "miter"
    removeCirclePointer();
    canvas.selection = true;
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

function createTriangle() {
  var triangle = new fabric.Triangle({
    width: 100,
    height: 100,
    fill: color,
    top: -50,
    left: canvas.width / 2,
    originX: "center",
    originY: "center",
    objectCaching: false,
  });
  canvas.add(triangle);
  canvas.renderAll();
  triangle.animate("top", canvas.height / 2, {
    onChange: canvas.renderAll.bind(canvas),
    duration: 1000,
    easing: fabric.util.ease.easeInOutCubic,
  });
  console.log("create triangle button");
  triangle.on("selected", function () {
    //triangle.opacity=0.75 ;
  });
  triangle.on("deselected", function () {
    //triangle.opacity=1 ;
  });
}

function createPolygon() {
  var polygon = new fabric.Polygon(
    [
      { x: -50, y: -50 },
      { x: 50, y: -50 },
      { x: 0, y: 50 },
    ],
    {
      fill: color,
      top: -50,
      left: canvas.width / 2,
      originX: "center",
      originY: "center",
      objectCaching: false,
    }
  );
  canvas.add(polygon);
  canvas.renderAll();
  polygon.animate("top", canvas.height / 2, {
    onChange: canvas.renderAll.bind(canvas),
    duration: 1000,
    easing: fabric.util.ease.easeInOutCubic,
  });
  console.log("create polygon button");
  polygon.on("selected", function () {
    //polygon.opacity=0.75 ;
  });
  polygon.on("deselected", function () {
    //polygon.opacity=1 ;
  });
}

// create line and arrow
/*
fabric.LineArrow = fabric.util.createClass(fabric.Line, {
  type: "lineArrow",

  initialize: function (element, options) {
    options || (options = {});
    this.callSuper("initialize", element, options);
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper("toObject"));
  },

  _render: function (ctx) {
    this.callSuper("_render", ctx);

    // do not render if width/height are zeros or object is not visible
    if (this.width === 0 || this.height === 0 || !this.visible) return;

    ctx.save();

    var xDiff = this.x2 - this.x1;
    var yDiff = this.y2 - this.y1;
    var angle = Math.atan2(yDiff, xDiff);
    ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
    ctx.rotate(angle);
    ctx.beginPath();
    //move 10px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
    ctx.moveTo(10, 0);
    ctx.lineTo(-20, 15);
    ctx.lineTo(-20, -15);
    ctx.closePath();
    ctx.fillStyle = this.stroke;
    ctx.fill();

    ctx.restore();
  },
});

fabric.LineArrow.fromObject = function (object, callback) {
  callback &&
    callback(
      new fabric.LineArrow([object.x1, object.y1, object.x2, object.y2], object)
    );
};

fabric.LineArrow.async = true;

var Arrow = (function () {
  class Arrow {
    constructor(canvas) {
      this.canvas = canvas;
      this.className = "Arrow";
      this.isDrawing = false;
      this.bindEvents();
    }
    bindEvents() {
      var inst = this;

      inst.canvas.on("mouse:down", function (o) {
        if (currentMode === "lineArrowMode") {
          inst.onMouseDown(o);
          console.log("mouse down for line arrow");
          canvas.skipTargetFind = true;
          canvas.selection = false;
          changeModeName();
        }
      });
      inst.canvas.on("mouse:move", function (o) {
        inst.onMouseMove(o);
      });
      inst.canvas.on("mouse:up", function (o) {
        if (currentMode !== "buildMode") {
          currentMode = "buildMode";
          inst.onMouseUp(o);
          canvas.skipTargetFind = false;
          canvas.selection = true;
          console.log("mouse up for line arrow");
        }
      });
      inst.canvas.on("object:moving", function (o) {
        inst.disable();
      });
    }
    onMouseUp(o) {
      var inst = this;
      inst.disable();
    }
    onMouseMove(o) {
      var inst = this;
      if (!inst.isEnable()) {
        return;
      }

      var pointer = inst.canvas.getPointer(o.e);
      var activeObj = inst.canvas.getActiveObject();
      activeObj.set({
        x2: pointer.x,
        y2: pointer.y,
      });
      activeObj.setCoords();
      inst.canvas.renderAll();
    }
    onMouseDown(o) {
      var inst = this;
      inst.enable();
      var pointer = inst.canvas.getPointer(o.e);

      var points = [pointer.x, pointer.y, pointer.x, pointer.y];
      const widthPicker = document.getElementById("drawing-line-width");
      widthPicker.addEventListener("change", function (event) {
        drawWidth = Number(event.target.value);
      });
      var line = new fabric.LineArrow(points, {
        strokeWidth: drawWidth,
        fill: color,
        stroke: color,
        originX: "center",
        originY: "center",
        hasBorders: true,
        hasControls: true,
      });

      inst.canvas.add(line).setActiveObject(line);
    }
    isEnable() {
      return this.isDrawing;
    }
    enable() {
      this.isDrawing = true;
    }
    disable() {
      this.isDrawing = false;
    }
  }

  return Arrow;
})();
var arrow = new Arrow(canvas);
*/
// end of line and arrow creation

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
    "/lib/walking man 01 - horizontal sprite.png",
    createSprite(i, j)
  );

  function createSprite(i, j) {
    return function (sprite) {
      sprite.set({
        left: i,
        top: j,
        originX: "center",
        originY: "center",
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
// end of sprite creation function

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
// movement currently only takes into account LEFT coordinates of the target point

function animateToLoop() {
  var activeObj = canvas.getActiveObject();

  var durationVar =
    (Math.abs(activeObj.left - document.getElementById("moveObjectX").value) /
      Number(document.getElementById("animateSpeed").value)) *
    100;

  if (
    activeObj != null &&
    currentMode == "animateMode" &&
    activeObj.type == "sprite"
  ) {
    // animate sprite from current position to target position then animate back to current position
    const currentX = activeObj.left;
    const currentY = activeObj.top;
    function animateBack() {
      // flip the activeObj on its X axis
      activeObj.set("flipX", !activeObj.get("flipX"));
      activeObj.animate(
        {
          left: currentX,
          top: currentY,
        },
        {
          duration: durationVar,
          onChange: canvas.renderAll.bind(canvas),
          easing: fabric.util.ease.easeLinear,
        }
      );
    }
    activeObj.animate(
      {
        left: document.getElementById("moveObjectX").value,
        top: document.getElementById("moveObjectY").value,
      },
      {
        duration: durationVar,
        onChange: canvas.renderAll.bind(canvas),
        easing: fabric.util.ease.easeLinear,
        // on complete flip the stripe back
        onComplete: animateBack,
      }
    );

    console.log("animation complete with repeat ");
  } else if (
    activeObj != null &&
    currentMode == "animateMode" &&
    activeObj.type !== "sprite"
  ) {
    const currentX = activeObj.left;
    const currentY = activeObj.top;
    function animateBack() {
      // flip the activeObj on its X axis
      activeObj.set("flipX", !activeObj.get("flipX"));
      activeObj.animate(
        {
          left: currentX,
          top: currentY,
        },
        {
          duration: durationVar,
          onChange: canvas.renderAll.bind(canvas),
          easing: fabric.util.ease.easeLinear,
        }
      );
    }
    activeObj.animate(
      {
        left: document.getElementById("moveObjectX").value,
        top: document.getElementById("moveObjectY").value,
      },
      {
        duration: durationVar,
        onChange: canvas.renderAll.bind(canvas),
        easing: fabric.util.ease.easeLinear,
        // on complete flip the stripe back
        onComplete: animateBack,
      }
    );

    console.log("not sprite animation complete with repeat ");
  } else {
    console.log("no active selection");
  }
}

// function to stop any on going animations ???????????????
function stopAnimation() {
  var activeObj = canvas.getActiveObject();
  if (activeObj != null && currentMode == "animateMode") {
    activeObj.stop();
    console.log("animation stopped");
  } else {
    console.log("no active selection");
  }
}

// function that listens to when the user presses on an empty point with the shift button on the canvas when in Animate mode and uses coordinates for html inputs moveObjectX and moveObjectY
function setMouseEvents(canvas) {
  canvas.on("mouse:down", function (opt) {
    activeSelection = canvas.getActiveObject();
    if (opt.e.shiftKey && currentMode == "animateMode") {
      var pointer = canvas.getPointer(opt.e);
      document.getElementById("moveObjectX").value = pointer.x.toFixed(2);
      document.getElementById("moveObjectY").value = pointer.y.toFixed(2);
      var circle = new fabric.Circle({
        radius: 5,
        fill: "red",
        left: pointer.x - 5,
        top: pointer.y - 5,
        hasBorders: false,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        selectable: false,
        opacity: 0.5,
        name: "circlePointer",
      });
      canvas.add(circle);
      console.log("pointer created");
    }
    // select activeSelection
    if ((activeSelection = null)) {
      canvas.setActiveObject(activeSelection);
    }
  });
}

// function that finds circle with name "circlePointer" and removes it
function removeCirclePointer() {
  var circle = canvas
    .getObjects()
    .filter((obj) => obj.name === "circlePointer");
  if (circle) {
    circle.forEach((obj) => canvas.remove(obj));
    console.log("circlePointer removed");
    document.getElementById("moveObjectX").value = 0;
    document.getElementById("moveObjectY").value = 0;
  }
}

//////////////////////////////////////////////////////////////////////////////////// IMPORTING IMAGES TO CANVAS
// function that imports an uploaded image to the canvas as in object
document.getElementById("file").addEventListener("change", function (e) {
  var file = e.target.files[0];
  var reader = new FileReader();
  reader.onload = function (f) {
    var data = f.target.result;
    fabric.Image.fromURL(data, function (img) {
      var oImg = img.set({ left: 50, top: 100, angle: 00 }).scale(1);
      canvas.add(oImg).renderAll();
      canvas.setActiveObject(oImg);
      //var dataURL = canvas.toDataURL({ format: "jpeg", quality: 0.8 });
      //console.log("Canvas Image " + dataURL);
      //document.getElementById("txt").href = dataURL;
    });
  };
  reader.readAsDataURL(file);
});

// getting the image uploaded to id "fileBackground" and setting it as background to the canvas
document
  .getElementById("fileBackground")
  .addEventListener("change", function (e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (f) {
      var data = f.target.result;
      fabric.Image.fromURL(data, function (img) {
        var oImg = img.set({ left: 0, top: 0, angle: 00 }).scale(1);
        canvas.setBackgroundImage(oImg, canvas.renderAll.bind(canvas));
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  });

// a downloadImage function that exports the canvas as an image
function downloadImage() {
  var guide = canvas.getObjects().filter((obj) => obj.name === "guide");
  if (guide) {
    guide.forEach((obj) => (obj.visible = false));
  }
  var image = canvas.toDataURL("image/png");
  var link = document.createElement("a");
  link.download = "canvas.png";
  link.href = image;
  link.click();
  if (guide) {
    guide.forEach((obj) => (obj.visible = true));
  }
}

////////////////////////////////////////
setBackground("/lib/svg-grid.svg", canvas);
setMouseEvents(canvas);
setColorListener();
setWidthListener();
setOpacityListener();
//  document.getElementById("canvas-mode").innerHTML = currentMode

/*
To develop :
*/
//////////////////////////////////////////////////////////////////////////////////// ELEMENTS ORDER ON CANVAS

// function that pushes an element backwards
function pushBackwards() {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.sendBackwards();
    canvas.renderAll();
  }
}

// function that pushes an element forwards
function pushForwards() {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.bringForward();
    canvas.renderAll();
  }
}

//////////////////////////////////////////////////////////////////////////////////// HTML BUTTON POSITIONING ON CANVAS

// function that positions btn above the selected object if an object is selected
/*(function () {
  //fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";

  var canvasZoom = canvas.getZoom();

  fabric.Canvas.prototype.getAbsoluteCoords = function (object) {
    return {
      left: object.left * canvasZoom,
      top: object.top * canvasZoom,
      width: object.scaleX * object.width * canvasZoom,
      height: object.scaleY * object.height * canvasZoom,
    };
  };

  var btn = document.getElementById("hover");
  (btnWidth = 85), (btnHeight = 18);

  function positionBtnAbove(obj) {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      // add 1 second delay

      btn.hidden = false;
      var absCoords = canvas.getAbsoluteCoords(obj);
      //take into account canvas zoom level
      var scale = canvas.getZoom();
      btn.style.left = absCoords.left * scale + "px";
      btn.style.top = absCoords.top * scale + "px";
    }
  }

  //when an object is selected and moved, execute positionBtnAbove, when an object is deselected, hide the button

  canvas.on("selection:cleared", function (e) {
    btn.hidden = true;
  });

  canvas.on("mouse:move", function (opt) {
    // verify if mouse is on top of an object
    var pointer = canvas.getPointer(opt.e);
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      var object = canvas.findTarget(pointer);
      if (object == activeObject) {
        positionBtnAbove(object);
      }
    }
  });
})();*/

// function that adds textbox to the center of the canvas
function addTextBox() {
  var textbox = new fabric.Textbox("Textbox", {
    left: 500,
    top: 500,
    width: 200,
    height: 100,
    fontSize: 20,
    fill: "black",
    fontFamily: "Arial",
    //fontWeight: "bold",
    //fontStyle: "italic",
    textAlign: "center",
    originX: "center",
    originY: "center",
    hasBorders: true,
    hasControls: true,
    lockMovementX: false,
    lockMovementY: false,
    selectable: true,
    //name: "textbox",
  });
  canvas.add(textbox);
  canvas.setActiveObject(textbox);
}

// when mouse clicked and held on object with control key pressed, create a copy of the object that is placed when the mouse is released
(function copyObject() {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    var copy = activeObject.clone();
    canvas.add(copy);
    canvas.setActiveObject(copy);
  }
})();

//////////////////////////////////////////////////////////////////////////////////// GUIDES

// function that adds a horizontal guide to the canvas, position are x y parameters,
function addHorizontalGuide(x, y) {
  var scale = canvas.getZoom();
  var width = 100000;
  var height = 20;
  var top = y;
  var left = x;
  var guide = new fabric.Line(
    [left, top + height / 2, left + width, top + height / 2],
    {
      stroke: "blue",
      strokeWidth: 1,
      selectable: true,
      originX: "center",
      originY: "center",
      lockMovementX: true,
      lockMovementY: false,
      hasBorders: false,
      hasControls: false,
      //every guide has a unique number in its name
      name: "guide",
      excludeFromExport: true,
      //strokeDashArray: [10],
      top: top,
      left: left,
    }
  );

  canvas.add(guide);
  canvas.setActiveObject(guide);
}

// if in buildMode, and user presses mouse button with shift, execute addHorizontalGuide
(function addHorizontalGuideListener() {
  if (currentMode == "buildMode") {
    canvas.on("mouse:down", function (opt) {
      if (opt.e.shiftKey) {
        var pointer = canvas.getPointer(opt.e);
        addHorizontalGuide(pointer.x, pointer.y);
        console.log("added horizontal guide");
      }
    });
  }
})();

// when an object overlaps a guide, lock its y position to the guide's y position
(function lockObjectToGuide() {
  canvas.on("object:moving", function (opt) {
    var activeObject = canvas.getActiveObject();
    if (activeObject && !opt.e.ctrlKey) {
      var guides = canvas.getObjects().filter((obj) => obj.name === "guide");
      guides.forEach((obj) => {
        if (
          activeObject.top < obj.top + obj.height &&
          activeObject.top + activeObject.height > obj.top
        ) {
          activeObject.top = obj.top - activeObject.height / 2;
        }
      });
    }
  });
})();

// function setSpriteListener listens to change in HTML select element and sets the sprite to the selected value
function setSpriteListener() {
  var spriteSelect = document.getElementById("spriteSelecter");
  spriteSelect.addEventListener("change", function () {
    var spriteName = spriteSelect.value;
    console.log(spriteName);
    canvas.getActiveObject().set("sprite", sprite);
    canvas.renderAll();
  });
}
