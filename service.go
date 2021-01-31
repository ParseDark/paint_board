package main

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"paintweb/paintdom"
)

func newReverseProxy(baseURL string) *httputil.ReverseProxy {
	rpURL, _ := url.Parse(baseURL)
	return httputil.NewSingleHostReverseProxy(rpURL)
}

func handleDefault(w http.ResponseWriter, req *http.Request) {
	if req.URL.Path == "/" {
		http.ServeFile(w, req, "www/index.html")
		return
	}
	req.URL.RawQuery = "" // skip "?params"
	wwwServer.ServeHTTP(w, req)
}

var (
	apiReverseProxy = newReverseProxy("http://localhost:9999")
	wwwServer       = http.FileServer(http.Dir("www"))
)

func main() {
	go paintdom.Main()
	http.Handle("/api/", http.StripPrefix("/api/", apiReverseProxy))
	http.HandleFunc("/", handleDefault)
	fmt.Println("8888")
	http.ListenAndServe(":8888", nil)
	fmt.Println("end")
}