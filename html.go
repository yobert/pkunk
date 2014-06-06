package pkunk

import (
	"html/template"
	"net/http"
)

var pageTemplate *template.Template
var pageSource = `<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">{{range .CSS}}
		<link rel="stylesheet" href="{{.}}"></link>{{end}}{{range .JS}}
		<script src="{{.}}"></script>{{end}}
		<script>
			var bootstrap_data = {{.Data}};
		</script>
	</head>
	<body onload="bootstrap();">
		<noscript>
			<h3>JavaScript Required</h3>
			Sorry, our site won't work without JavaScript.  Please enable it and try again!
		</noscript>
	</body>
</html>
`

func init() {
	t, err := template.New("pageTemplate").Parse(pageSource)
	if err != nil {
		panic(err)
	}

	pageTemplate = t
}

func (pk *Env) bootstrap(w http.ResponseWriter, r *http.Request) {
	var page struct {
		JS   []string
		CSS  []string
		Data interface{}
	}

	page.Data = nil

	for _, pack := range pk.Packs {
		if pack.Type == PACK_CSS {
			page.CSS = append(page.CSS, pack.PackedUrl)
		} else if pack.Type == PACK_JS {
			page.JS = append(page.JS, pack.PackedUrl)
		}
	}

	//	page.CSS = append(page.CSS, "/css/screen1.css")
	//	page.CSS = append(page.CSS, "/css/screen2.css")
	//	page.JS = append(page.JS, "/js/blah.js")

	/*	bootstrap_js := []string{
			"/js/bootstrap.js",
			"/js/lib/net.js",
			"/js/lib/ws.js",
			"/js/jsbase/tools.js",

			// include any javascript url handlers here
			"/js/urls/home.js",


			/// BEGIN OF NOT REALLY BOOTSTRAP JS
			// TODO: move these into api/ and have it send the hashed urls along with api call replies.
			// for now be lazy and link in everything here from the base page
			"/js/layout.js",
			"/js/layout/topmenu.js",
			"/js/layout/tools.js",

			"/js/login.js",


			"/js/jsbase/tag.js",
			"/js/jsbase/pubsub.js",
			"/js/jsbase/upload.js",
			"/js/jsbase/dates.js",
			"/js/jsbase/twig.js",
			"/js/jsbase/ua.js",
			"/js/jsbase/cookies.js",
		}

		for _, js := range bootstrap_js {
			page.Bootstrap = append(page.Bootstrap, hashed_url(js))
		}

		page.CSS = hashed_url("/css/screen.css")
	*/
	w.Header().Set("Cache-Control", "private, no-store, no-cache")
	pageTemplate.Execute(w, &page)
}
