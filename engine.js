const TILE_SIZE = 16;

function Screen(){
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.drawlist = [];
}

Screen.prototype.draw = function(){
    this.ctx.clearRect(0,0,this.width, this.height);
    for(let i = 0; i < this.drawlist.length; ++i){
	this.drawlist[i].draw(this.ctx);
    }
};

function BasicMap(json){
    this.tiles = json.tiles;
}

BasicMap.prototype.draw = function(ctx){
    for(let x = 0; x < this.tiles.length; ++ x){
	for(let y = 0; y < this.tiles[0].length; ++ y){
	    if(this.tiles[x][y]){
		ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
	    }
	}
    }
};

function Player(map, stats){
    this.map = map;
    this.x = stats.x;
    this.y = stats.y;
    this.a = Point.fromPoint(stats.gravity);
    this.mv = Point.fromPoint(stats.max_velocity);
    this.dx = stats.dx;
    this.jv = stats.jump_velocity;
    this.dy = stats.dy;
    this.mdx = stats.maxDx;
    this.mdy = stats.maxDy;
    this.w = TILE_SIZE;
    this.h = TILE_SIZE;
    this.mj = stats.max_jumps;
    this.gnd = this.mj;
    this.testing = {sx: 0, sy: 0, nxp:0, nyp:0, nx:0, ny:0};
}

Player.prototype.jump = function(){
    if(this.gnd <= 0) return;
    --this.gnd;
    this.dy = this.jv;
}

Player.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    /*ctx.fillStyle = "rgba(0,255,0,0.5)";
    const sx = this.testing.sx < 0 ? 16 : 0;
    const sy = this.testing.sy < 0 ? 16 : 0;
    ctx.fillRect(this.testing.nxp, this.testing.ny, this.w, this.h * 2);
    ctx.fillRect(this.testing.nx, this.testing.nyp, this.w * 2, this.h);*/
    ctx.restore();
};

Player.prototype.step = function(dt){
    //apply acceleration
    this.dx += this.a.x;
    this.dy += this.a.y;
    //console.log(this.dy);
    //sign of movement
    const sx = this.dx < 0 ? -1 : 1;
    const sy = this.dy < 0 ? -1 : 1;
    this.testing.sx = sx;
    this.testing.sy = sy;

    //check if we exceed maximum game velocity
    if(this.dx * sx >= this.mv.x)
	this.dx = this.mv.x * sx;
    if(this.dy * sy >= this.mv.y)
	this.dy = this.mv.y * sy;

    //delta movement for this frame
    let dx = dt * this.dx;
    let dy = dt * this.dy;

    //maximum we can actually move without breaking
    //the maths. However, we don't coordinate,
    //so we *might* get weird behaviours
    //dependant on frame rate
    if(dx * sx > this.mdx)
	dx = this.mdx * sx;
    if(dy * sy > this.mdy)
	dy = this.mdy * sy;
    
    let nx = this.x + dx;
    let ny = this.y + dy;
    let rxp = this.x / TILE_SIZE;
    let ryp = this.y / TILE_SIZE;
    const xp = rxp | 0;
    const yp = ryp | 0;
    rxp -= xp;
    ryp -= yp;
    const nxp = sx == 1 ? xp + sx : nx / TILE_SIZE | 0;
    const nyp = sy == 1 ? yp + sy : ny / TILE_SIZE | 0;
    this.testing.nxp = nxp * TILE_SIZE;
    this.testing.nyp = nyp * TILE_SIZE;
    this.testing.nx = xp * TILE_SIZE;
    this.testing.ny = yp * TILE_SIZE;
    
    const distx = (nxp * TILE_SIZE - this.x) * sx;
    const disty = (nyp * TILE_SIZE - this.y) * sy;
    const mainx = this.map.tiles[nxp][yp],
	  mainy = this.map.tiles[xp][nyp];

    if(mainx || (ryp != 0 && distx >= disty && !mainy && this.map.tiles[nxp][nyp])){
	this.gnd = this.mj;
	nx = (xp) * TILE_SIZE;
	this.dx = 0;
    }
    
    //slight issue - player can clip into ground for a frame
    if(mainy || (rxp != 0 && disty >= distx && !mainx && this.map.tiles[nxp][nyp])){
	if(sy == 1)
	    this.gnd = this.mj;
	ny = (yp) * TILE_SIZE;
	this.dy = 0;
    }
    this.x = nx;
    this.y = ny;
};

function nextFrame() {
    return new Promise(window.requestAnimationFrame);
}

let up_down = false;
function onkeydown (e){
    let key = e.which;
    if(key == 38 && !up_down){
	player.jump();
	up_down = true;
    }

    if(key == 37){
	player.dx = -0.3;
    }
    if(key == 39){
	player.dx = 0.3;
    }

}

function onkeyup (e){
    let key = e.which;
    if(key == 38){
	up_down = false;
    }
    if(key == 37 && player.dx < 0){
	player.dx = 0;
    }
    if(key == 39 && player.dx > 0){
	player.dx = 0;
    }
}

window.addEventListener("keydown", onkeydown);
window.addEventListener("keyup", onkeyup);

