package paintdom

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"syscall"
)

func Reply(w http.ResponseWriter, code int, data interface{}) {
	b, _ := json.Marshal(data)
	header := w.Header()
	header.Set("Content-Type", "application/json")
	header.Set("Content-Length", strconv.Itoa(len(b)))
	w.WriteHeader(code)
	w.Write(b)
	log.Println("REPLY", code, string(b))
}

func ReplyCode(w http.ResponseWriter, code int) {
	header := w.Header()
	header.Set("Content-Length", "0")
	w.WriteHeader(code)
	log.Println("REPLY", code)
}

func ReplyError(w http.ResponseWriter, err error) {
	if err == syscall.ENOENT {
		Reply(w, 404, M{"error": "entry not found"})
	} else if err == syscall.EINVAL {
		Reply(w, 400, M{"error": "invalid arguments"})
	} else if err == syscall.EEXIST {
		Reply(w, 409, M{"error": "entry already exists"})
	} else {
		Reply(w, 500, M{"error": err.Error()})
	}
}
