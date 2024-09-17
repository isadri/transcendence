interface Message {
	message: string;
	senderId: number;
	receiverId: number;
	time: string;
	image?: string;
	profile?: string;
}

const DataMessage: { [key: string]: Message[] } = {
	rachid: [
		{
			senderId: 1,
			receiverId: 2,
			profile: "/images/wallpaper.jpeg",
			image: "",
			message:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
			numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
			time: "1 min ago",
		},
		{
			senderId: 2,
			receiverId: 1,
			image: "./images/wallpaper.jpeg",
			message:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
			numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
			time: "1 min ago",
		},
	],
	oussama: [
		{
			senderId: 1,
			receiverId: 2,
			profile: "/images/wallpaper.jpeg",
			image: "",
			message:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
			numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
			time: "1 min ago",
		},
		{
			senderId: 2,
			receiverId: 1,
			image: "./images/wallpaper.jpeg",
			message:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
			numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
			time: "1 min ago",
		},
		{
			senderId: 1,
			receiverId: 2,
			profile: "/images/wallpaper.jpeg",
			image: "./images/wallpaper.jpeg",
			message:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
			numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
			time: "1 min ago",
		},
		{
			senderId: 2,
			receiverId: 1,
			image: "./images/wallpaper.jpeg",
			message:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
			numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
			time: "1 min ago",
		},
		{
			senderId: 2,
			receiverId: 1,
			image: "./images/wallpaper.jpeg",
			message:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
			numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
			time: "1 min ago",
		},
	],
	yasmine: [
		{
			senderId: 1,
			receiverId: 2,
			profile: "/images/wallpaper.jpeg",
			image: "",
			message:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
			numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
			time: "1 min ago",
		},
		{
			senderId: 2,
			receiverId: 1,
			image: "./images/wallpaper.jpeg",
			message:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
			numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
			time: "1 min ago",
		},
		{
			senderId: 1,
			receiverId: 2,
			profile: "/images/wallpaper.jpeg",
			image: "./images/wallpaper.jpeg",
			message:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
			numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
			time: "1 min ago",
		},
		{
			senderId: 2,
			receiverId: 1,
			image: "./images/wallpaper.jpeg",
			message:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
			numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
			time: "1 min ago",
		},
		{
			senderId: 2,
			receiverId: 1,
			image: "./images/wallpaper.jpeg",
			message:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
			numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
			time: "1 min ago",
		},
	],
};

export default DataMessage;
