import { Server } from "socket.io";

const socketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);

    socket.emit("yourID", socket.id);

    socket.on("callUser", (data) => {
      io.to(data.userToCall).emit("hey", {
        signal: data.signalData,
        from: data.from,
      });
    });

    socket.on("acceptCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal);
    });
    // Added this to handle endCall event
    socket.on("endCall", (data) => {
      io.to(data.to).emit("callEnded");
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

export default socketServer;
