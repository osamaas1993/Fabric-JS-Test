/* @format */

console.log("This is javascript");

//////////////////////////////////////////////////////////////////////////////////// CANVAS CREATION

//function for creating the canvas, the function includes its parameters
function initCanvas(id) {
	return new fabric.Canvas(id, {
		width: 600,
		height: 400,
		isDrawingMode: false,
		selection: false,
		snapAngle: 10,
		snapThreshold: 10,
		skipTargetFind: false,
		backgroundColor: "rgba(240, 240, 240, 1.0)",
		selectionKey: "shiftKey",
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
		document.getElementById("currentModeDiv").innerHTML =  `Active Mode : <strong>Pan mode</strong>`
	}
	else if (currentMode === "drawMode") {
		document.getElementById("currentModeDiv").innerHTML =  `Active Mode : <strong>Draw mode</strong>`
	} else {
		document.getElementById("currentModeDiv").innerHTML =  `Active Mode : <strong>Build/Select mode</strong>`
	}	}
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
// modifying the drawing color using the color picker
function setColorListener() {
	const colorPicker = document.getElementById("colorPicker");
	colorPicker.addEventListener("change", function (event) {
		color = event.target.value;
		console.log(event.target.value);
		canvas.freeDrawingBrush.color = color;
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
	rect.animate ('top', canvas.height/2, {
		onChange:canvas.renderAll.bind(canvas),
		duration : 1000,
		easing: fabric.util.ease.easeInOutCubic,
	})
	rect.on('selected', function() {
		rect.opacity=0.75 ;
	})
	rect.on('deselected', function() {
		rect.opacity=1 ;
	})
}

function createCircle(canvas) {
	var circle = new fabric.Circle({
		radius: 50,
		fill: color,
		top: -50,
		left: canvas.width / 2,
		originX: "center",
		originY: "center",
	});
	canvas.add(circle);
	canvas.renderAll();
	circle.animate ('top', canvas.height/2, {
		onChange:canvas.renderAll.bind(canvas),
		duration : 1000,
		easing: fabric.util.ease.easeInOutCubic,
	})
	console.log("create circle button");
	circle.on('selected', function() {
		circle.opacity=0.75 ;
	})
	circle.on('deselected', function() {
		circle.opacity=1 ;
	})
}

//COPY AND PASTE FUNCTIONS
function Copy() {
	canvas.getActiveObject().clone(function (cloned) {
		_clipboard = cloned;
	});
}

function Paste() {
	// clone again, so you can do multiple copies.
	_clipboard.clone(function (clonedObj) {
		canvas.discardActiveObject();
		clonedObj.set({
			left: clonedObj.left + 10,
			top: clonedObj.top + 10,
			evented: true,
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

 //////////////////////////////////////////////////////////////////////////////////// SPRITES

 function addSprite() {
		//fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";
		fabric.Object.prototype.transparentCorners = true;
		i = canvas.width/2; //left
		j = canvas.height/2; //top
		fabric.Sprite.fromURL("lib/copper.png", createSprite(i, j));


		function createSprite(i, j) {
			return function (sprite) {
				sprite.set({
					left: i,
					top: j,
					opacity: 1,
				});
				sprite.on('selected', function() {
					sprite.opacity=0.75 ;
				})
				sprite.on('deselected', function() {
					sprite.opacity=1 ;
				})
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
 };

//////////////////////////////////////////////////////////////////////////////////// ANIMATE
function moveLeft() {
	console.log("move left button");
	canvas.getActiveObject.animate ('left', 50, {
		onChange:canvas.renderAll.bind(canvas),
		duration : 1000,
		easing: fabric.util.ease.easeInOutCubic,
	})

}

 ////////////////////////////////////////////////////////////////////////////////////////////////////

setBackground(
	"https://cdn.pixabay.com/photo/2016/11/23/13/48/beach-1852945_960_720.jpg",
	canvas,
);
setMouseEvents(canvas);

setColorListener();
setWidthListener();

//  document.getElementById("canvas-mode").innerHTML = currentMode
