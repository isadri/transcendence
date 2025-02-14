import "./Authenthication.css";
import intra from "./Images/intra.svg";
import Google from "./Images/Google.svg";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import axios from "axios";
import { getContext, getendpoint } from "../../context/getContextData";
interface errorDataTypes {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Authentication() {
  const [url, setUrl] = useState("");
  const [urlGoogle, setUrlGoogle] = useState("");
  useEffect(() => {
    axios
      .get(getendpoint("http", "/api/accounts/GetIntraLink/"))
      .then((response) => {
        setUrl(response.data);
      });
    axios
      .get(getendpoint("http", "/api/accounts/GetGoogleLink/"))
      .then((response) => {
        setUrlGoogle(response.data);
      });
  }, [url, urlGoogle, setUrlGoogle, setUrl]);

  const authContext = getContext();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [usernameReset, setUsernameReset] = useState("");
  const [emailReset, setEmailReset] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [val, setVal] = useState(true);
  const [showOtpAlert, SetshowOtpAlert] = useState(false);
  const [Error, setError] = useState(false);
  const [errorList, setErrorList] = useState<string[][]>([]);
  const [otpcode, setOtpCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [forgetPass, setForgetPass] = useState(false);
  const [errors, SetErrors] = useState<errorDataTypes>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const data_login = {
    username,
    password,
  };

  const data_resetPass = {
    username : usernameReset,
    email : emailReset
  };

  const data_reg = {
    username,
    password,
    email,
  };

  const handleKeyDownLogin = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handelLoginSubmit(event);
    }
  };

