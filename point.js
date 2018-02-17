function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Point.rectPair = function (a, b) {
    var minx = Math.min(a.x, b.x),
	maxx = Math.max(a.x, b.x),
	miny = Math.min(a.y, b.y),
	maxy = Math.max(a.y, b.y);
    return [minx, miny, maxx - minx, maxy - miny];
};

Point.rectCenterPair = function (a, b) {
    var d = a.deltaTo(b).abs();

    return [a.x - d.x, a.y - d.y, d.x * 2, d.y * 2];
};

Point.fromPoint = function (pt) {
    return new Point(pt.x, pt.y);
};

Point.fromEvent = function (e) {
    e.touches && (e = e.touches[0]);
    var x = e.clientX || e.pageX;
    var y = e.clientY || e.pageY;
    return new Point(x, y);
};

Point.prototype.midPoint = function (pt) {
    return new Point(this.x + (pt.x - this.x) / 2, this.y + (pt.y - this.y) / 2);
};

Point.prototype.translate = function (delta) {
    return new Point(this.x + delta.x, this.y + delta.y);
};

Point.prototype.add = function (delta) {
    this.x += delta.x;
    this.y += delta.y;
    return this;
};

Point.prototype.subtract = function (delta) {
    this.x -= delta.x;
    this.y -= delta.y;
    return this;
};

Point.prototype.negate = function () {
    return new Point(-this.x, -this.y);
};

Point.prototype.abs = function () {
    return new Point(Math.abs(this.x), Math.abs(this.y));
};

Point.prototype.distTo = function (other) {
    return dist(this.x - other.x, this.y - other.y);
};

Point.prototype.deltaTo = function (other) {
    return new Point(other.x - this.x, other.y - this.y);
};

Point.prototype.roughTo = function (other) {
    return rdist(this.x - other.x, this.y - other.y);
};
