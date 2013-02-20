CWD := $(shell pwd)
SERVE = ./$(CWD)/node_modules/serve/bin/serve

all: start

start:
	node ./puton.js