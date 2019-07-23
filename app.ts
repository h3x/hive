(() => {
    const canvas = document.getElementById('game') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as  CanvasRenderingContext2D;
    
    // initially size the canvas the same as the viewport size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // tile attributes
    const size = 50;
    const heightSpace =  Math.sqrt(3) * size
    const widthSpace = 2 * size * 3/4;
    const tileCenters:Array<[number, number]> = [];
    const pieces:Hex[] = [];
 

    // called when the canvas needs to be resized
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = '#101115';
        ctx.fillRect(0,0,canvas.width, canvas.height);
        
    }

    function hex(x:number, y:number, size:number){
        const sides:Array<[number, number]> = [];
        for(let side = 0; side < 7; side++){
            const lx = x + size * Math.cos(side * 2 * Math.PI / 6);
            const ly = y + size * Math.sin(side * 2 * Math.PI / 6);
            sides.push([lx, ly]);
        }
        return sides;
    }

    function drawHex(x:number, y:number, size:number){
        // get all the corner points for the hex
        const hexPoints:Array<[number, number]> = hex(x,y,size);
        
        // start the path
        ctx.beginPath();
        const s = hexPoints.shift();
        if(s){
            const [sx, sy] = s;
            ctx.moveTo(sx,sy);
            
            // draw the hex
            hexPoints.forEach((point)=>{
                const [lx, ly] = point;
                ctx.lineTo(lx,ly);
            })       
            ctx.strokeStyle = '#1012f';
            ctx.fill();
            ctx.stroke();
        }
    }

    // calculate the centers of the map tiles to be used for grid snapping later
    function calcCenters(){
        for(let x = 50; x < canvas.width; x += widthSpace * 2 ) {
            for(let y = 50; y< canvas.height; y += heightSpace){
                ctx.lineWidth = 2;
                tileCenters.push([x,y]);
                tileCenters.push([x + widthSpace,y + heightSpace/2]);
            }
        }
    }

    // initial game setup
    function setup(){
        // calculate the centers of the board tiles
        calcCenters();

        // create 10 random pieces
        for(let i = 0; i < 10; i++){
            const hx = Math.floor(Math.random() * canvas.width);
            const hy = Math.floor(Math.random() * canvas.height);
            const h = new Hex(0,0, size)
            if( i % 2 == 0){
                h.setColor('#c5c6c7');
            }
            else{
                h.setColor('#66fcf1');
            }
            h.setLocation(hx, hy, tileCenters);
            pieces.push(h);
        }

        console.log(pieces) 

        // listen for click events
        let selectedHex:Hex|undefined;
        let stack:Hex[] = [];
        canvas.addEventListener("mousedown", evt => {
            const rect = canvas.getBoundingClientRect();
            const cx = evt.clientX - rect.left;
            const cy = evt.clientY - rect.top;

            function dist(p1:[number,number], p2:[number,number]) {
                return Math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)
            }

            if(!selectedHex) {
                pieces.forEach(piece =>{
                    if(dist([cx, cy], piece.getLocation()) < size && piece.isMoveable()){
                        selectedHex = piece;
                        selectedHex.select()
                    }
                })
            }
            else {
                // TODO: All this is about piece stacking. think about this a little more
                // pieces.forEach(piece =>{
                //     if(dist([cx, cy], piece.getLocation()) < size && selectedHex){
                //         piece.setZ(-1);
                //         selectedHex.size = 40;
                //     }
                // })
                // console.log(stack)
                // stack = [];
                selectedHex.setLocation(cx, cy, tileCenters);
                pieces.forEach( p => p.unselect())
                selectedHex = undefined;
            }


            //h.setLocation(cx , cy, tileCenters); // TODO change this
        })

        //resize the canvas to 100% viewport width and height whenever window is resized
        window.addEventListener('resize', () => {
            resizeCanvas();
            calcCenters();
        }, false);

        // start the gameloop
        window.setInterval(() => draw(), 20/1000);
    }


    // the draw loop
    function draw(){
        // clear the screen on every frame
        ctx.fillStyle = '#101115';
        ctx.fillRect(0,0,canvas.width, canvas.height);
        
        ctx.strokeStyle = 'black';       

        tileCenters.forEach( tile => {
            drawHex(tile[0], tile[1], size);
        })

        pieces.forEach( p => p.draw(ctx))
    }
   
    // Setup to initial state of the game
    setup();
})()