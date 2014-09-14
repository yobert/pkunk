package main

import (
	"github.com/yobert/undb"
)

func schema_init() *undb.Store {
	source := "schema"

	db := undb.New("tododb", undb.STORES)

	todos := undb.New("todos", undb.STORES)
	db.Insert(todos, source)

	var row *undb.Store

	row = undb.New(todos.Seq(), undb.VALUES)
	row.Update(map[string]interface{}{
		"Title": "test item 1",
		"Done":  false,
	}, source)
	todos.Insert(row, source)

	row = undb.New(todos.Seq(), undb.VALUES)
	row.Update(map[string]interface{}{
		"Title": "test item 2",
		"Done":  true,
	}, source)
	todos.Insert(row, source)

	row = undb.New(todos.Seq(), undb.VALUES)
	row.Update(map[string]interface{}{
		"Title": "test item 3",
		"Done":  true,
	}, source)
	todos.Insert(row, source)
	row.Delete(source)

	row = undb.New(todos.Seq(), undb.VALUES)
	row.Update(map[string]interface{}{
		"Title": "test item 4",
		"Done":  false,
	}, source)
	todos.Insert(row, source)

	return db
}
