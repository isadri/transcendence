import React from "react";
import { getContext, getendpoint } from "../../context/getContextData";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Props {
    myAlert: boolean;
    setMyAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

function Alert({ setMyAlert, myAlert }: Props) {
  const authContext = getContext();
  const navigate = useNavigate();
  const handelDeleteAccount = (state: string) => {
    axios
      .delete(getendpoint("http", "/api/accounts/deleteUser/"), {
        data: { confirm: state === "confirm" ? "yes" : "no" },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data.detail);
        authContext?.setIsLogged(false);
        navigate("/");
      })
      .catch((error) => {
        etMyAlert(false);
        console.log(error.response.data.detail);
        console.log( "===>",myAlert)
      });
  };
  return (
    <div className="GameModePopUpBlur">
      <div className="alertDeleteUser">
        <div className="content">
          <div className="content-text">
            <div className="iconborder">
              <i className="fa-solid fa-trash-can"></i>
            </div>
            <div className="alert-text">
              <h3>Are you sure you want to delete your account</h3>
              <span>
                This action cannot be undone. Once your account is deleted, all
                your data, including your profile, game history, and settings,
                will be permanently removed. If you wish to proceed, click
                <b>Confirm</b>. To cancel, click <b>Cancel</b>
              </span>
            </div>
          </div>
          <div className="btns alert-btns">
            <button
              type="submit"
              onClick={() => {
                handelDeleteAccount("cancel");
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={() => {
                handelDeleteAccount("confirm");
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alert;
