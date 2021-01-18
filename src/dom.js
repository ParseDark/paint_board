class HLineStyle {
  constructor(width, color) {
    this.width = width;
    this.color = color;
  }
}
class HLine {
  constructor(pt1, pt2, lineStyle) {
    this.pt1 = pt1;
    this.pt2 = pt2;
    this.lineStyle = lineStyle;
  }
  onPaint(ctx) {
    let lineStyle = this.lineStyle;
    ctx.lineWidth = lineStyle.width;
    ctx.color = lineStyle.color;
    ctx.beginPath();
    ctx.moveTo(this.pt1.x, this.pt1.y);
    ctx.lineTo(this.pt2.x, this.pt2.y);
    ctx.stroke();
  }
}
class HRect {
  constructor(r, lineStyle) {
    this.x = r.x;
    this.y = r.y;
    this.width = r.width;
    this.height = r.height;
    this.lineStyle = lineStyle;
  }

  onPaint(ctx) {
    let lineStyle = this.lineStyle;
    ctx.lineWidth = lineStyle.width;
    ctx.strokeStyle = lineStyle.color;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
  }
}

class HEllipse {
  constructor(x, y, radiusX, radiusY, lineStyle) {
    this.x = x;
    this.y = y;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.lineStyle = lineStyle;
  }

  onPaint(ctx) {
    let lineStyle = this.lineStyle;
    ctx.lineWidth = lineStyle.width;
    ctx.strokeStyle = lineStyle.color;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

class HPath {
  constructor(points, close, lineStyle) {
    this.points = points;
    this.close = close;
    this.lineStyle = lineStyle;
  }

  onPaint(ctx) {
    let n = this.points.length;
    if (n < 1) {
      return;
    }

    let points = this.points;
    let lineStyle = this.lineStyle;
    ctx.lineWidth = lineStyle.width;
    ctx.strokeStyle = lineStyle.color;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < n; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    if (this.close) {
      ctx.closePath();
    }

    ctx.stroke();
  }
}

class HPaintDoc {
  constructor() {
    this.shapes = [];
  }

  addShape(shape) {
    if (shape != null) {
      this.shapes.push(shape);
    }
  }

  onPaint(ctx) {
    let shapes = this.shapes;
    for (let i in shapes) {
      shapes[i].onPaint(ctx);
    }
  }
}

export { HPaintDoc, HPath, HEllipse, HRect, HLine, HLineStyle };
