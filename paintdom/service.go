package paintdom

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
)

type M map[string]interface{}

type RouteTable map[string]func(w http.ResponseWriter, req *http.Request, args []string)

type Service struct {
	doc        *Document
	routeTable RouteTable
}

func NewService(doc *Document) (p *Service) {
	p = &Service{doc: doc}
	p.routeTable = RouteTable{
		"POST/drawings":              p.PostDrawings,
		"GET/drawings/*":             p.GetDrawing,
		"DELETE/drawings/*":          p.DeleteDrawing,
		"POST/drawings/*/shapes":     p.PostShapes,
		"GET/drawings/*/shapes/*":    p.GetShape,
		"POST/drawings/*/shapes/*":   p.PostShape,
		"DELETE/drawings/*/shapes/*": p.DeleteShape,
	}
	return p
}

// create a new paint board
func (p *Service) PostDrawings(w http.ResponseWriter, req *http.Request, args []string) {
	log.Println(req.Method, req.URL)
	fmt.Println("PostDrawings create start")

	drawing, err := p.doc.Add()
	if err != nil {
		fmt.Println("PostDrawings create error")
		ReplyError(w, err)
		return
	}
	fmt.Println("PostDrawings create end")

	Reply(w, 200, M{"id": drawing.ID})
}

// create a new paint board
func (p *Service) GetDrawing(w http.ResponseWriter, req *http.Request, args []string) {
	log.Println(req.Method, req.URL)
	id := args[0]
	drawing, err := p.doc.Get(id)
	if err != nil {
		ReplyError(w, err)
		return
	}

	shapes, err := drawing.List()
	if err != nil {
		ReplyError(w, err)
		return
	}
	Reply(w, 200, M{"shapes": shapes})
}

func (p *Service) DeleteDrawing(w http.ResponseWriter, req *http.Request, args []string) {
	id := args[0]
	err := p.doc.Delete(id)
	if err != nil {
		ReplyError(w, err)
		return
	}

	var aShape serviceShape
	err = json.NewDecoder(req.Body).Decode(&aShape)
	if err != nil {
		ReplyError(w, err)
		return
	}

	ReplyCode(w, 200)
}

func (p *Service) PostShapes(w http.ResponseWriter, req *http.Request, args []string) {
	id := args[0]
	drawing, err := p.doc.Get(id)
	if err != nil {
		ReplyError(w, err)
		return
	}

	var aShape serviceShape
	err = json.NewDecoder(req.Body).Decode(&aShape)
	if err != nil {
		ReplyError(w, err)
		return
	}

	err = drawing.Add(aShape.Get())
	if err != nil {
		ReplyError(w, err)
		return
	}
	ReplyCode(w, 200)
}

func (p *Service) GetShape(w http.ResponseWriter, req *http.Request, args []string) {
	id := args[0]
	drawing, err := p.doc.Get(id)
	if err != nil {
		ReplyError(w, err)
		return
	}

	shapeID := args[1]
	shape, err := drawing.Get(shapeID)
	if err != nil {
		ReplyError(w, err)
		return
	}

	Reply(w, 200, shape)
}

func (p *Service) PostShape(w http.ResponseWriter, req *http.Request, args []string) {
	id := args[0]
	drawing, err := p.doc.Get(id)
	if err != nil {
		ReplyError(w, err)
		return
	}

	var shapeID = args[1]
	var shapeOrZorder serviceShapeOrZorder
	err = json.NewDecoder(req.Body).Decode(&shapeOrZorder)
	if err != nil {
		ReplyError(w, err)
		return
	}

	if shapeOrZorder.Zorder != "" {
		err = drawing.SetZorder(shapeID, shapeOrZorder.Zorder)
	} else {
		err = drawing.Set(shapeID, shapeOrZorder.Get())
	}

	if err != nil {
		ReplyError(w, err)
		return
	}

	ReplyCode(w, 200)

}

func (p *Service) DeleteShape(w http.ResponseWriter, req *http.Request, args []string) {
	id := args[0]
	drawing, err := p.doc.Get(id)
	if err != nil {
		ReplyError(w, err)
		return
	}

	shapeID := args[1]
	err = drawing.Delete(shapeID)
	if err != nil {
		ReplyError(w, err)
		return
	}
	ReplyCode(w, 200)
}

func getRoute(req *http.Request) (route string, args []string) {
	parts := strings.Split(req.URL.Path, "/")
	parts[0] = req.Method
	for i := 2; i < len(parts); i += 2 {
		args = append(args, parts[i])
		parts[i] = "*"
	}
	route = strings.Join(parts, "/")
	return
}

func (p *Service) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	route, args := getRoute(req)
	if handle, ok := p.routeTable[route]; ok {
		handle(w, req, args)
	}
}

func Main() {
	doc := NewDocument()
	service := NewService(doc)
	fmt.Println("listener the port on: 9999")
	http.ListenAndServe(":9999", service)
}
