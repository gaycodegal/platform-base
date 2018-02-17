function genMap (w, h){
    const arr = new Array(w);
    for(let x = 0; x < w; ++x){
	const row = arr[x] = new Array(h);
	for(let y = 0; y < h; ++y){
	    if(y == 1 || x == 1 || y == h - 2 || x == w - 2)
		row[y] = 1;
	    else
		row[y] = 0;
	}
    }
    console.log(arr);
    return arr;
}

function drawRectMap(map,sx,sy,w,h){
    for(let x = sx; x < sx + w; ++x){
	for(let y = sy; y < sy + h; ++y){
	    map.tiles[x][y] = 1;
	}
    }

}

function drawSquare(pt, color){
    var ctx = screen.ctx;
    ctx.save();
    const x = (pt.x / TILE_SIZE | 0) * TILE_SIZE;
    const y = (pt.y / TILE_SIZE | 0) * TILE_SIZE;
    ctx.fillStyle = color;
    ctx.fillRect(x,y,TILE_SIZE,TILE_SIZE);
    ctx.restore();
}

async function floortest(){
    testmode = true;
    await main(1);
    player.jump();
    await main(42);
    var last = Point.fromPoint(player);
    await main(1);
    var ctx = screen.ctx;
    ctx.save();
    ctx.fillStyle = "blue";
    ctx.fillRect(last.x,last.y,TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "rgba(0,255,0,0.5)";
    var sx = player.testing.sx < 0 ? 16 : 0;
    var sy = player.testing.sy < 0 ? 16 : 0;
    ctx.fillRect(player.testing.nxp, player.testing.ny, player.w, player.h * 2);
    ctx.fillRect(player.testing.nx, player.testing.nyp, player.w * 2, player.h);
    drawSquare(player, "rgba(0,255,255, 0.5)");
    ctx.restore()
}

async function walltest(){
    testmode = true;
    await main(5);
    player.jump();
    await main(1);
    var last = Point.fromPoint(player);
    await main(2);
    var ctx = screen.ctx;
    ctx.save();
    ctx.fillStyle = "blue";
    ctx.fillRect(last.x,last.y,TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "rgba(0,255,0,0.5)";

    //drawSquare(player, "rgba(0,255,255, 0.5)");
    ctx.restore()
}
