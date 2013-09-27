
var Event = function(time_, particleA_, particleB_) {
    var time = time_;
    var particleA = particleA_;
    var particleB = particleB_;

    var collisionCountA = particleA ? particleA.collisionCount : -1;
    var collisionCountB = particleB ? particleB.collisionCount : -1;

    // has any collision occurred between when event was created and now?
    var isValid = function() {
        if (particleA && particleA.collisionCount != collisionCountA) return false;
        if (particleB && particleB.collisionCount != collisionCountB) return false;
        return true;
    };

    // compare times when two events will occur
    var compareTo = function(that) {
        if      (this.time < that.time) return -1;
        else if (this.time > that.time) return +1;
        else                            return  0;
    };

    // public interface    
    return {
        compareTo : compareTo,
        isValid   : isValid,
        time      : time,
        particleA : particleA,
        particleB : particleB,
    };
};

