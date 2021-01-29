import { HLine, HRect, HEllipse, normalizeRect } from "../dom-model";

class HRectCreator {
  constructor(shapeType) {
    this.shapeType = shapeType;
    this.rect = {
      pt1: { x: 0, y: 0 },
      pt2: { x: 0, y: 0 },
    };

    this.started = false;

    let ctrl = this;

    hview.onmousedown = function (e) {
      ctrl.onmousedown(e);
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

  stop() {
    hview.onmousedown = null;
    hview.onmousemove = null;
    hview.onmouseup = null;
    hview.onkeydown = null;
  }

  reset() {
    this.started = false;
    invalidate(this.rect);
    hview.fireControllerReset();
  }

  buildShape() {
    let rect = this.rect;
    let style = hview.style.clone();
    let r = normalizeRect(rect);
    switch (this.shapeType) {
      case "line":
        return new HLine(rect.pt1, rect.pt2, style);
      case "rect":
        return new HRect(r, style);
      case "ellipse":
        let rx = r.width / 2;
        let ry = r.height / 2;
        return new HEllipse(r.x + rx, r.y + ry, rx, ry, style);
      case "circle":
        let rc = Math.sqrt(r.width * r.width + r.height * r.height);
        return new HEllipse(rect.pt1.x, rect.pt1.y, rc, rc, style);
      default:
        alert("unknow shapeType: " + this.shapeType);
        return null;
    }
  }

  onmousedown(e) {
    console.log("start mouse down");
    this.rect.pt1 = hview.getMousePos(e);
    this.started = true;
  }
  onmousemove(e) {
    if (this.started) {
      console.log("mouse moving", this.rect);
      this.rect.pt2 = hview.getMousePos(e);
      invalidate(this.rect);
    }
  }
  onmouseup(e) {
    if (this.started) {
      console.log("mouse up", this.rect);
      this.rect.pt2 = hview.getMousePos(e);
      hview.doc.addShape(this.buildShape());
      this.reset();
    }
  }
  onkeydown(e) {
    if (e.key === 27) {
      this.reset();
    }
  }
  onPaint(ctx) {
    if (this.started) {
      this.buildShape().onPaint(ctx);
    }
  }
}

hview.registerController("LineCreator", function () {
  return new HRectCreator("line");
});

hview.registerController("RectCreator", function () {
  return new HRectCreator("rect");
});

hview.registerController("EllipseCreator", function () {
  return new HRectCreator("ellipse");
});

hview.registerController("CircleCreator", function () {
  return new HRectCreator("circle");
});
