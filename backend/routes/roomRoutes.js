const Room = require("../models/roomModel");
const router = require("express").Router();

router.get("/fetch-messages/:roomId", async (req, res) => {
	const { roomId } = req.params;
	console.log("roomId", roomId);

	if (!roomId) return res.status(400).send("Room creation failed");

	try {
		const roomMessages = await Room.findOne({ roomId });
		console.log("roomMessages", roomMessages);
		return res.status(200).send(roomMessages);
	} catch (err) {
		return res.send(400).send({ msg: "Message fetching failed" });
	}
});

module.exports = router;
