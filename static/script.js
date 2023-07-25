'use strict'
const canvas = document.createElement('canvas'); canvas.textContent = 'Your browser does not support this game.'
const main = document.querySelector('main'); main.append(canvas); canvas.id = "game";
const header = document.querySelector('header');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const Engine = {
    mouse : {
        prevX : null,
        prevY : null,
        x : null,
        y : null,
        isPressed : false
    },
    physicsTimeout : 0,
    context : canvas.getContext('2d'),
    context_rect : canvas.getBoundingClientRect(),
    list : [],
    clear : () =>
    {
        list = [];
    },
    isBegin : true
}; 

window.onbeforeunload = () =>
{
    Engine.clear();
}

canvas.addEventListener('pointermove', (event) =>
{
    Engine.mouse.x = (event.clientX - Engine.context_rect.left) / canvas.width;
    Engine.mouse.y = (event.clientY - Engine.context_rect.top) / canvas.height;
    
})
canvas.addEventListener('pointerdown', (event) =>
{
    Engine.mouse.isPressed = true;
    Engine.isBegin = true;
})
canvas.addEventListener('pointerup', (event) =>
{
    Engine.mouse.isPressed = false;
})


Engine.context.fillStyle = 'rgb(255,255,255)'
Engine.context.strokeStyle = 'rgb(255,255,255)'


async function mainCycle()
{
    if (!Engine.mouse.isPressed) 
    {
        Engine.mouse.prevX = Engine.mouse.x;
        Engine.mouse.prevY = Engine.mouse.y;
        return
    };
    // Engine.context.arc(Engine.mouse.x, Engine.mouse.y, 10, 0, 6.28)
    /*
    Engine.context.moveTo(Engine.mouse.prevX, Engine.mouse.prevY);
   
    Engine.context.lineTo(Engine.mouse.x, Engine.mouse.y);
    Engine.context.stroke();
*/
    let response = fetch('/position',
    {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body : 
        JSON.stringify({prevX : Engine.mouse.prevX, prevY:  Engine.mouse.prevY,
             x : Engine.mouse.x, y : Engine.mouse.y, isBegin : Engine.isBegin})
    })

    Engine.mouse.prevX = Engine.mouse.x;
    Engine.mouse.prevY = Engine.mouse.y;
    Engine.isBegin = false;
    await response;
}

function drawFetched({prevX, prevY, x, y, isBegin})
{
    if (isBegin)
    {
        Engine.context.beginPath();
    }
    Engine.context.moveTo(prevX * canvas.width, prevY * canvas.height);
    Engine.context.lineTo(x * canvas.width, y * canvas.height);
    Engine.context.stroke();
  
}
async function fetchList()
{
    const url = new URL(location.origin  + '/list');
    url.searchParams.set('start', (Engine.list.length).toString())
    console.log(url.toString())
    let response = await fetch(url.toString(),
    {
        method : "GET"
    })
    const body = await response.json();
    if (body.start != Engine.list.length) return;
    body.slice.forEach(element => {
        drawFetched(element)
        Engine.list.push(element)
    });
    console.log(body.slice.length)
}
setInterval(mainCycle, 16.66)
setInterval(fetchList, 50)
