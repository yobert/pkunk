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
		{{.Head}}
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">{{range .CSS}}
		<link rel="stylesheet" href="{{.}}"></link>{{end}}{{range .JS}}
		<script src="{{.}}"></script>{{end}}
		<script>
			var bootstrap_data = {{.Data}};
		</script>
	</head>
	<body onload="{{.Onload}}">
		{{.Prerender}}
		{{.Body}}
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

func (pk *Env) Render(w http.ResponseWriter, r *http.Request, prerender template.HTML) {
	var page struct {
		JS        []string
		CSS       []string
		Data      interface{}
		Onload    template.JS
		Prerender template.HTML
		Head      template.HTML
		Body      template.HTML
	}

	page.Data = nil
	page.Head = pk.Head
	page.Body = pk.Body

	for _, pack := range pk.Packs {
		if pack.Type == PACK_CSS {
			page.CSS = append(page.CSS, pack.PackedUrl)
		} else if pack.Type == PACK_JS {
			page.JS = append(page.JS, pack.PackedUrl)
		}
	}

	if prerender == "" {
		page.Onload = "main();"
	} else {
		page.Prerender = prerender
	}

	w.Header().Set("Cache-Control", "private, no-store, no-cache")
	pageTemplate.Execute(w, &page)
}
