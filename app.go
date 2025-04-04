package main

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

type File struct {
	Name       string
	IsDir      bool
	Size       int64
	DateModify time.Time
	Encrypted  bool
}

func (a *App) GetFiles(path string) []File {
	files, err := os.ReadDir(path)
	if err != nil {
		return nil
	}

	filesList := []File{}
	for _, file := range files {
		info, err := file.Info()
		if err != nil {
			return nil
		}

		encrypted := false
		if strings.HasPrefix(file.Name(), "$e") {
			encrypted = true
			name := file.Name()[2:]

		}

		filesList = append(filesList, File{
			Name:       file.Name(),
			IsDir:      file.IsDir(),
			Size:       info.Size(),
			DateModify: info.ModTime(),
			Encrypted:  encrypted,
		})
	}
	return filesList
}
