const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const width = document.getElementById("width");
const color = document.getElementById("color");

let drawing = false;
let tool = "pen";
let startX;
let startY;
let shapes = [];
let currentPath = [];
let preview = null;

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.lineWidth = width.value;
ctx.lineCap = "round";

const tools = ["pen", "eraser" , "square", "clear"];

tools.forEach(item =>{
    document.getElementById(item).onclick = () =>{
        if(item !== "clear"){
            tool = item;
            tools.forEach(el =>{
                document.getElementById(el).classList.remove("active");
            })

            document.getElementById(item).classList.add("active");
        }else{
            tools.forEach(el =>{
                document.getElementById(el).classList.remove("active");
            })

            document.getElementById(tool).classList.add("active");

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            shapes = [];
            currentPath = [];
            preview = null;
        }
    }
})

canvas.addEventListener("mousedown", (e) =>{
    drawing = true;

    startX = e.clientX;
    startY = e.clientY;

    if(tool === "pen" || tool === "eraser"){
        currentPath = [];
    }
})

canvas.addEventListener("mousemove", (e) =>{
    if(drawing != true){return};

    if(tool === "pen" || tool=== "eraser"){

        currentPath.push({
            x: e.clientX,
            y: e.clientY,
            width: width.value,
            color: color.value
        })

        preview = {
            type: tool,
            points: currentPath,
            width: width.value,
            color: color.value
        }

        render();
    } 
    

    if(tool === "square"){

        preview = {
            type: tool,
            x: startX,
            y: startY,
            w: e.clientX - startX,
            h: e.clientY - startY,
            width: width.value,
            color: color.value
        }
        
        render();
    }
});

canvas.addEventListener("mouseup", (e) =>{
    drawing = false;
    
    if(preview){
        shapes.push(preview);
    }
        
    preview = null;
    currentPath = [];
    render();
})

function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach(shape => drawShape(shape));

    if(preview){
        drawShape(preview);
    }
}

function drawShape(shape){
    if(shape.type === "square"){
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.width;
        ctx.beginPath();
        ctx.rect(shape.x, shape.y, shape.w, shape.h);
        ctx.stroke();
    }

    if(shape.type === "pen"){
        ctx.beginPath();
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.width;
        shape.points.forEach((p, i) =>{
            if(i == 0){
                ctx.moveTo(p.x, p.y);
            }else{
                ctx.lineTo(p.x, p.y)
            }
            })

        ctx.stroke();
    }

    if(shape.type === "eraser"){
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.lineWidth = shape.width;
            shape.points.forEach((p, i) =>{
                if(i == 0){
                    ctx.moveTo(p.x, p.y);
                }else{
                    ctx.lineTo(p.x, p.y)
                }
            })
        ctx.stroke();
    }
}