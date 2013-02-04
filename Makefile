CWD := $(shell pwd)
SERVE = ./$(CWD)/node_modules/serve/bin/serve

all: server

server:
	# serving files on port 8080
	./node_modules/serve/bin/serve --port 8080