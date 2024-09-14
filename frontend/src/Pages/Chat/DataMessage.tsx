interface Message {
	message: string;
	senderId: number;
	receverId: number;
	time: string;
	image?: string;
	profile?: string;
}

const DataMessage: Message[] = [
	{
		senderId: 1,
		receverId: 2,
		profile: "/images/wallpaper.jpeg",
		image: "",
		message:
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
		numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
		time: "1 min ago",
	},
	{
		senderId: 2,
		receverId: 1,
		image: "./images/wallpaper.jpeg",
		message:
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
		numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
		time: "1 min ago",
	},
	{
		senderId: 1,
		receverId: 2,
		profile: "/images/wallpaper.jpeg",
		image: "./images/wallpaper.jpeg",
		message:
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
		numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
		time: "1 min ago",
	},
	{
		senderId: 2,
		receverId: 1,
		image: "./images/wallpaper.jpeg",
		message:
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
		numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
		time: "1 min ago",
	},
	{
		senderId: 2,
		receverId: 1,
		image: "./images/wallpaper.jpeg",
		message:
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
		numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
		time: "1 min ago",
	},
	{
		senderId: 1,
		receverId: 2,
		image: "./images/wallpaper.jpeg",
		profile: "/images/wallpaper.jpeg",
		message:
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
		numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
		time: "1 min ago",
	},
	{
		senderId: 2,
		receverId: 1,
		image: "./images/wallpaper.jpeg",
		message:
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
		numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
		time: "1 min ago",
	},
	{
		senderId: 1,
		receverId: 2,
		image: "./images/wallpaper.jpeg",
		profile: "/images/wallpaper.jpeg",
		message:
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
		numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
		time: "1 min ago",
	},
	{
		senderId: 2,
		receverId: 1,
		image: "./images/wallpaper.jpeg",
		message:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio fugiat nisi id expedita, quidem dolorum nesciunt unde facilis eaque,\
			 numquam fuga est provident asperiores incidunt cum perspiciatis voluptas dicta nihil.",
		time: "1 min ago",
	},
];

export default DataMessage;
