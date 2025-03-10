import axios from "axios";
import "./Setting.css";
import ava from "./images/default.jpeg"
import { useEffect, useState } from "react";
import { getContext, getUser, getendpoint} from "../../context/getContextData";


interface ErrorData {
  username: string | undefined;
  tmp_email: string | undefined;
  avatar: string | undefined;
  CurrentPassword: string;
  password: string;
  confirmPassword: string;
}

interface Data {
  username: string | undefined;
  email: string | undefined;
  avatar: string | undefined;
  CurrentPassword: string;
  password: string;
  confirmPassword: string;
}

axios.defaults.withCredentials = true
const Setting = () => {
  const authContext = getContext()
  const user = getUser();
  // const navigate = useNavigate();
  // const [myAlert, SetMyAlert] = useState(false) // alert confirm or cancel deleting account 
  // const [showAlert, setShowAlert] = useState(false); // show alert of cancel deleting account
  const [showOtpAlert, SetshowOtpAlert] = useState(false) // otp alert
  // const [createdAlert, setcreatedAlert] = useState<string>("") //cancel deleting alert content
  const [otpcode, setOtpCode] = useState('') //code entred by the user
  const [Verified, setVerified] = useState(0) // otp valid => done alert, otp invalid try agin alert
  // const [_confirm, SetConfirm] = useState(1)// set confirm deleting or cancel deleting alert 
  const [IsRemove, SetIsRemove] = useState(false); //is icon removed or not
  const [isOtpDisactive, setIsOtpDisactive] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState(false)
  const [errors, SetErrors] = useState<ErrorData>({
    username: "",
    tmp_email: "",
    avatar: "",
    CurrentPassword: "",
    password: "",
    confirmPassword: "",
  }); //errors 
  const [dataUpdated, SetDataUpdated] = useState<Data>({ // user data updated
    username: user?.username,
    email: user?.email,
    avatar: "",
    CurrentPassword: "",
    password: "",
    confirmPassword: "",
  });

  // handel setting data changed username, email, password and avatar
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updateVal = name === 'username' ? value.toLowerCase() : value
    SetDataUpdated({ ...dataUpdated, [name]: updateVal });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      SetIsRemove(false);
      const previewUrl = URL.createObjectURL(file);
      SetDataUpdated((prevData) => {
        const updatedData = { ...prevData, avatar: previewUrl };
        return updatedData;
      });
    }
  };

  const UpdateUserData = () => {
    const formData = new FormData();
    formData.append("username", dataUpdated.username || "")
    formData.append("email", dataUpdated.email || "");
    formData.append("isRemove", IsRemove ? "yes" : "no")
    if (dataUpdated.avatar) {
      const avatarFileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (avatarFileInput?.files?.[0]) {
        formData.append("avatar", avatarFileInput.files[0]);
      }
    }
    if (formData.get("username") !== user?.username
      || formData.get("email") !== user?.email
      || (formData.get("avatar") || IsRemove))
    {
      // if (formData.get("email") !== user?.email) {
      //   setConfirmEmail(true)
      //   axios.post(getendpoint("http", `/api/accounts/SendOTPView/${user?.username}/`), { val: true }, { withCredentials: true })
      // }
      axios
        .put(getendpoint("http", "/api/accounts/updateuserData/"), formData, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.message)
          {
            setConfirmEmail(true)
          }
          else
          {
            authContext?.setUser(response.data.data);
            SetErrors({ ...errors, username: "", tmp_email: "", avatar: "" });
            authContext?.setCreatedAlert("Your information has been updated successfully");
            authContext?.setDisplayed(5)
          }
        })
        .catch((error) => {
          SetErrors(error.response.data);
        });
    }
    else {
      authContext?.setCreatedAlert("No changes detected in your data");
      authContext?.setDisplayed(4)
    }
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
        authContext?.setCreatedAlert("Your Password has been updated successfully");
        authContext?.setDisplayed(5)
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

  //  delete account handling
  // const handelDeleteAccount = (state: string) => {
  //   setShowAlert(true)
  //   if (state === "confirm") {
  //     authContext?.setDisplayed(2);
  //   }
  //   else
  //     SetConfirm(3)
  //   axios
  //     .delete(getendpoint("http", "/api/accounts/deleteUser/"), {
  //       data: { confirm: state === "confirm" ? "yes" : "no" },
  //       withCredentials: true,
  //     })
  //     .then((response) => {
  //       // authContext?.setCreatedAlert(response.data.detail);
  //       authContext?.setCreatedAlert(response.data.detail);
  //       authContext?.setDisplayed(5)
  //       authContext?.setIsLogged(false)
  //       navigate('/')
  //     })
  //     .catch((error) => {
  //       SetMyAlert(false)
  //       authContext?.setDisplayed(3)
  //       authContext?.setCreatedAlert(error.response.data.detail)
  //       // setcreatedAlert(error.response.data.detail)
  //     })
  // }

  // handel otp activation

  const disableOtp = () => {
    const checkbox = document.getElementById('otpToggle') as HTMLInputElement;
    checkbox.checked = false
    SetshowOtpAlert(false);
    setIsOtpDisactive(true)
    axios.post(getendpoint("http", `/api/accounts/SendOTPView/${user?.username}/`),{val: false}, {withCredentials: true})
  }

  const handleOtpToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      SetshowOtpAlert(true);
      axios.post(getendpoint("http", `/api/accounts/SendOTPView/${user?.username}/`),{val: true}, {withCredentials: true})
    } else {
      disableOtp()
    }
  };

  const handelVerifyCode = () => {
    axios.post(getendpoint("http", "/api/accounts/checkValidOtp/"), { key: otpcode }, { withCredentials: true })
      .then(() => {
        setVerified(2)
      })
      .catch(() => {
        setVerified(1)
      })
      setOtpCode('')
  }

  const handelVerifyCodeOfEmail = () => {
    axios.post(getendpoint("http", "/api/accounts/checkValidOtpEmail/"), {key: otpcode})
      .then((response) => {
        setVerified(2)
        if(user)
        {
          // user.email = response.data
          authContext?.setUser(response.data)
          SetDataUpdated({...dataUpdated, email:response.data.email})
          authContext?.setCreatedAlert("Your information has been updated successfully");
          authContext?.setDisplayed(5)
          
        }
      })
      .catch(() => {
        setVerified(1)
      })
      setOtpCode('')
  }

  const handelActiveOTP = () => {
    SetshowOtpAlert(false)
    setVerified(0)
  }
  const handelFailedEmailVer = () => {
    setConfirmEmail(false)
    setVerified(0)
  }

  useEffect(() => {
    axios.get(getendpoint("http", `/api/accounts/SendOTPView/${user?.username}`), { withCredentials: true })
      .then((response) => {
        const checkbox = document.getElementById('otpToggle') as HTMLInputElement
        if (response.data === true)
          checkbox.checked = true
        else
        {
          checkbox.checked = false
        }
      })
    // if (showAlert) {
    //   setTimeout(() => {
    //     SetConfirm(1);
    //     setIsOtpDisactive(false)
    //   }, 900);
    // }
    setTimeout(() => {
      setIsOtpDisactive(false)
    }, 900);
  }, [Verified, setIsOtpDisactive, isOtpDisactive]);
  return (
    <>
      <div className={`alert-acountNotDeleted ${isOtpDisactive ? "show" : "hide"}`}>
        <i className="fa-solid fa-circle-exclamation"></i>
        <span>Two-Factor Authentication disabled</span>
      </div>
      <div className="Par">
        <div className="settingPage">
          <div className="settingContent">
            <h1>Settings</h1>
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
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    id="file-input"
                    style={{ display: "none" }}
                  />
                </div>
              </div>
              <form className="dataform" onSubmit={(e) => e.preventDefault()}>
                <div className="ProfileEdit-C1">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={dataUpdated.username}
                    onChange={handleInputChange}
                  />
                  {errors.username !== undefined && (
                    <p className={`${errors.username !== "" ? "SettingError" : ""}`}>{errors.username}</p>
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
                  {errors.tmp_email !== undefined && (
                    <p className={`${errors.tmp_email !== "" ? "SettingError" : ""}`}>{errors.tmp_email}</p>
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
              <form className="PassForm" onSubmit={(e) => e.preventDefault()}>
                <div className="ChangePass-C1">
                  <label htmlFor="CurrentPassword">Current Password</label>
                  <input
                    type="password"
                    name="CurrentPassword"
                    id="CurrentPassword"
                    value={dataUpdated.CurrentPassword}
                    onChange={handleInputChange}
                    disabled={!user?.usable_password}
                  />
                  {errors.CurrentPassword !== undefined && (
                    <p className={`${errors.CurrentPassword !== "" ? "SettingError" : ""}`}>{errors.CurrentPassword}</p>
                  )}
                </div>
                <div className="ChangePass-C2">
                  <div className="element1-changPass">
                    <label htmlFor="password">New Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={dataUpdated.password}
                      onChange={handleInputChange}
                      onCopy={(e) => e.preventDefault()}
                    />
                    {errors.password !== undefined && (
                      <p className={`${errors.password !== "" ? "SettingError" : ""}`}>{errors.password}</p>
                    )}
                  </div>
                  <div className="element1-changPass">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={dataUpdated.confirmPassword}
                      onChange={handleInputChange}
                    />
                    {errors.confirmPassword !== undefined && (
                      <p className={`${errors.confirmPassword !== "" ? "SettingError" : ""}`}>{errors.confirmPassword}</p>
                    )}
                  </div>
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
                <input id="otpToggle" type="checkbox" onChange={handleOtpToggle} />
              </div>
              <div className="content">
                <span className="description">Secure your account by enabling 2FA. You will be required to enter a one-time password during login.</span>
              </div>
            </div>
            {/* <div className="Setting-action">
              <span onClick={() => { SetMyAlert(true) }}>
                <i className="fa-solid fa-trash-can"></i>
                Delete Account
              </span>
            </div> */}
          </div>
          {/* {
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
                    <button type="submit" onClick={() => { handelDeleteAccount("cancel") }}>Cancel</button>
                    <button type="submit" onClick={() => { handelDeleteAccount("confirm") }}>Confirm</button>
                  </div>
                </div>
              </div>
            </div>
          } */}
          {
            confirmEmail &&
            <div className="GameModePopUpBlur">
              {
                Verified === 0 ?
                  <div className="alertDeleteUser alertOTP">
                    <div className="cancelIcon">
                    <i className="fa-solid fa-xmark" onClick={() => setConfirmEmail(false)}></i>
                    </div>
                    <div className="contentOtp">
                      <div className="iconEmail">
                        <i className="fa-solid fa-envelope-open-text"></i>
                        <span></span>
                      </div>
                      <div className="content-text">
                      <h3>Please enter the verification code to Confirm your new email</h3>
                        <span>A verification code has been sent to your email. Please check your inbox.</span>
                        <input type="text" placeholder="Enter Code"
                          value={otpcode} onChange={e => setOtpCode(e.target.value)} />
                      </div>
                      <div className="Codefiled">
                        <button type="submit" onClick={handelVerifyCodeOfEmail}>Verify</button>
                      </div>
                    </div>
                  </div>
                  : (Verified === 1 ? (
                    <div className="alertDeleteUser alertOTP">
                      <div className="contentvalidate">
                        <i className="fa-solid fa-circle-xmark"></i>
                        <h2 className="fail">Oops!</h2>
                        <h3>Verification code failed!</h3>
                        <span>The code you entered is invalid. Please try again.</span>
                        <div className="Codefiled">
                          <button type="submit" className="failbutton" onClick={handelFailedEmailVer}>TRY AGAIN</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="alertDeleteUser alertOTP">
                      <div className="contentvalidate">
                        <i className="fa-solid fa-circle-check"></i>
                        <h2>SUCCESS!</h2>
                        <h3>Your email was successfully confirmed!</h3>
                        <span>Your account is now more secure.</span>
                        <div className="Codefiled">
                          <button type="submit" onClick={handelFailedEmailVer}>Done</button>
                        </div>
                      </div>
                    </div>
                  ))
              }
            </div>
          }
          {
            showOtpAlert &&
            <div className="GameModePopUpBlur">
              {
                Verified === 0 ?
                  <div className="alertDeleteUser alertOTP">
                    <div className="cancelIcon">
                      <i className="fa-solid fa-xmark" onClick={disableOtp}></i>
                    </div>
                    <div className="contentOtp">
                      <div className="iconEmail">
                        <i className="fa-solid fa-envelope-open-text"></i>
                        <span></span>
                      </div>
                      <div className="content-text">
                        <h3>Please enter the verification code to activate Two-Factor Authentication</h3>
                        <span>A verification code has been sent to your email. Please check your inbox.</span>
                        <input type="text" placeholder="Enter Code"
                          value={otpcode} onChange={e => setOtpCode(e.target.value)} />
                      </div>
                      <div className="Codefiled">
                        <button type="submit" onClick={handelVerifyCode}>Verify</button>
                      </div>
                    </div>
                  </div>
                  : (Verified === 1 ? (
                    <div className="alertDeleteUser alertOTP">
                      <div className="contentvalidate">
                        <i className="fa-solid fa-circle-xmark"></i>
                        <h2 className="fail">Oops!</h2>
                        <h3>Two-factor authentication failed!</h3>
                        <span>The code you entered is invalid. Please try again.</span>
                        <div className="Codefiled">
                          <button type="submit" className="failbutton" onClick={handelActiveOTP}>TRY AGAIN</button>
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
