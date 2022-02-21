console.log ("This is javascript")

let bool = true

const canvas = new fabric.Canvas('canvas', {
    width: 500,
    height: 500,
   
    fireRightClick: true,
    isDrawingMode: true,
    selectionColor : 'white',
    });

canvas.renderAll();

fabric.Image.fromURL ('https://cdn.pixabay.com/photo/2016/11/23/13/48/beach-1852945_960_720.jpg', (img) => {
    canvas.backgroundImage = img 
    canvas.renderAll()
})



