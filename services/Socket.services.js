const CONFIG = require("../config/config");
const socketIo = require("socket.io");
const http = require("http");

exports.connected;

exports.addSocketIO = function (server) {
  let socketServer = socketIo(server);
  let interval;
  socketServer.on("connection", (socket) => {
    console.log("Socket client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);

    socket.on("getNotified", (creds) => {
      issuesNotifications(socket, creds);
    });
    socket.on("getChat", (creds) => {
      userChat(socket, creds);
    });
    socket.on("disconnect", () => {
      // console.log("Socket Client disconnected");
      clearInterval(interval);
    });
  });
  const issuesNotifications = (socket, creds) => {
    var options = {
      host: "192.168.43.213",
      port: 3000,
      path: `/api/notification/accept`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: creds.token,
      },
    };
    var req = http.request(options, function (res) {
      res.setEncoding("utf8");
      res.on("data", function (chunk) {
        socket.emit("FromAPI", chunk);
      });
    });
    req.end();
    // Emitting a new message. Will be consumed by the client
  };

  const userChat = (socket, creds) => {
    var options = {
      host: "192.168.43.213",
      port: 3000,
      path: `/api/chat/get?id=${creds.id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: creds.token,
      },
    };
    var req = http.request(options, function (res) {
      res.setEncoding("utf8");
      res.on("data", function (chunk) {
        socket.emit("FromAPI", chunk);
      });
    });
    req.end();
    // Emitting a new message. Will be consumed by the client
  };

};
