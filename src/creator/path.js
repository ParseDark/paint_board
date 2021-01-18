import { HPath } from "../dom";

class HPathCreator {
  constructor(close) {
    this.points = [];
    this.close = close;
    this.fromPos = this.toPos = { x: 0, y: 0 };
    this.started = false;
    let ctrl = this;
    {
      hview.onmousedown = function (event) {
        ctrl.onmousedown(event);
      };
      hview.onmousemove = function (event) {
        ctrl.onmousemove(event);
      };
      hview.ondblclick = function (event) {
        ctrl.ondblclick(event);
      };
      hview.onkeydown = function (event) {
        ctrl.onkeydown(event);
      };
    }
  }

  stop() {
    this.started = false;
    hview.onmousedown = null;
    hview.onmousemove = null;
    hview.ondblclick = null;
    hview.onkeydown = null;
    this.reset();
  }

  reset() {
    this.points = [];
    this.started = false;
    invalidate(null);
  }

  buildShape() {
    let points = [{ x: this.fromPos.x, y: this.fromPos.y }];
    for (let i in this.points) {
      points.push(this.points[i]);
    }

    return new HPath(points, this.close, hview.lineStyle);
  }

  onmousedown(e) {
    this.toPos = hview.getMousePos(e);
    if (this.started) {
      this.points.push(this.toPos);
    } else {
      this.fromPos = this.toPos;
      this.started = true;
    }
    invalidate(null);
  }

  onmousemove(e) {
    if (this.started) {
      this.toPos = hview.getMousePos(e);
      invalidate(null);
    }
  }

  ondblclick(e) {
    if (this.started) {
      hview.doc.addShape(this.buildShape());
      this.reset();
    }
  }

  onkeydown(e) {
    switch (e.keyCode) {
      case 13:
        let n = this.points.length;
        if (n === 0 || this.points[n - 1] !== this.toPos) {
          this.points.push(this.toPos);
        }
        this.ondblclick(e);
        break;
      case 27:
        this.reset();
    }
  }

  onPaint(ctx) {
    if (this.started) {
      let props = hview.properties;
      ctx.lineWidth = props.lineWidth;
      ctx.strokeStyle = props.lineColor;
      ctx.beginPath();
      ctx.moveTo(this.fromPos.x, this.fromPos.y);
      for (let i in this.points) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }

      ctx.lineTo(this.toPos.x, this.toPos.y);
      if (this.close) {
        ctx.closePath();
      }
      ctx.stroke();
    }
  }
}

hview.registerController("PathCreator", function () {
  return new HPathCreator(false);
});
