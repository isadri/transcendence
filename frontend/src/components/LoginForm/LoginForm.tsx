import './LoginForm.css'
import { FcGoogle } from "react-icons/fc";
import { Si42 } from "react-icons/si"
import { Link } from "react-router-dom"

function InputBox({ label, type }) {
    return (
        <div className="input-box">
            <label>{label}</label><br />
            <input type={type} required />
        </div>
    );
}

function APIIcons() {
    return (
        <>
            <div className="intra-icon">
                <Link to="#" className="link"><Si42 size={40} /></Link>
            </div>
            <div className="google-icon">
                <Link to="#" className="link"><FcGoogle size={40} /></Link>
            </div>
        </>
    )
}

const LoginForm = () => {
    return (
        <div className="login-box">
            <form action="">
                <h1>Login</h1>
                <div className="inner-box">
                    <InputBox label="Email or username" type="text" />
                    <InputBox label="Password" type="password" />
                    <button type="submit">Login</button>
                </div>
                <div className="register-link">
                    <p>Don't have an account? <Link to="#" className="link">Sign up</Link></p>
                </div>
                <div className="separator">
                    <p>Or</p>
                </div>
                <div className="apis">
                    <APIIcons />
                </div>
            </form>
        </div>
    )
    //return (
    //    <div className="login-form">
    //        <form action="">
    //            <h1>Login</h1>
    //            <InputBox label="Email or Username" type="text" />
    //            <InputBox label="Password" type="password" />
    //            {/*<div className="login-btn">
    //                <button type="submit">Login</button>
    //            </div>*/}
    //            <div className="input-box">
    //                <input className="login-btn" type="submit" value="Login" />
    //            </div>
    //            <div className="forgot-password">
    //                <Link to="#" className="link">Forgot password?</Link>
    //            </div>
    //            <div className="register-link">
    //                <p>Don't have an account? <Link to="#" className="link">Sign up</Link></p>
    //            </div>
    //            <div className="separator">
    //                <p><span>Or</span></p>
    //            </div>
    //            <APIIcons />
    //        </form>
    //    </div>
    //)
}

export default LoginForm
