import "./ChatTop.css";
import { useEffect, useRef, useState } from "react";
import { useChatContext, GetChats } from "./context/ChatUseContext";
import {
	getContext,
	getUser,
	getendpoint,
} from "../../../context/getContextData";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ChatTopProps {
	selectedFriend: GetChats;
	setSelectedFriend: React.Dispatch<React.SetStateAction<GetChats | null>>;
}

const ChatTop = ({ selectedFriend, setSelectedFriend }: ChatTopProps) => {
	const [openMenu, setOpenMenu] = useState(false);
	const closeMenuRef = useRef<HTMLDivElement>(null);
	const buttonMenuRef = useRef<HTMLDivElement>(null);
	const { block, blockUnblockFriend, activeChat, setActiveChatId } =
		useChatContext();
	const user = getUser();
	const navigate = useNavigate();
	const cntext = getContext();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				closeMenuRef.current &&
				!closeMenuRef.current.contains(event.target as Node) &&
				buttonMenuRef.current &&
				!buttonMenuRef.current.contains(event.target as Node)
			) {
				setOpenMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleBlock = async () => {
		if (!user) return;
		let friend_id;
		if (user?.id === selectedFriend.user1.id) {
			friend_id = selectedFriend.user2.id;
		} else {
			friend_id = selectedFriend.user1.id;
		}
		try {
			if (block?.status) {
				blockUnblockFriend({
					chatid: selectedFriend.id,
					blocker: user?.id,
					blocked: friend_id,
					status: false,
				});
			} else {
				blockUnblockFriend({
					chatid: selectedFriend.id,
					blocker: user?.id,
					blocked: friend_id,
					status: true,
				});
			}
			setOpenMenu(false);
		} catch (err) {
		}
	};
	const handleInvitePlay = () => {
		if (!user) return;
		let friend_id;
		if (user?.id === selectedFriend.user1.id) {
			friend_id = selectedFriend.user2.id;
		} else {
			friend_id = selectedFriend.user1.id;
		}
		axios
			.post(getendpoint("http", `/api/game/invite/`), { invited: friend_id })
			.then((response) => {
				navigate(`/game/warmup/friends/${response.data.id}`);
			})
			.catch((error) => {
				cntext?.setCreatedAlert(error.response.data.error);
				cntext?.setDisplayed(3);
			});
	};

	const friend_user =
		user?.id === selectedFriend.user2.id
			? selectedFriend.user1
			: selectedFriend.user2;

	return (
		<div className="top">
			<div className="profileInfo">
				<i
					className="fa-solid fa-arrow-left arrowClose"
					onClick={() => {
						setSelectedFriend(null);
						activeChat({ chatid: -1 });
						setActiveChatId(null);
					}}
				></i>
				<img
					src={getendpoint("http", friend_user.avatar)}
					alt="profile"
					className="image"
					onClick={() => navigate(`/profile/${friend_user.username}`)}
				/>
				<div className="textInfo">
					<span onClick={() => navigate(`/profile/${friend_user.username}`)}>
						{friend_user.username}
					</span>
				</div>
			</div>
			<div ref={buttonMenuRef}>
				<i
					className={`fa-solid fa-ellipsis-vertical icon-menu ${
						openMenu ? "activeMenu" : ""
					}`}
					ref={closeMenuRef}
					onClick={() => setOpenMenu(!openMenu)}
				></i>
				{openMenu && (
					<ul className="menu-list">
						<li onClick={handleInvitePlay}>Invite to play</li>
						<li onClick={() => navigate(`/profile/${friend_user.username}`)}>
							Friend profile
						</li>
						<li
							onClick={() => {
								setSelectedFriend(null);
								activeChat({ chatid: -1 });
								setActiveChatId(null);
							}}
						>
							Close chat
						</li>
						{block?.status && block.blocker === user?.id ? (
							<li onClick={handleBlock}>Unblock</li>
						) : (
							!block?.status && <li onClick={handleBlock}>Block</li>
						)}
					</ul>
				)}
			</div>
		</div>
	);
};

export default ChatTop;
