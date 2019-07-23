class Hex {
    x:number;
    y:number;
    z:number;
    size:number;
    stroke:string;
    color:string;
    defaultColor:string;
    corners:Array<[number,number]>;

    constructor(x:number, y:number, size:number){
        this.x = x;
        this.y = y;
        this.z = 0;
        this.size = size;
        this.color = '#101115';
        this.defaultColor = '#101115';
        this.stroke = '#1012f';
        this.corners = [];
        
    }

    // set the fill color
    setColor(color:string){
        this.color = color;
        this.defaultColor = color;
       
    }

    setZ(z:number){
        this.z += z;
    }

    // set the stroke colour
    setStroke(stroke:string){
        this.stroke = stroke;
    }

    isMoveable():Boolean{
        return this.z >= 0;
    }

    select():void{
        this.defaultColor = this.color;
        this.color = 'red';
    }

    unselect():void{
        this.setColor(this.defaultColor);
    }

    setLocation(x:number, y:number, tiles:Array<[number, number]>){

        // simple distance calculation
        function dist(p1:[number,number], p2:[number,number]) {
            return Math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)
        }

        const findTile = (point:[number, number], current:[number, number]) => { 
            // if first run through just return the current tile
            if( !point ) { return current; }
            
            // return the center of the closest tile to the mouse
            if(  dist(point, [x,y]) < dist(current, [x,y]) ) { 
                return point;
            }
            else {
                return current;
            }
        }

        // find the center of the closest tile to the mouse click and set the center of the hex to this location (i.e grid snapping!)
        [this.x, this.y] = tiles.reduce(findTile);         
    }

    getLocation():[number, number]{
        return [this.x, this.y];
    }

    hex(){
        this.corners = [];
        let lx, ly = 0;
        for(let side = 0; side < 7; side++){
            lx = this.x + this.size * Math.cos(side * 2 * Math.PI / 6);
            ly = this.y + this.size * Math.sin(side * 2 * Math.PI / 6);
            this.corners.push([lx, ly]); 
        }
    }

    update(){
        //
    }

    clickEvent(cx:number, cy:number, tiles:Array<[number, number]> ){
        this.setLocation(cx, cy, tiles);
    }

    draw(ctx:CanvasRenderingContext2D){
        // update the locations of the corners
        this.hex();

        ctx.strokeStyle = this.stroke;
        ctx.fillStyle = this.color;
        let [lx, ly] = this.corners[1];
               
        // start the path
        ctx.beginPath();        
        ctx.moveTo(lx,ly);
        
        // between each corner, draw a line
        this.corners.forEach((point)=>{
            [lx, ly] = point;
            ctx.lineTo(lx,ly);
        })       

        // am i pretty?
        let my_gradient = ctx.createLinearGradient(this.x, this.y, this.x+ this.size, this.y+this.size);
        my_gradient.addColorStop(0, this.color);
        my_gradient.addColorStop(1, 'grey');
        ctx.fillStyle = my_gradient;
        ctx.fill();
        ctx.stroke();
    }
}
