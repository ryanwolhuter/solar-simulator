class Manifestation {
  constructor(ctx, trailLength, radius, hsl) {
    this.ctx = ctx;

    this.trailLength = trailLength;

    this.radius = radius;

    this.hsl = hsl

    this.positions = [];
  }

  storePosition(x, y) {
    this.positions.push({
      x,
      y
    });

    if (this.positions.length > this.trailLength) this.positions.shift();
  }

  draw(x, y) {
    this.storePosition(x, y);

    const positionsLen = this.positions.length;

    for (let i = 0; i < positionsLen; i++) {
      let transparency;
      let circleScaleFactor;

      const scaleFactor = i / positionsLen;

      if (i === positionsLen - 1) {
        transparency = 1;
        circleScaleFactor = 1;
      } else {
        transparency = scaleFactor / 2;
        circleScaleFactor = scaleFactor;
      }

      this.ctx.beginPath();
      this.ctx.arc(
        this.positions[i].x,
        this.positions[i].y,
        circleScaleFactor * this.radius,
        0,
        2 * Math.PI
      );
      this.ctx.fillStyle = `hsla(${this.hsl}, ${transparency})`;

      this.ctx.fill();
    }
  }
}

export default Manifestation
