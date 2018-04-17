"use strict";
function BPathFollowing(path, primary, maxVelocity) {

    this.maxVelocity = maxVelocity;

    // this.MAX_FORCE = relativeX(3) * 3;

    this.path = path;

    this.primary = primary;

    if (primary) {
        this.currentNodeIndex = 0;
    } else {
        this.currentNodeIndex = path.length() - 1;
    }
}

BPathFollowing.prototype.apply = function(particle) {
    var steering = this.pathFollowing(particle);

    if (steering == null) {
        return;
    }

    particle.velocity.add(steering);
};

BPathFollowing.prototype.seek = function(particle, target) {
    var force;

    var desired = target.copy().sub(particle.position);
    desired.normalize();
    desired.multSelf(this.maxVelocity);

    force = desired.sub(particle.velocity);

    return force;
};

BPathFollowing.prototype.pathFollowing = function(particle) {
    var target = null;

    if (this.path != null) {
        target = this.path.getPoint(this.currentNodeIndex);

        if (particle.position.dist(target) <= this.path.radius) {
            var car = particleCars[particle.id];
            this.currentNodeIndex += this.primary ? 1 : -1;

            if (this.currentNodeIndex >= this.path.length() || this.currentNodeIndex < 0) {
                switch (Config.carBehavior) {
                    case CarBehavior.BACK_AND_FORTH:
                        this.primary = !this.primary;
                        this.currentNodeIndex += this.primary ? 1 : -1;
                        this.path.disableCarSpawn();
                        break;
                    case CarBehavior.RECYCLE:
                        var respawnCell;
                        if (this.primary) {
                            respawnCell = this.path.debugPath.get(DebugTitle.START).cell;
                            this.currentNodeIndex = 0;
                        } else {
                            respawnCell = this.path.debugPath.get(DebugTitle.END).cell;
                            this.currentNodeIndex = this.path.length() - 1;
                        }
                        particle.set(respawnCell.xf(), respawnCell.yf());
                        this.path.disableCarSpawn();
                        break;
                    case CarBehavior.RESPAWN:
                        car.destroy();
                        break;
                    default:
                        break;
                }
            }
        }
    }

    return target != null ? this.seek(particle, target) : createVector();
};

// BPathFollowing.prototype.truncate = function(vector, max) {
//     var i;
//
//     i = max / vector.mag();
//     i = i < 1.0 ? i : 1.0;
//
//     vector.multSelf(i);
// };
