import { ReactNode } from "react";
import "./BackGround.css";
import circl from "./images/circle.png";
interface Props {
  children: ReactNode;
  isLogged : boolean
}

const BackGround = ({ children, isLogged }: Props) => {
  return (
    <>
      <div className="rectangle0"></div>
      <div className="rectangle1"></div>
      <img src={circl} alt="#" className="circle" />
      <div className="rectangle2"></div>
      <div className="rectangle3"></div>
      <div className="mainPage" style={isLogged?{padding:"0 20px"}:{}}>{children}</div>
    </>
  );
};

export default BackGround;
