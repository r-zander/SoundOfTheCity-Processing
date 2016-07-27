"use strict";
function Car(x, y) {
    this.particle = createSprite(x - Car.DIAMETER, y - Car.DIAMETER, Car.RADIUS, Car.RADIUS);
    this.particle.id = ID();

    this.pathFollowing = null;
}

Car.setup = function () {
    Car.DIAMETER = relativeX(3);

    Car.RADIUS = Car.DIAMETER / 2;

    Car.COLOR = color('#FFDB5B');
};



Car.prototype.draw = function () {
    ellipseMode(RADIUS);
    push();

    translate(this.particle.position.x, this.particle.position.y);
    rotate(this.particle.velocity.heading() + HALF_PI);

    noStroke();
    fill(Car.COLOR);
    ellipse(0, 0, this.particle.width, this.particle.height * (1 + this.particle.velocity.mag()));

    pop();
};

Car.prototype.followPath = function () {
    this.pathFollowing.apply(this.particle);
};

Car.prototype.destroy = function () {
    delete particleCars[this.particle.id];
    removeElement(cars, this);
    this.particle.remove();
};
