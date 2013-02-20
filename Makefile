CWD := $(shell pwd)
SERVE = ./$(CWD)/node_modules/serve/bin/serve

all: start

start:
	# serving files on port 8080
	node ./puton.js