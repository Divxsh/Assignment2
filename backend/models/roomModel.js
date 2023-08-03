const { Schema, model } = require("mongoose");

const roomSchema = new Schema(
	{
		roomId: {
			type: Number,
			required: true,
		},
		messages: [
			{
				username: String,
				text: String,
			},
		],
	},
	{ timestamps: true },
);

const Room = model("room", roomSchema);

module.exports = Room;
