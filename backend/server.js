const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000;
const server = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
	},
});

require("./connectivity/db.js")();
const Room = require("./models/roomModel.js");

app.use(cors());

app.use("/", require("./routes/roomRoutes"));

io.on("connection", (socket) => {
	console.log("A user connnected", socket.id);

	// Join a room
	socket.on("join_room", async (data) => {
		console.log("data", data);

		//	Check for roomId exist or not, if not create a new room with that roomID
		const roomExist = await Room.findOne({ roomId: data.roomId });
		if (!roomExist) await Room.create({ roomId: data.roomId });

		// Joining the room
		socket.join(data.roomId);
	});

	// Send a message to other users
	socket.on("send_message", async (data, roomDetails) => {
		console.log("data", data, roomDetails);

		// Adding message to db
		await Room.findOneAndUpdate(
			{ roomId: roomDetails.roomId },
			{
				$push: {
					messages: data,
				},
			},
		);

		// Broadcast message to other user of that room
		socket.broadcast.to(roomDetails.roomId).emit("receive_message", data);
	});

	socket.on("disconnect", () => {
		console.log("A user disconnected");
	});
});

server.listen(PORT, () => console.log("server is listening at ", PORT));
