import profile from "./images/profile.jpeg";
import "./ChatTop.css"

const ChatTop = () => {
	return (
		<div className="top">
			<div className="profileInfo">
				<img src={profile} alt="profile" className="image" />
				<div className="textInfo">
					<span>yasmine lachhab</span>
					<p>Last seen today 00:56</p>
				</div>
			</div>
			<i className="fa-solid fa-ellipsis-vertical icon"></i>
		</div>
	);
};

export default ChatTop;
