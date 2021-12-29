const express = require("express");
const socket = require("socket.io");

let app = express(); // Initialization and server ready

app.use(express.static("public"));  // load frontend
let port = 5000;
let server = app.listen(port, () => {
    console.log("Listening to port: " + port);
});
let io = socket(server);
io.on("connection", (socket) => {
    console.log("Made socket Connection");

    // Data t=received
    socket.on("beginPath", (data) => {
        // Data from frontend
        // Now data transfer to all computers
        io.sockets.emit("beginPath", data);
    })
    socket.on("drawStroke", (data) => {
        // Data from frontend
        // Now data transfer to all computers
        io.sockets.emit("drawStroke", data);
    })
    socket.on("undoRedo", (data) => {
        // Data from frontend
        // Now data transfer to all computers
        io.sockets.emit("undoRedo", data);
    })

})