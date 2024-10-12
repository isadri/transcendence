import { ReactNode } from "react";
import "./BackGround.css";
import circl from "./images/circle.png";
import { useMediaQuery } from "@uidotdev/usehooks";

interface Props {
  children: ReactNode;
  isLogged : boolean
}

const BackGround = ({ children, isLogged }: Props) => {
  const win_width = useMediaQuery("only screen and (max-width : 478px)");
  return (
    <>
      <div className="rectangle0"></div>
      <div className="rectangle1"></div>
      <img src={circl} alt="#" className="circle" />
      <div className="rectangle2"></div>
      <div className="rectangle3"></div>
      <div className="mainPage" style={
        isLogged?
        {
          padding:"0 20px",
          flexDirection : win_width ? "column":  "row",
        } :{

          flexDirection : "row",
        }
      }
      >
          {children}
      </div>
    </>
  );
};

export default BackGround;
