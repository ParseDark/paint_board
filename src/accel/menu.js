function installControllers() {
  document.getElementById("menu").innerHTML = ` 
    <input type="button" id="PathCreator" value="Create Path" style="visibility:hidden">
    <input type="button" id="FreePathCreator" value="Create FreePath" style="visibility:hidden">
    <input type="button" id="LineCreator" value="Create Line" style="visibility:hidden">
    <input type="button" id="RectCreator" value="Create Rect" style="visibility:hidden">
    <input type="button" id="EllipseCreator" value="Create Ellipse" style="visibility:hidden">
    <input type="button" id="CircleCreator" value="Create Circle" style="visibility:hidden">
    `;

  for (let gkey in hview.controllers) {
    let key = gkey;
    let elem = document.getElementById(key);
    elem.style.visibility = "visible";
    elem.onclick = function () {
      if (hview.currentKey !== "") {
        document.getElementById(hview.currentKey).removeAttribute("style");
      }

      elem.style.borderColor = "blue";
      elem.blur();
      hview.invokeController(key);
    };
  }
}

window.onLineWidthChanged = onLineWidthChanged;

function onLineWidthChanged() {
  let elem = document.getElementById("LineWidth");
  elem.blur();
  let val = parseInt(elem.value);
  if (val > 0) {
    hview.properties.lineWidth = val;
  }
}

window.onLineColorChanged = onLineColorChanged;
function onLineColorChanged() {
  debugger;
  let ele = document.getElementById("LineColor");
  ele.blur();
  let val = ele.value;

  if (val) {
    hview.properties.lineColor = val;
  }
}

function installPropSelectors() {
  var tempDiv = document.createElement("div");
  tempDiv.setAttribute("id", "properties");
  tempDiv.innerHTML = `
    <label for="LineWidth">LineWidth: </label>
    <select id="LineWidth" onchange="onLineWidthChanged()">
        <option value="1">1</option>
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="7">7</option>
        <option value="9">9</option>
        <option value="11">11</option>
    </select>&nbsp;
    <label for="LineColor">LineColor: </label>
    <select id="LineColor" onchange="onLineColorChanged()">
        <option value="black">black</option>
        <option value="red">red</option>
        <option value="blue">blue</option>
        <option value="green">green</option>
        <option value="yellow">yellow</option>
        <option value="gray">gray</option>
    </select>
  `;
  document.getElementById("menu").insertAdjacentElement("afterend", tempDiv);
}

function installMousePos() {
  var tempDiv = document.createElement("span");
  tempDiv.setAttribute("id", "mousepos");
  document
    .getElementById("properties")
    .insertAdjacentElement("beforeend", tempDiv);
  let old = hview.drawing.onmousemove;
  let mousepos = document.getElementById("mousepos");
  hview.drawing.onmousemove = function (e) {
    let pos = hview.getMousePos(e);
    mousepos.innerHTML = `MousePos: x: ${pos.x}, y: ${pos.y}`;
    old(e);
  };
}

installControllers();
installPropSelectors();
installMousePos();
