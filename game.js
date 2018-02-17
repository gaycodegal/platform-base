const screen = new Screen();
document.body.appendChild(screen.canvas);
const map = new BasicMap({tiles:genMap(40,30)});
drawRectMap(map, 10, 10, 5, 1);
const player = new Player(map,
			  {x:50,
			   y:50,
			   maxDx:TILE_SIZE - 1,
			   maxDy:TILE_SIZE - 1,
			   dx:0,
			   dy:0,
			   jump_velocity: -0.6,
			   max_jumps: 3,
			   gravity: {x:0, y:0.03},
			   max_velocity: {x:2, y:2}
			  });

screen.drawlist.push(map);
screen.drawlist.push(player);

async function main(){
    let dt = 1/60;
    let last = Date.now(), now = 0;
    while(true){
	await nextFrame();
	now = Date.now();
	dt = now - last;
	last = now;
	//console.log(1 / (dt/1000));
	player.step(dt);
	screen.draw();
	
    }
}

main();
