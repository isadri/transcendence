import { ReactNode } from "react";
import "./BackGround.css";
import { useMediaQuery } from "@uidotdev/usehooks";
import { getContext } from "../../context/getContextData";
import Alert from "../Alert/Alert";

interface Props {
	children: ReactNode;
	isLogged: boolean | null;
}

const BackGround = ({ children, isLogged }: Props) => {
	const account = getContext() 
	const win_width = useMediaQuery("only screen and (max-width : 478px)");
	return (
		<>
			{/* <div className="rectangle0"></div>
      <div className="rectangle1"></div>
      <img src={circl} alt="#" className="circle" />
      <div className="rectangle2"></div>
      <div className="rectangle3"></div> */}
			<div className="main_container">
				<div
					className="mainPage"
					style={
						isLogged
							? {
								// padding: "0 20px", possible to make problem
								flexDirection: win_width ? "column" : "row",
							}
							: {
								backgroundColor: "transparent",
								flexDirection: "column",
								justifyContent: "center",
							}
					}
				>
					<Alert >
						<span>{account?.createdAlert}</span>
					</Alert>
					{children}
				</div>
			</div>
		</>
	);
};

export default BackGround;
