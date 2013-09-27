
var Particle = function(x_, y_, radius_, mass_, vX_, vY_, r_, g_, b_) {

    this.x = x_;                // position x
    this.y = y_;                // position y
    this.mass = mass_;           
    this.radius = radius_;       
    this.vX = vX_;              // velocity X
    this.vY = vY_;              // velocity Y

    var color  = 'rgb(' + r_ + ',' + g_ + ',' + b_ + ')';

    this.collisionCount = 0;             // number of collisions so far

    this.timeToHit = function(that) {
        if (this === that) return Infinity;
        var dx  = that.x - this.x;
        var dy  = that.y - this.y;
        var dvx = that.vX - this.vX;
        var dvy = that.vY - this.vY;
        var dvdr = dx*dvx + dy*dvy;
        if (dvdr > 0) return Infinity;
        var dvdv = dvx*dvx + dvy*dvy;
        var drdr = dx*dx + dy*dy;
        var sigma = this.radius + that.radius;
        var d = (dvdr*dvdr) - dvdv * (drdr - sigma*sigma);
        if (d < 0) return Infinity;
        return -(dvdr + Math.sqrt(d)) / dvdv;
    };

    this.timeToHitVerticalWall = function(width) {
        if (this.vX > 0) return (width - (this.x + this.radius)) / this.vX;
        else if (this.vX < 0) return (this.radius - this.x) / this.vX;
        else return Infinity;
    };

    this.timeToHitHorizontalWall = function(height) {
        if (this.vY > 0) return (height - (this.y + this.radius)) / this.vY;
        else if (this.vY < 0) return (this.radius - this.y) / this.vY;
        else return Infinity;
    };

    this.bounceOff = function(that) {
        var dx  = that.x - this.x;
        var dy  = that.y - this.y;
        var dvx = that.vX - this.vX;
        var dvy = that.vY - this.vY;
        var dvdr = dx*dvx + dy*dvy;             // dv dot dr
        var dist = this.radius + that.radius;   // distance between particle centers at collison

        var F = 2 * this.mass * that.mass * dvdr / ((this.mass + that.mass) * dist);
        var fx = F * dx / dist;
        var fy = F * dy / dist;

        this.vX += fx / this.mass;
        this.vY += fy / this.mass;
        that.vX -= fx / that.mass;
        that.vY -= fy / that.mass;

        this.collisionCount++;
        that.collisionCount++;
    };

    this.bounceOffVerticalWall = function() {
        this.vX *= -1;
        this.collisionCount++;
    };

    this.bounceOffHorizontalWall = function() {
        this.vY *= -1;
        this.collisionCount++;
    };

    this.drawIn = function(context) {
        context.fillStyle = color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    };

    // updates position
    this.move = function(time, width, height) {
        if(typeof(time) != "undefined") {
            this.x += this.vX * time;
            this.y += this.vY * time;
        }
        else {
            this.x += this.vX;
            this.y += this.vY;
        }
    };
}




