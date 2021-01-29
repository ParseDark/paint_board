class HShapeSelector {
  constructor() {
    this.started = false;
    this.pt = { x: 0, y: 0 };
    this.ptMove = { x: 0, y: 0 };
    let ctrl = this;
    hview.onmousedown = function (e) {
      ctrl.onmousedown(e);
    };
    hview.onmousemove = function (e) {
      ctrl.onmousemove(e);
    };
    hview.onmouseup = function (e) {
      ctrl.onmouseup(e);
    };
    hview.onkeydown = function (e) {
      ctrl.onkeydown(e);
    };
  }

  stop() {
    hview.onmousedown = null;
    hview.onmousemove = null;
    hview.onmouseup = null;
    hview.onkeydown = null;
    hview.drawing.style.cursor = "auto";
  }
  reset() {
    this.started = false;
    invalidate(null);
  }

  onmousedown(e) {
    this.pt = this.ptMove = hview.getMousePos(e);
    this.started = true;

    let ht = hview.doc.hitTest(this.pt);
    if (hview.selection != ht.hitShape) {
      hview.selection = ht.hitShape;
      invalidate(null);
    }
  }
  onmousemove(e) {
    let pt = hview.getMousePos(e);
    if (this.started) {
      this.ptMove = pt;
      invalidate(null);
    } else {
      let ht = hview.doc.hitTest(pt);
      if (ht.hitCode > 0) {
        hview.drawing.style = cursor = "move";
      } else {
        hview.drawing.style = cursor = "auto";
      }
    }
  }

  onmouseup(e) {
    if (this.started) {
      let selection = hview.selection;
      if (selection != null) {
        let pt = hview.getMousePos(e);
        selection.move(pt.x - this.pt.x, pt.y - this.pt.y);
      }

      this.reset();
    }
  }

  onkeydown(e) {
    switch (e.keyCode) {
      case 8: // backspace
      case 46: // delete
        hview.doc.deleteShape(hview.selection);
        hview.selection = null;
      case 27: // esc
        this.reset();
        break;
    }
  }

  onPaint(ctx) {
    let selection = hview.selection;
    if (selection != null) {
      let bound = selection.bound();

      if (this.started) {
        bound.x += this.ptMove.x - this.pt.x;
        bound.y += this.ptMove.y - this.pt.y;
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = "grey";
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.rect(bound.x, bound.y, bound.width, bound.height);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

hview.registerController("ShapeSelector", function () {
  debugger;
  return new HShapeSelector();
});
