package pkunk

import (
	"bytes"
	"crypto/md5"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"strings"
)

type packType int

const (
	PACK_CSS packType = iota
	PACK_JS
)

type Pack struct {
	PackedUrl  string
	PackedPath string
	Type       packType

	Title	string
	Paths	[]string

	pk *Env
}

func (pk *Env) NewPack(title string, paths ...string) (*Pack, error) {
	p := Pack{}

	p.Title = title
	p.Paths = paths
	p.pk = pk

	err := p.Repack()

	return &p, err
}

func (p *Pack) Repack() error {

	var out bytes.Buffer
	var size int64
	var ptype packType = -1

	for _, rawpath := range p.Paths {
		// search for path
		path := rawpath
		for _, r := range p.pk.resourcePaths {
			f, e := os.Open(r + rawpath)
			if e != nil {
				continue
			}
			f.Close()
			path = r + rawpath
			break
		}

		var pt packType
		if strings.HasSuffix(path, ".css") {
			pt = PACK_CSS
		} else if strings.HasSuffix(path, ".js") {
			pt = PACK_JS
		} else {
			return errors.New("Bad extension in pack file \"" + path + "\"")
		}

		if ptype != -1 && ptype != pt {
			return errors.New("Bad pack file list: Cannot mix types")
		}
		ptype = pt

		in, err := os.Open(path)
		if err != nil {
			return err
		}
		defer in.Close()

		count, err := io.Copy(&out, in)
		if err != nil {
			return err
		}
		size += count
	}

	p.Type = ptype

	sum := fmt.Sprintf("%x", md5.Sum(out.Bytes()))[:8]
	sumfile := sum
	if ptype == PACK_CSS {
		sumfile = sumfile + ".css"
	} else if ptype == PACK_JS {
		sumfile = sumfile + ".js"
	} else {
		return errors.New("Empty packfile is not allowed")
	}

	p.PackedUrl = p.pk.CacheUrl + sumfile
	p.PackedPath = p.pk.CachePath + sumfile

	stat, err := os.Lstat(p.PackedPath)
	if err == nil {
		if stat.Size() == size {
			// nothing more to do, the file exists so we can
			// return early
			return nil
		}
		log.Println("Warning: pack file \"" + p.PackedPath + "\" has the wrong file size.  Attempting to overwrite.")
	}

	outfile, err := os.Create(p.PackedPath)
	if err != nil {
		return err
	}
	defer outfile.Close()

	outfile.Write(out.Bytes())
	return nil
}

func (pk *Env) Include(pack *Pack) {
	pk.Packs = append(pk.Packs, pack)
}
