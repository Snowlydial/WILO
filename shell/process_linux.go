//go:build linux

package main

import "os/exec"

func hideConsoleWindow(cmd *exec.Cmd) {
	// no-op on Linux
}
