# plug-socketio-wrap


## About
This repository is dedicated to a wrap for the [Node.js socket.io server](https://www.npmjs.com/package/socket.io) which provides a way of separating the event-related logic into layers (router -> middleware -> controller) typically present in an Express application. 

This wrap was written by me as a part of another large project that was using the socket.io. It was meant to help with checks and validation of the event data by introducing a standartized way of using middlewares with the socket.io events.

The entire wrap logic is merged into a [single file](https://github.com/StingrayFG/plug-socketio-wrap/blob/main/src/plug/plug.ts). At the moment, I have no intentions of bundling it into a standalone package.


## Features

### Routers
- Provide a way of attaching a controller and a set of middlewares to an event.
- Can have a path just like the Express routers.
- Have to be attached to io once and to each new socket on connection.

### Middlewares and controllers
- Work in a similar fashion to the middlewares and controllers used with the Express.
- Get a set of ack wrappers, and an emitter executor instead of an Express response object. The ack wrappers use the arguments to assemble the response object (with props such as data, error, etc) and pass it to the ack function, eliminating the need to manually assemble the response object. The emitter executor is used to run the predefined emitters without directly interacting with the socket and io objects.
- Have no direct access to io and socket objects.

### Emitters
- Encapsulate the logic related to emits into separate functions.
- Always require io and socket objects passed to them. They can be called from the middlewares and controllers by simply passing them to the emitter executor (execEmitter(exampleEmitter, arg1, arg2, argx)). The emitter executor will call the emitter and pass io, socket, and (arg1, arg2, argx) arguments to it.


## Examples
There are usage examples for the routers, middlewares, controllers, and emitters in the respective folders. This repo is a small but a complete project with all of the aforementioned layers being implemented in it. At the moment, there is no structured documentation on the project.



