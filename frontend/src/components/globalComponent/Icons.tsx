import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
	getContext,
	getNotifications,
	getUnreadCount,
	getUser,
	getendpoint,
} from "../../context/getContextData";
import { Link, useLocation } from "react-router-dom";

function Icons() {
	const user = getUser()
	const contxt = getContext()
	const notificationList = getNotifications()
	const UnreadNotif = getUnreadCount()
	const [isIconClicked, setIsIconClicked] = useState(false)
	const [isOnline, setIsOnline] = useState<boolean>(user?.is_online || false)
	// const [notificationList, setNotificationList] = useState<NotificationsData[]>([])
	// const [unread, setUnread] = useState(0)
	const location = useLocation()
	const closeMenuRef = useRef<HTMLDivElement>(null);
	const buttonMenuRef = useRef<HTMLDivElement>(null);
	const hideProfileImg = location.pathname === "/" || location.pathname === "/home"
		|| location.pathname === "/profile"
	const handelNotifacations = () => {
		setIsIconClicked(!isIconClicked)
	}
	const handelClearAll = () => {
		axios
			.delete(getendpoint("http", "/api/notifications/clear-all-notif/"), {
				withCredentials: true,
			})
			.then(() => {
				console.log("hello")
				contxt?.setUnreadCount(0);
				contxt?.setNotifications([])
			})
			.catch((error) => {
				console.log("Error clearing notifications:", error.response);
			});
	};

	const formatDateTime = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		})
			.format(date)
			.replace(",", "");
	};

	const deleteNotification = (notifId: Number) => {
		axios
			.delete(getendpoint("http", `/api/notifications/delete-notif/${notifId}`), {
				withCredentials: true,
			})
      .then(() => {
        axios
          .get(getendpoint("http", "/api/notifications/notifications/"),
            { withCredentials: true })
          .then((response) => {
            console.log("res => ", response.data);
            contxt?.setNotifications(response.data)
          })
          .catch(error => {
            console.log(error.response)
          })
      })
		// setIsIconClicked(!isIconClicked)
	}

	const handleDeclineInvite = (id: Number, notifId: Number) => {
		axios
			.delete(getendpoint("http", `/api/game/invite/${id}/decline/`), {
				withCredentials: true,
			})
			.catch((error) => {
				console.log("Error delete invite request:", error.response);
			});
		deleteNotification(notifId)
	};
	useEffect(() => {
		axios
			.get(getendpoint("http", "/api/notifications/notifications/"),
				{ withCredentials: true })
			.then((response) => {
				console.log("res => ", response.data);
				contxt?.setNotifications(response.data)
			})
			.catch(error => {
				console.log(error.response)
			})
	}, [])
	useEffect(() => {
		if (isIconClicked) {
			axios.post(getendpoint("http", "/api/notifications/mark-all-read/"), {},
				{ withCredentials: true })
				.then(() => {
					console.log("clicked")
					contxt?.setUnreadCount(0);
				})
		}
		axios.get(getendpoint("http", "/api/notifications/unreadNotifications/"),
			{ withCredentials: true })
			.then(response => {
				contxt?.setUnreadCount(response.data.unread_notifications_count)
			})
			.catch(error => {
				console.log(error.response)
			})
		setIsOnline(user?.is_online || false)
	}, [isIconClicked, user?.is_online, contxt?.unreadCount]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				closeMenuRef.current &&
				!closeMenuRef.current.contains(event.target as Node) &&
				buttonMenuRef.current &&
				!buttonMenuRef.current.contains(event.target as Node)
			) {
				setIsIconClicked(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	return (
		<>
			<span className="Home-Icons">
				<div ref={closeMenuRef} className="notifIcon">
					{UnreadNotif !== 0 && (
						<div className="unreadNotif">
							<span>{UnreadNotif}</span>
						</div>
					)}
					<i
						ref={buttonMenuRef}
						className="fa-solid fa-bell"
						onClick={handelNotifacations}
					></i>
					{isIconClicked && (
						<div className="Notifications">
							<div className="topSide">
								<span>Your Notifications</span>
							</div>
							{notificationList && notificationList.length > 0 ? (
								<>
									<div className="dropConntent">
										{notificationList.map((notif) => {
											let data = null;
											if (notif.type === "Game invite")
												data = JSON.parse(notif.message);
											return (
												<div key={notif.id} className="notification-ele">
													<div className="Notif-info">
														<span>{notif.type}</span>
														<span>{formatDateTime(notif.created_at)}</span>
													</div>
													{notif.type === "Game invite" ? (
														<>
															<div className="Notif-msg">
																<div className="invite-text-icon">
																	<span>{data.message}</span>
																	<div className="invite-icon">
																		<Link
																			to={`/game/warmup/friends/${data.inviteId}`} onClick={() =>{
																				setIsIconClicked(!isIconClicked)
																			}}
																		>
																			<i className="fa-solid fa-check accept-invete"></i>
																		</Link>
																		<i
																			className="fa-solid fa-x refuse-invete"
																			onClick={() =>
																				handleDeclineInvite(
																					data.inviteId,
																					notif.id
																				)
																			}
																		></i>
																	</div>
																</div>
															</div>
															{/* <div className="Notif-msg">
															</div> */}
														</>
													) : (
														<div className="Notif-msg">
															<span>{notif.message}</span>
														</div>
													)}
												</div>
											);
										})}
									</div>
									<div className="footerSide">
										<button onClick={handelClearAll}>Clear All</button>
									</div>
								</>
							) : (
								<div className="No-Notif">
									<span>No notifications available</span>
								</div>
							)}
						</div>
					)}
				</div>
				{!hideProfileImg && (
					<div className="userInfoGlobal">
						<div className=" imgGlobal">
							<Link to="/profile" className="imag">
								{user && <img src={getendpoint("http", user?.avatar)} alt="" />}
							</Link>
							{isOnline && <div className="onlineCircle globalCircle"></div>}
							<div className="hover-on-user">{user?.username}</div>
						</div>
						{/* <div className="userName">
              <span>{user?.username}</span>
            </div> */}
					</div>
				)}
			</span>
		</>
	);
}

export default Icons;
