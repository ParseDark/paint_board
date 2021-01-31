package paintdom

type serviceShape struct {
	ID      string       `json:"id"`
	Path    *pathData    `json:"path"`
	Line    *lineData    `json:"line"`
	Rect    *rectData    `json:"rect"`
	Ellipse *ellipseData `json:"ellipse"`
}

func (p *serviceShape) Get() Shape {
	if p.Path != nil {
		return &Path{shapeBase: shapeBase{p.ID}, pathData: *p.Path}
	}
	if p.Line != nil {
		return &Line{shapeBase: shapeBase{p.ID}, lineData: *p.Line}
	}
	if p.Rect != nil {
		return &Rect{shapeBase: shapeBase{p.ID}, rectData: *p.Rect}
	}
	if p.Ellipse != nil {
		return &Ellipse{shapeBase: shapeBase{p.ID}, ellipseData: *p.Ellipse}
	}
	return nil
}

type serviceShapeOrZorder struct {
	serviceShape `json:",inline"`
	Zorder       string `json:"zorder"`
}
