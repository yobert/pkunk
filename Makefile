.PHONEY: fmt

fmt:
	gofmt -w .
	jsfmt -w .

