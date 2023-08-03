const mongoose = require("mongoose");

const connectDb = async () => {
	try {
		await mongoose.connect("mongodb://localhost:27017/chat-db", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Mongodb is connected");
	} catch (error) {
		console.log("Connection failed");
	}
};

module.exports = connectDb;
