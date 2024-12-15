import axios from "axios";
import "./Setting.css";
import ava from "./images/default.jpeg"
import { useEffect, useState } from "react";
import { getContext, getUser, getendpoint } from "../../context/getContextData";
import { useNavigate } from "react-router-dom";
import { verify } from "crypto";

interface Data {
  username: string | undefined;
  email: string | undefined;
  avatar: string | undefined;
  CurrentPassword: string;
  password: string;
  confirmPassword: string;
}


const Setting = () => {
  const authContext = getContext()
  const navigate = useNavigate();
  const [myAlert, SetMyAlert] = useState(false)
  const [showAlert, setShowAlert] = useState(false);
  const [showOtpAlert, SetshowOtpAlert] = useState(false)
  const [createdAlert, setcreatedAlert] = useState<string>("")
  const [otpcode, setOtpCode] = useState('')
  const [isOtpActive, setIsOtpActive] = useState(false)
  const [Verified, setVerified] = useState(0)

  const [confirm, SetConfirm] = useState(1)
  const [errors, SetErrors] = useState<Data>({
    username: "",
    email: "",
    avatar: "",
    CurrentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const context = getContext();
  const user = getUser();
  const [IsRemove, SetIsRemove] = useState(false);
  const [dataUpdated, SetDataUpdated] = useState<Data>({
    username: user?.username,
    email: user?.email,
    avatar: "",
    CurrentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const handelDeleteAccount = (state: string) =>{
    setShowAlert(true)
    if (state === "confirm")
    {
      authContext?.setDisplayed(2);
    }
    else
      SetConfirm(3)
  axios
    .delete(getendpoint("http", "/api/accounts/deleteUser/"), {
      data: {confirm: state === "confirm" ?  "yes" : "no" },
      withCredentials: true,
    })
    .then((response) =>{
      authContext?.setCreatedAlert(response.data.detail);
      authContext?.setIsLogged(false)
      navigate('/')
    })
    .catch((error) => {
        SetMyAlert(false)
        setcreatedAlert(error.response.data.detail)
    })
  }

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    SetDataUpdated({ ...dataUpdated, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      SetIsRemove(false);
      const previewUrl = URL.createObjectURL(file);
      SetDataUpdated((prevData) => {
        const updatedData = {...prevData, avatar: previewUrl};
        return updatedData;
      });
    }
  };

  const UpdateUserData = () => {
    const formData = new FormData();
    formData.append("username", dataUpdated.username || "");
    formData.append("email", dataUpdated.email || "");

    formData.append("isRemove", IsRemove ? "yes" : "no");
    if (dataUpdated.avatar) {
      const avatarFileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (avatarFileInput?.files?.[0]) {
        formData.append("avatar", avatarFileInput.files[0]);
      }
    }
    axios
      .put(getendpoint("http", "/api/accounts/updateuserData/"), formData, {
        withCredentials: true,
      })
      .then((response) => {
        context?.setUser(response.data);
        SetErrors({ ...errors, username: "", email: "", avatar: "" });
      })
      .catch((error) => {
        SetErrors(error.response.data);
      });
  };

  const UpdateUserPass = () => {
    SetIsRemove(false);
    const formData = new FormData();
    if (dataUpdated.password)
      formData.append("password", dataUpdated.password || "");
    if (dataUpdated.CurrentPassword)
      formData.append("CurrentPassword", dataUpdated.CurrentPassword || "");
    if (dataUpdated.confirmPassword)
      formData.append("confirmPassword", dataUpdated.confirmPassword || "");

    axios
      .put(getendpoint("http", "/api/accounts/updateuserPass/"), formData, {
        withCredentials: true,
      })
      .then(() => {
        SetErrors({
          ...errors,
          CurrentPassword: "",
          password: "",
          confirmPassword: "",
        });
      })
      .catch((error) => {
        SetErrors(error.response.data);
      });
  };
  const handelChangeButton = () => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  const handelRemoveAvatar = () => {
    SetIsRemove(true);
    SetDataUpdated((prevData) => {
      const updatedData = { ...prevData, avatar: "" };
      return updatedData;
    });
  };
  
  const handleOtpToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      console.log("OTP Enabled");
      SetshowOtpAlert(true);
      sendOtpRequest();
    } else {
      console.log("OTP Disabled");
      SetshowOtpAlert(false);
    }
  };

  const sendOtpRequest = () => {
    axios.post(getendpoint("http", "/api/accounts/SendOTPView/"),{}, {withCredentials: true})
    .then(response => {
      // setOtpCodeVerify(response.data.otp)
      console.log(response.data.message)
    })
  };
  
  const handelVerifyCode = () => {
    axios.post(getendpoint("http", "/api/accounts/checkValidOtp/"), {key : otpcode}, {withCredentials: true})
      .then(response => {
        setVerified(2)
        console.log(response.data.message)
      })
      .catch(error => {
        setVerified(1)
        console.log(error.response.error)
      })
    // console.log("code send on email => ", otpcodeVerify)
    // console.log("code entred by user => ", otpcode)
      // if (otpcodeVerify === otpcode)
      // else
      //   setVerified(1)
  }
  
  const handelActiveOTP = () => {
    const checkbox = document.getElementById('otpToggle') as HTMLInputElement;
    checkbox.checked = true;
    SetshowOtpAlert(false)
    setVerified(0)
  }

  useEffect(() => {
    axios.get(getendpoint("http", "/api/accounts/SendOTPView/"), {withCredentials: true})
    .then((response) => {
      console.log("is otp active => ", response.data)
      if (response.data === true)
      {
        const checkbox = document.getElementById('otpToggle') as HTMLInputElement;
        checkbox.checked = true;
        setIsOtpActive(true)
      }
      else{
        const checkbox = document.getElementById('otpToggle') as HTMLInputElement;
        checkbox.checked = false;
        setIsOtpActive(false)
      }
    })
    if (showAlert) {
      setTimeout(() => {
        SetConfirm(1);
      }, 900);
    }
  }, [showAlert, Verified]);
  

  return (
    <>
      <div className={`alert-acountNotDeleted ${confirm === 3 ? "show" : "hide"}`}>
          <i className="fa-solid fa-circle-exclamation"></i>
          <span>{createdAlert}</span>
      </div>
      <div className="Par">
        <div className="settingPage">
          <h1>Settings</h1>
          <div className="settingContent">
            <div className="ProfileEdit">
              <h2 >Edit Profile</h2>
            <div className="ChangeAvatar">
              <div className="img">
                <img
                  src={IsRemove ? ava :
                    dataUpdated.avatar || getendpoint("http", user?.avatar || "")
                  }
                  alt="Avatar"
                />
              </div>
              <div className="btns">
                <button type="submit" onClick={handelRemoveAvatar}>
                  Remove
                </button>
                <button type="submit" onClick={handelChangeButton}>
                  Change
                </button>
                <input
                  type="file"
                  name="avatar"
                  onChange={handleFileChange}
                  id="file-input"
                  style={{ display: "none" }}
                />
              </div>
            </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="ProfileEdit-C1">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={dataUpdated.username}
                    onChange={handleInputChange}
                  />
                  {errors.username !== "" && (
                    <p className="SettingError">{errors.username}</p>
                  )}
                </div>
                <div className="ProfileEdit-C2">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={dataUpdated.email}
                    onChange={handleInputChange}
                  />
                  {errors.email !== "" && (
                    <p className="SettingError">{errors.email}</p>
                  )}
                </div>
              </form>
              <div className="saveProfileEdit">
                <button type="button" onClick={UpdateUserData}>
                  Save Changes
                </button>
              </div>
            </div>
            <div className="ChangePass">
              <h2>Change Password</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="ChangePass-C1">
                  <label htmlFor="CurrentPassword">Current Password</label>
                  <input
                    type="text"
                    name="CurrentPassword"
                    id="CurrentPassword"
                    value={dataUpdated.CurrentPassword}
                    onChange={handleInputChange}
                  />
                  {errors.CurrentPassword !== "" && (
                    <p className="SettingError">{errors.CurrentPassword}</p>
                  )}
                  <label htmlFor="password">New Password</label>
                  <input
                    type="text"
                    name="password"
                    id="password"
                    value={dataUpdated.password}
                    onChange={handleInputChange}
                  />
                  {errors.password !== "" && (
                    <p className="SettingError">{errors.password}</p>
                  )}
                </div>
                <div className="ChangePass-C2">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="text"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={dataUpdated.confirmPassword}
                    onChange={handleInputChange}
                  />
                  {errors.confirmPassword !== "" && (
                    <p className="SettingError">{errors.confirmPassword}</p>
                  )}
                </div>
              </form>
              <div className="saveProfileEdit">
                <button type="button" onClick={UpdateUserPass}>
                  Save Changes
                </button>
              </div>
            </div>
            <div className="EnableOtp">
              <div className="check">
                <label htmlFor="otpToggle">Enable Two-Factor Authentication (2FA)</label>
                <input id="otpToggle" type="checkbox" onChange={handleOtpToggle}/>
              </div>
              <div className="content">
                <span className="description">Secure your account by enabling 2FA. You will be required to enter a one-time password during login.</span>
              </div>
            </div>
            <div className="Setting-action">
              <span onClick={() => {SetMyAlert(true)}}>
                <i className="fa-solid fa-trash-can"></i>
                Delete Account
              </span>
            </div>
          </div>
          {
            myAlert &&
            <div className="GameModePopUpBlur">
              <div className="alertDeleteUser">
                  <div className="content">
                    <div className="content-text">
                        <div className="iconborder">
                          <i className="fa-solid fa-trash-can"></i>
                        </div>
                      <div className="alert-text">
                        <h3>Are you sure you want to delete your account</h3>
                        <span>This action cannot be undone. Once your account is deleted,
                          all your data, including your profile, game history, and settings,
                          will be permanently removed.
                          If you wish to proceed, click <b>Confirm</b> . To cancel, click <b>Cancel</b>
                        </span>
                      </div>
                    </div>
                    <div className="btns alert-btns">
                        <button type="submit" onClick={() => {handelDeleteAccount("cancel")}}>Cancel</button>
                        <button type="submit" onClick={() => {handelDeleteAccount("confirm")}}>Confirm</button>
                    </div>
                  </div>
                </div>
            </div>
          }
          {
            showOtpAlert && 
            <div className="GameModePopUpBlur">
              {
                Verified === 0 ?
                <div className="alertDeleteUser alertOTP">
                  <div className="contentOtp">
                    <div className="iconEmail">
                    <i className="fa-solid fa-envelope-open-text"></i>
                    <span></span>
                    </div>
                    <div className="content-text">
                      <h3>Please enter the verification code to activate Two-Factor Authentication</h3>
                      <span>A verification code has been sent to your email. Please check your inbox.</span>
                      <input type="text" placeholder="Enter Code" value={otpcode} onChange={e => setOtpCode(e.target.value)}/>
                    </div>
                    <div className="Codefiled">
                      <button type="submit" onClick={handelVerifyCode}>Verify</button>
                    </div>
                  </div>
                </div>
               : ( Verified === 1 ? (
                <div className="alertDeleteUser alertOTP">
                  <div className="contentvalidate">
                    <i className="fa-solid fa-circle-xmark"></i>
                    <h2 className="fail">Oops!</h2>
                    <h3>Two-factor authentication failed!</h3>
                    <span>The code you entered is invalid. Please try again.</span>
                    <div className="Codefiled">
                      <button type="submit" className="failbutton" >TRY AGAIN</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="alertDeleteUser alertOTP">
                  <div className="contentvalidate">
                      <i className="fa-solid fa-circle-check"></i>
                      <h2>SUCCESS!</h2>
                      <h3>Two-factor authentication successfully activated!</h3>
                      <span>Your account is now more secure.</span>
                      <div className="Codefiled">
                        <button type="submit" onClick={handelActiveOTP}>Done</button>
                      </div>
                  </div>
                </div>
              ))
              }
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default Setting;
