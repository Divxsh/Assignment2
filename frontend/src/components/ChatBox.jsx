import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000").connect();

const ChatBox = () => {
	const [roomDetails, setRoomDetails] = useState({ roomId: "", username: "" });
	const [text, setText] = useState("");
	const [isJoined, setIsJoined] = useState(false);
	const [messages, setMessages] = useState([]);

	// For joining the room
	const joinRoomHandler = async () => {
		const { roomId, username } = roomDetails;

		if (!roomId || !username) return;

		socket.emit("join_room", roomDetails);

		setIsJoined(true);

		const res = await fetch(`http://localhost:5000/fetch-messages/${roomId}`, {
			method: "GET",
		});
		const data = await res.json();
		setMessages([...messages, ...data.messages]);
	};

	const createMessage = (text) => {
		return { text: text, username: roomDetails.username };
	};

	const SendMessage = () => {
		const newMessage = createMessage(text);
		socket.emit("send_message", newMessage, roomDetails);
		setMessages((prev) => [...prev, newMessage]);
		setText("");
	};

	useEffect(() => {
		socket.on("receive_message", (data) => {
			console.log("data", data);
			setMessages((prev) => [...prev, data]);
		});
	}, []);

	console.log("text messages", messages);

	return (
		<div>
			{/* Form for taking details */}
			<div>
				<input
					type='text'
					placeholder='Enter room id'
					onChange={(e) =>
						setRoomDetails({ ...roomDetails, roomId: e.target.value })
					}
				/>
				<input
					type='text'
					placeholder='Enter Your Name'
					onChange={(e) =>
						setRoomDetails({ ...roomDetails, username: e.target.value })
					}
				/>
				<button onClick={joinRoomHandler}>Join Room</button>
			</div>

			{isJoined && (
				<div className='chatBox'>
					<header></header>
					<div style={{ width: "100%", height: "32px" }}>
						<input
							type='text'
							placeholder='Type a message'
							onChange={(e) => setText(e.target.value)}
							value={text}
							style={{ height: "100%" }}
						/>
						<button onClick={SendMessage}>Send Message</button>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							padding: "20px 10px",
							gap: "10px",
						}}
					>
						{messages.map((msg) => {
							return (
								<div
									className='message'
									style={{
										marginLeft:
											msg.username === roomDetails.username ? "auto" : "none",
									}}
								>
									<h5>{msg.username}</h5>
									<span>{msg.text}</span>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatBox;
