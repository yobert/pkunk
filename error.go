package pkunk

import (
	"errors"
	"fmt"
)

type JsonError struct {
	Error string `json:"error"`
}

// Error() takes an error and returns a JSON serializable data structure,
// formatted as {"error":"..."}
func Error(e error) interface{} {
	return JsonError{e.Error()}
}

// Errorf formats according to a format specifier and returns an interface{} suitable for
// JSON encoding via Error()
func Errorf(format string, a ...interface{}) interface{} {
	return Error(errors.New(fmt.Sprintf(format, a...)))
}
