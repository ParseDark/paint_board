import { HPath } from "../dom-model";

class HFreePathCreator {
  constructor() {
    this.points = [];
    this.fromPos = { x: 0, y: 0 };
    this.started = false;
    let ctrl = this;
    {
      hview.onmousedown = function (event) {
        ctrl.onmousedown(event);
      };
      hview.onmousemove = function (event) {
        ctrl.onmousemove(event);
      };
      hview.onmouseup = function (event) {
        ctrl.onmouseup(event);
      };
      hview.onkeydown = function (event) {
        ctrl.onkeydown(event);
      };
    }
  }

  stop() {
    hview.onmousedown = null;
    hview.onmousemove = null;
    hview.onmouseup = null;
    hview.onkeydown = null;
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

  onmousedown(event) {
    this.fromPos = hview.getMousePos(event);
    this.started = true;
  }
  onmousemove(event) {
    if (this.started) {
      this.points.push(hview.getMousePos(event));
      invalidate(null);
    }
  }

  onmouseup(event) {
    if (this.started) {
      debugger;
      hview.doc.addShape(this.buildShape());
      this.reset();
    }
  }

  onkeydown(event) {
    if (event.keyCode == 27) {
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
      ctx.stroke();
    }
  }
}

hview.registerController("FreePathCreator", function () {
  return new HFreePathCreator();
});
