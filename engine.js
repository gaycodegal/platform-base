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
    this.speed = stats.speed
    this.mj = stats.max_jumps;
    this.gnd = this.mj;
    this.testing = {sx: 0, sy: 0, nxp:0, nyp:0, nx:0, ny:0, probes:[]};
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
    this.testing.probes.map(x => x.draw(ctx));
    ctx.restore();
};

function Probe(map, x, y){
    x = x / TILE_SIZE | 0;
    y = y / TILE_SIZE | 0;
    this.pt = new Point(x, y);
    this.status = map.tiles[x][y];
    this.color = this.status ? "rgba(0,255,0,0.5)" : "rgba(0,0,255,0.5)";
}

Probe.prototype.draw = function(ctx){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pt.x * TILE_SIZE,this.pt.y * TILE_SIZE, TILE_SIZE,TILE_SIZE); 
};

Player.prototype.step = function (dt){
    if(new Probe(this.map, this.x, this.y).status)
	throw "fuck";
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
    //this appears to be the source of clipping. xp + sx and yp + sy don't quite do the trick
    const nxp = (nx / TILE_SIZE | 0) + (sx == 1 ? 0 : -sx);
    const nyp = (ny / TILE_SIZE | 0) + (sy == 1 ? 0 : -sy);
    this.testing.nxp = nxp * TILE_SIZE;
    this.testing.nyp = nyp * TILE_SIZE;
    this.testing.nx = xp * TILE_SIZE;
    this.testing.ny = yp * TILE_SIZE;
    
    const distx = (nxp * TILE_SIZE - this.x) * sx;
    const disty = (nyp * TILE_SIZE - this.y) * sy;
    const ddistx = (nxp * TILE_SIZE + TILE_SIZE * sx - this.x) * sx;
    const ddisty = (nyp * TILE_SIZE + TILE_SIZE * sy - this.y) * sy;
    const center = this.map.tiles[nxp][nyp],
	  mainx = this.map.tiles[nxp + sx][nyp],
	  mainy = this.map.tiles[nxp][nyp + sy],
	  diagonal = this.map.tiles[nxp + sx][nyp + sy];

    this.testing.probes = [[nxp, nyp], [nxp + sx, nyp], [nxp, nyp + sy], [nxp + sx, nyp + sy]].map(x => new Probe(this.map, x[0] * TILE_SIZE, x[1] * TILE_SIZE));
    
    if((distx >= disty && center) || mainx || (ryp != 0 && ddistx > ddisty && diagonal)){
	//console.log(distx >= disty && center, mainx, ryp != 0 && distdiagx >= distdiagy && diagonal);
	if(dx != 0)
	    this.gnd = this.mj;
	nx = (nxp) * TILE_SIZE;

	this.dx = 0;
    }

    
    //slight issue - player can clip into ground for a frame
    if((disty >= distx && center) || mainy || (rxp != 0 && ddisty > ddistx && diagonal)){
	//console.log(dx, dy);
	if(!center && !mainy && mainx && diagonal){
	    console.log(center, mainy, mainx, diagonal, rxp != 0 && ddisty > ddistx && diagonal);
	    console.log(ddistx, ddisty);
	    console.log(this.x, this.y, nxp * TILE_SIZE, nyp * TILE_SIZE);
	    console.log(dt,player.dx, player.dy, player.x, player.y);
	}
	this.gnd = this.mj;
	ny = (nyp) * TILE_SIZE;
	this.dy = 0;
    }
    if(1){

    }
    this.x = nx;
    this.y = ny;
};



function probingstep(dt){
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
    let probes = [];
    for(let x = -1; x <= 1; ++x){
	for(let y = -1; y <= 1; ++y){
	    probes.push(new Probe(map, nx + x * TILE_SIZE, ny + y * TILE_SIZE));
	}
    }
    this.testing.probes = probes;
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
	player.dx = -player.speed;
    }
    if(key == 39){
	player.dx = player.speed;
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
function bindKeys(){
    window.addEventListener("keydown", onkeydown);
    window.addEventListener("keyup", onkeyup);
}

