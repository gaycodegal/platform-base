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
