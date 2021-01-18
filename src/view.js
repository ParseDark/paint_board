import { HPaintDoc, HPath, HEllipse, HRect, HLine, HLineStyle } from "./dom";
// 基类
// 做一些初始化的事情， 例如事件拦截， 组件状态信息的收集， 调用model层的逻辑封装
export class HPaintView {
  constructor() {
    this.properties = {
      lineWidth: 1,
      lineColor: "black",
    };
    this.controllers = {};
    this._currentKey = "";
    this._current = null;
    this.onmousedown = null;
    this.onmousemove = null;
    this.onmouseup = null;
    this.ondblclick = null;
    this.onkeydown = null;

    {
      // initial
      let drawing = document.getElementById("drawing");
      let view = this;
      drawing.onmousedown = function (e) {
        e.preventDefault();
        if (view.onmousedown !== null) {
          view.onmousedown(e);
        }
      };

      drawing.onmousemove = function (e) {
        if (view.onmousemove !== null) {
          view.onmousemove(e);
        }
      };

      drawing.onmouseup = function (e) {
        if (view.onmouseup !== null) {
          view.onmouseup(e);
        }
      };

      drawing.ondblclick = function (e) {
        if (view.ondblclick !== null) {
          view.ondblclick(e);
        }
      };

      document.onkeydown = function (e) {
        // attention old version is keyCode. e.code is new version api. Need to carefully validation.
        switch (e.code) {
          case 9:
          case 13:
          case 27:
            e.preventDefault();
        }
        if (view.onkeydown !== null) {
          view.onkeydown(e);
        }
      };
      this.drawing = drawing;
      this.doc = new HPaintDoc();
    }
  }
  get currentKey() {
    return this._currentKey;
  }

  get lineStyle() {
    let props = this.properties;
    return new HLineStyle(props.lineWidth, props.lineColor);
  }

  onPain(ctx) {
    this.doc.onPaint(ctx);
    if (this._current !== null) {
      this._current.onPaint(ctx);
    }
  }

  getMousePos(e) {
    return {
      x: e.offsetX,
      y: e.offsetY,
    };
  }

  invalidateReact(reserved) {
    let ctx = this.drawing.getContext("2d");
    let bound = this.drawing.getBoundingClientRect();
    ctx.clearRect(0, 0, bound.width, bound.height);
    this.onPain(ctx);
  }

  registerController(name, controller) {
    if (name in this.controllers) {
      alert("controller exists: ", name);
    } else {
      this.controllers[name] = controller;
    }
  }

  invokeController(name) {
    this.stopController();
    if (name in this.controllers) {
      let controller = this.controllers[name];
      this._setCurrent(name, controller());
    }
  }

  stopController() {
    if (this._current !== null) {
      this._current.stop();
      this._setCurrent("", null);
    }
  }

  _setCurrent(name, ctrl) {
    this._current = ctrl;
    this._currentKey = name;
  }
}

window.hview = new HPaintView();

function invalidate(reserved) {
  hview.invalidateReact(null);
}

window.invalidate = invalidate;
