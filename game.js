const screen = new Screen();
document.body.appendChild(screen.canvas);
const map = new BasicMap({tiles:genMap(40,30)});
drawRectMap(map, 10, 20, 5, 1);
drawRectMap(map, 10, 27, 5, 1);
//0.4 -0.6699999999999999 591.6 376.0300000000007
/*

			  {x:32.000000000000014,
			   y:338.0000000000003,
			   maxDx:TILE_SIZE - 1,
			   maxDy:TILE_SIZE - 1,
			   dx:-0.4,
			   dy:-0.6800000000000007,
			   jump_velocity: -0.7,
			   max_jumps: 3,
			   speed: 0.4,
			   gravity: new Point(),//{x:0, y:0.03},//
			   max_velocity: {x:100, y:2}
			  }

*/
/*

{x:591.6,
			   y:376.0300000000007,
			   maxDx:TILE_SIZE - 1,
			   maxDy:TILE_SIZE - 1,
			   dx:0.4,
			   dy:-0.6699999999999999,
			   jump_velocity: -0.7,
			   max_jumps: 3,
			   speed: 0.4,
			   gravity: new Point(),//{x:0, y:0.03},//
			   max_velocity: {x:100, y:2}
			  }

*/
const player = new Player(map,

			  {x:32.000000000000014,
			   y:338.0000000000003,
			   maxDx:TILE_SIZE - 1,
			   maxDy:TILE_SIZE - 1,
			   dx:-0.4,
			   dy:-0.6800000000000007,
			   jump_velocity: -0.7,
			   max_jumps: 3,
			   speed: 0.4,
			   gravity: {x:0, y:0.03},//new Point(),//
			   max_velocity: {x:100, y:2}
			  }

			 );

screen.drawlist.push(map);
screen.drawlist.push(player);

let testmode = false;
async function main(frames){
    let dt = 16;
    let last = Date.now(), now = 0;
    while(!testmode || frames > 0){
	frames--;
	await nextFrame();
	
	if(!testmode){
	    now = Date.now();
	    dt = 12;//now - last;
	    last = now;
	}
	//console.log(1 / (dt/1000));
	player.step(dt);
	screen.draw();
	
    }
    console.log("done");
}
bindKeys();
//testmode = true;
main();
//floortest2();
//floortest();

//walltest();
