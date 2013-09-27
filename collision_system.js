
var CollisionSystem = function(limit) {

    var currentTime = 0;
    var pq = MinPQ();
    var canvas;
    var context;
    var particles = new Array();

    // updates priority queue with all new events for particle a
    var predict = function(particle, limit) {
        if(!particle) return;

        for(var i = 0, length = particles.length; i < length; i++) {
            var particleToHit = particles[i];
            var dt = particle.timeToHit(particleToHit);
            if (dt > 0 && currentTime + dt <= limit)
                pq.insert(Event(currentTime + dt, particle, particleToHit));
        }

        var dtX = particle.timeToHitVerticalWall(canvas.width);
        var dtY = particle.timeToHitHorizontalWall(canvas.height);

        if (currentTime + dtX <= limit) pq.insert(Event(currentTime + dtX, particle, null));
        if (currentTime + dtY <= limit) pq.insert(Event(currentTime + dtY, null, particle));
    };

    // redraw all particles
    var redraw = function(limit) {
        draw();
        if (currentTime < limit)
            pq.insert(Event(currentTime + 0.1, null, null));
    };

    var update = function() {
        var e = pq.delMin();
        //if (e == null) return;

        while(!e.isValid())
            e = pq.delMin();

        var a = e.particleA;
        var b = e.particleB;
    
        for(var i = 0, length = particles.length; i < length; i++) 
            particles[i].move(e.time - currentTime, canvas.width, canvas.height);
        
        currentTime = e.time;

        if     (a && b)     a.bounceOff(b);
        else if(a && !b)    a.bounceOffVerticalWall();
        else if(!a && b)    b.bounceOffHorizontalWall();
        else                redraw(limit);

        predict(a, limit);
        predict(b, limit);
    };


    var draw = function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        for(var i = 0, length = particles.length; i < length; i++)
            particles[i].drawIn(context);
    };

    var attachResizeEvent = function() {
        var resize = function() {
            canvas.width = 500;
            canvas.height = 500;
        }.bind(this);
        window.onresize = function() {
            resize();
        }.bind(this)
        resize();
    };

    var loadResources = function() {
    
        for(var i = 0; i < 200; i++) {
            var radius = 2;
            var x = Math.max(radius * 2, Math.random() * canvas.width - 10 - radius*2);
            var y = Math.max(radius * 2, Math.random() * canvas.height - 10 - radius*2);
            var vX = Math.random() * 100 * (Math.random() - 1.0);
            var vY = Math.random() * 100 * (Math.random() - 1.0);
            var mass = radius / 2;
            particles.push(new Particle(x, y, radius, mass, vX, vY, 255, 102, 0));
        }
        // big particle
        particles.push(new Particle(x, y, 50, mass, vX, vY, 254, 204, 0));
        
        // squeeze2
        //particles.push(new Particle(90, 30, 20, 10, -5 , 0, 0  , 0  , 200));
        //particles.push(new Particle(10, 30, 20, 10, 5 , 0, 200, 0  , 0));
        //particles.push(new Particle(50, 30, 4, 0.4, -5, 0, 0  , 200, 0));
    
    };

    var warmUp = function() {
        for(var i = 0, length = particles.length; i < length; i++)
            predict(particles[i], limit);
        redraw(limit);
    };

    var loop = function() {
        update();
        draw();
        setTimeout(loop.bind(this), 5);
    };

    var simulate = function() {
        canvas = document.getElementsByTagName("CANVAS")[0];
        context = canvas.getContext("2d");

        attachResizeEvent();
        loadResources();
        warmUp();
        loop();
    };

    // public interface    
    return {
        simulate : simulate,
    };

};

