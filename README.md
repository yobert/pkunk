pkunk
=====

Javascript/Go web framework

Sorry the docs are pretty sparse ATM.  The general idea behind this framework is to make it easy to write an app completely in Javascript for the frontend, and using simple Go for the backend.

Pkunk gives you basic packing of CSS and Javascript into a file based on their MD5 (with auto generation on file reload). Usually you would combine this with something like webpack or browserify, but this is not required.

See examples/static/ for a static website that doesn't use webpack, and examples/react/ for a webpacked website using React for UI rendering.

examples/todo/ is a fancypants test using github.com/yobert/undb for replicating data between javascript and go. It's missing some assets at the moment but I'll fix that soon.