  const handleKeyDownRegister = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handelRegistringSubmit(event);
    }
  };

  const GetUserInfo = () => {
    axios
      .get(getendpoint("http", "/api"), { withCredentials: true })
      .then((response: any) => {
        authContext?.setIsLogged(true);
        authContext?.setUser(response.data);
      })
      .catch(() => {
        authContext?.setIsLogged(false);
        authContext?.setUser(null);
      });
  };

  const handelResetPass = () => {
    if (usernameReset !== '' && emailReset !== '')
    {
      axios
      .post(getendpoint("http", "/api/accounts/password-reset-email/"),
      data_resetPass,
      {withCredentials: true})
      .then(response =>{
        setForgetPass(false)
        authContext?.setCreatedAlert(response.data.message);
        authContext?.setDisplayed(4);
        setUsernameReset('')
        setEmailReset('')
      })
      .catch(error => {
        setForgetPass(false)
        authContext?.setCreatedAlert(error.response.data.error);
        authContext?.setDisplayed(3);
        setUsernameReset('')
        setEmailReset('')
      })
    }
  }

  const handelVerifyCode = () => {
    axios
      .post(
        getendpoint("http", "/api/accounts/verify-otp/"),
        {
          username,
          password,
          code: userCode,
          key: otpcode,
        },
        { withCredentials: true }
      )
      .then(() => {
        authContext?.setIsLogged(true);
        navigate("/");
        GetUserInfo();
        SetshowOtpAlert(false);
      })
      .catch((error) => {
        SetshowOtpAlert(false);
        authContext?.setDisplayed(3);
        authContext?.setCreatedAlert(error.response.data.error);
      });
      setOtpCode('')
  };

  const handelRegistringSubmit = async (e: any) => {
    if (
      (username !== "" && password !== "") ||
      confirmPassword !== "" ||
      email !== ""
    ) {
      e.preventDefault();
      if (
        confirmPassword === password &&
        errors.username === "" &&
        errors.email === "" &&
        errors.password === ""
      ) {
        axios
          .post(getendpoint("http", "/api/accounts/register/"), data_reg, {
            withCredentials: true,
          })
          .then(() => {
            setVal(true);
            authContext?.setCreatedAlert(
              "Please confirm your email. Check your inbox"
            );
            authContext?.setDisplayed(4);
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
          })
          .catch((error: any) => {
            setError(true);
            if (error.response && error.response.data) {
              const list = [];
              const errors = error.response.data;
              for (const field in errors) {
                if (errors[field].length > 0) {
                  list.push([field, errors[field][0]]);
                }
              }
              setErrorList(list);
            }
          });
      }
    }
  };
  const handelLoginSubmit = async (e: any) => {
    e.preventDefault();
    var url_login = getendpoint("http", "/api/accounts/login/");
    try {
      if (!data_login.password || !data_login.username) {
        authContext?.setDisplayed(3);
        authContext?.setCreatedAlert("Please fill in all required fields");
      } else {
        const otpResponse = await axios.get(
          getendpoint(
            "http",
            `/api/accounts/SendOTPView/${data_login.username}`
          ),
          { withCredentials: true }
        );
        if (otpResponse.data === true) {
          url_login = getendpoint("http", "/api/accounts/login2fa/");
        }
        axios
          .post(url_login, data_login, { withCredentials: true })
          .then((response) => {
            if (otpResponse.data) {
              setUserCode(response.data.code);
              SetshowOtpAlert(true);
            } else {
              authContext?.setIsLogged(true);
              navigate("/");
              GetUserInfo();
            }
            setUsername("");
            setPassword("");
          })
          .catch((error: any) => {
            setError(true);
            if (error.response && error.response.data) {
              const list = [];
              const errors = error.response.data;
              for (const field in errors) {
                if (errors[field].length > 0) {
                  list.push([field, errors[field]]);
                }
              }
              setErrorList(list);
            } else if (error.request) {
              // authContext?.setDisplayed(3)
              // authContext?.setCreatedAlert(error.request);
            }
          });
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.data.detail) {
          authContext?.setDisplayed(3);
          authContext?.setCreatedAlert(error.response.data.detail);
        }
      }
    }
  };

  const checkError = (str: string) => {
    for (let i = 0; i < errorList.length; i++) {
      if (errorList[i][0] === str) return errorList[i];
    }
    return "empty";
  };

  const handelRegisterErorrs = (e: any, str: string) => {
    if (str === "username") {
      if (e.target.value.length < 3 || e.target.value.length > 15) {
        SetErrors((prevState) => ({
          ...prevState,
          username: "Username must be between 3 and 15 characters long.",
        }));
      } else if (!/[a-zA-Z]/.test(e.target.value)) {
        SetErrors((prevState) => ({
          ...prevState,
          username: "Username must contain at least one letter .",
        }));
      } else if (/[^a-zA-Z0-9._-]/.test(e.target.value)) {
        SetErrors((prevState) => ({
          ...prevState,
          username:
            "Username contains invalid characters. Only '.', '_', and '-' are allowed.",
        }));
      } else if (!/^[a-z_]/.test(e.target.value)) {
        SetErrors((prevState) => ({
          ...prevState,
          username:
            "The username must begin with a lowercase character or an underscore (_).",
        }));
      } else
        SetErrors((prevstate) => ({
          ...prevstate,
          username: "",
        }));
      setUsername(e.target.value.toLowerCase());
    } else if (str === "password") {
      if (e.target.value.length < 8)
        SetErrors((prevState) => ({
          ...prevState,
          password: "Password must be at least 8 characters long.",
        }));
      else if (!/[A-Z]/.test(e.target.value))
        SetErrors((prevState) => ({
          ...prevState,
          password: "Password must contain at least one uppercase latter.",
        }));
      else if (!/[a-z]/.test(e.target.value))
        SetErrors((prevState) => ({
          ...prevState,
          password: "Password must contain at least one lowercase letter.",
        }));
      else if (!/[0-9]/.test(e.target.value))
        SetErrors((prevState) => ({
          ...prevState,
          password: "Password must contain at least one digit",
        }));
      else if (!/[!@#$%^&*(),.?":{}|<>]/.test(e.target.value))
        SetErrors((prevState) => ({
          ...prevState,
          password: "Password must contain at least one special charachter.",
        }));
      else
        SetErrors((prevState) => ({
          ...prevState,
          password: "",
        }));
      setPassword(e.target.value);
    } else if (str === "email") {
      if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value)
      )
        SetErrors((prevState) => ({
          ...prevState,
          email: "Please enter a valid email.",
        }));
      else
        SetErrors((prevState) => ({
          ...prevState,
          email: "",
        }));
      setEmail(e.target.value);
    } else if (str === "confirmPassword") {
      setConfirmPassword(e.target.value);
      if (e.target.value !== password) {
        SetErrors((prevState) => ({
          ...prevState,
          confirmPassword: "Password do not match!!",
        }));
      } else {
        SetErrors((prevState) => ({
          ...prevState,
          confirmPassword: "",
        }));
      }
    }
  };
  const win_width = useMediaQuery("only screen and (max-width : 720px)");
  const SingUpStyle = !val
    ? win_width
      ? {
          transform: "translateX(100%)",
          opacity: 1,
        }
      : {
          transform: "translateX(100%)",
          opacity: 1,
          zIndex: 5,
        }
    : { transform: "translateX(-100%)" };
  return (
    <>
      <div className="SingInParent curve">
        <div
          className="SingIn"
          style={{
            ...(!val ? { transform: "translateX(200%)", opacity: 0 } : {}),
            ...(!val && win_width ? { opacity: 0 } : { opacity: 1 }),
          }}
        >
          <div className="iconBack">
            <Link to="/">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
          </div>
          <h1>Sign In</h1>
          <div className="form">
            {Error &&
              checkError("error") &&
              checkError("error")[0] === "error" && (
                <p className="errorSet">{checkError("error")[1]}</p>
              )}
            <input
              type="text"
              name="username"
              id="UserNameLogin"
              placeholder="UserName"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
            />
            <input
              type="password"
              name="password"
              id="PassLogin"
              placeholder="Password"
              onKeyDown={(e) => handleKeyDownLogin(e)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onCopy={(e) => e.preventDefault()}
              required
            />
            <Link
              to=""
              onClick={() => {
                setForgetPass(true);
              }}
            >
              Forget your password?
            </Link>
            <button
              type="submit"
              id="submitBtn"
              onKeyDown={(e) => handleKeyDownLogin(e)}
              aria-label="Sign in"
              onClick={(e) => handelLoginSubmit(e)}
            >
              Sign in
            </button>
            <span className="RespSign">
              Don't have an account?{" "}
              <Link
                to=""
                onClick={() => {
                  setVal(false);
                }}
              >
                Sign Up
              </Link>
            </span>
          </div>
          <div className="lines">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>
          <div className="DirectConx">
            <div className="GoogleConx">
              <Link to={urlGoogle}>
                <img src={Google} alt="google" />
              </Link>
            </div>
            <div className="IntraConx">
              <div>
                <Link to={url}>
                  <img src={intra} alt="intra" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div
          className="SingUp "
          style={{
            ...SingUpStyle,
            ...(!val && win_width
              ? { opacity: 1, transform: "translateX(0%)" }
              : {}),
          }}
        >
          <div
            className="iconBack"
            style={win_width ? { opacity: 1 } : { opacity: 0 }}
          >
            <Link to="/">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
          </div>
          <h1>Sign Up</h1>
          <div className="form">
            <input
              type="text"
              name="username"
              id="UserNameRegister"
              placeholder="UserName"
              value={username}
              onChange={(e) => handelRegisterErorrs(e, "username")}
              required
            />
            {Error &&
              checkError("username") &&
              checkError("username")[0] === "username" && (
                <p className="errorSet">{checkError("username")[1]}</p>
              )}
            {errors.username !== "" && (
              <p className="errorSet">{errors.username}</p>
            )}
            <input
              type="email"
              name="Email"
              id="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => handelRegisterErorrs(e, "email")}
              required
            />
            {Error &&
              checkError("email") &&
              checkError("email")[0] === "email" && (
                <p className="errorSet">{checkError("email")[1]}</p>
              )}
            {errors.email !== "" && <p className="errorSet">{errors.email}</p>}
            <input
              type="password"
              name="password"
              id="PassRegister"
              placeholder="Password"
              value={password}
              onChange={(e) => handelRegisterErorrs(e, "password")}
              required
            />
            {Error &&
              checkError("password") &&
              checkError("password")[0] === "password" && (
                <p className="errorSet">{checkError("password")[1]}</p>
              )}
            {errors.password !== "" && (
              <p className="errorSet">{errors.password}</p>
            )}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onKeyDown={(e) => handleKeyDownRegister(e)}
              onChange={(e) => handelRegisterErorrs(e, "confirmPassword")}
              onCopy={(e) => e.preventDefault()}
              required
            />
            {errors.confirmPassword !== "" && (
              <p className="errorSet">{errors.confirmPassword}</p>
            )}
            <button
              type="submit"
              onClick={(e) => handelRegistringSubmit(e)}
              onKeyDown={(e) => handleKeyDownRegister(e)}
            >
              Sign Up
            </button>
            <span className="RespSign">
              Already have an account?{" "}
              <Link
                to=""
                onClick={() => {
                  setVal(true);
                }}
              >
                Sign In
              </Link>
            </span>
          </div>
          <div className="lines">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>
          <div className="DirectConx">
            <div className="GoogleConx">
              <Link to={urlGoogle}>
                <img src={Google} alt="google" />
              </Link>
            </div>
            <div className="IntraConx">
              <div>
                <Link to={url}>
                  <img src={intra} alt="intra" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div
          className="SecondContainer"
          style={!val ? { transform: "translateX(-100%)" } : {}}
        >
          <div
            className="content"
            style={!val ? { transform: "translateX(50%)" } : {}}
          >
            <div
              className="RightContent"
              style={!val ? { transform: "translateX(20%)" } : {}}
            >
              <h1>Hello, Friend!</h1>
              <span>
                Share your details and begin your journey with us today.
              </span>
              <div className="buttons">
                <Link to="/Auth">
                  <button
                    type="submit"
                    id="registerBtn"
                    className="btn"
                    onClick={() => {
                      setVal(false);
                    }}
                  >
                    Sing Up
                  </button>
                </Link>
              </div>
            </div>
            <div
              className="LeftContent"
              style={!val ? { transform: "translateX(0)" } : {}}
            >
              <div className="iconBack">
                <Link to="/">
                  <i className="fa-solid fa-arrow-left"></i>
                </Link>
              </div>
              <h1>Welcome Back!</h1>
              <span>
                To stay connected with us, please log in using your personal
                information, Google account, or your Intra account.
              </span>
              <div className="buttons">
                <Link to="/Auth">
                  <button
                    type="submit"
                    id="registerBtn"
                    className="btn"
                    onClick={() => {
                      setVal(true);
                    }}
                  >
                    Sing In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showOtpAlert && (
        <div className="GameModePopUpBlur">
          <div className="alertDeleteUser alertOTP">
            <div className="cancelIcon">
              <i
                className="fa-solid fa-xmark"
                onClick={() => SetshowOtpAlert(false)}
              ></i>
            </div>
            <div className="contentOtp">
              <div className="iconEmail">
                <i className="fa-solid fa-envelope-open-text"></i>
                <span></span>
              </div>
              <div className="content-text">
                <h3>
                  Please enter the verification code to activate Two-Factor
                  Authentication
                </h3>
                <span>
                  A verification code has been sent to your email. Please check
                  your inbox.
                </span>
                <input
                  className="inputt"
                  type="text"
                  placeholder="Enter Code"
                  value={otpcode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
              </div>
              <div className="Codefiled">
                <button type="submit" onClick={handelVerifyCode}>
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {forgetPass && (
        <div className="GameModePopUpBlur">
          <div className="forgetPass">
            <div className="cancelIcon">
              <i
                className="fa-solid fa-xmark"
                onClick={() => setForgetPass(false)}
              ></i>
            </div>
            <div className="content-parent">
                <div className="iconEmail">
                  <i className="fa-solid fa-envelope-open-text"></i>
                  <span></span>
                </div>
              <div className="content">
                <div className="content-text">
                  <h3>Please Enter Your Information</h3>
                  <p>
                    Provide your username and email to receive a password reset
                    link.
                  </p>
                  <div className="inputs-filed">
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={usernameReset}
                      onChange={(e) => setUsernameReset(e.target.value.toLowerCase())}
                    />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={emailReset}
                      onChange={(e) => setEmailReset(e.target.value)}
                    />
                  </div>
                </div>
                <div className="actionField">
                  <button
                    type="button"
                    className="infoButton"
                    onClick={handelResetPass}
                  >
                     Send Reset Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Authentication;
