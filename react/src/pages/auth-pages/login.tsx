function Login() {
    return (
        <div className="auth-wrapper">
            <div className="bg-img-wrapper">
                {" "}
                <img src="/images/auth-bg.png" alt="logo" />
            </div>
            <div className="form-wrapper">
                <div>
                    <div className="logo">
                        {" "}
                        <img src="/icons/zc-logo.png" alt="logo" />
                    </div>
                    <div className="form-heading">Login to Zapchat</div>
                    <div className="form-underheading">
                        Welcome back! Please enter your details.
                    </div>

                    <div className="input-wrapper">
                        <label>Email</label>
                        <div className="icon-input-wrapper">
                            <img src="/icons/email-icon.png" alt="icon" />
                            <input
                                placeholder="Enter your email"
                                type="email"
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label>Password</label>
                        <div className="icon-input-wrapper">
                            <img src="/icons/password-icon.png" alt="icon" />
                            <input
                                placeholder="Enter your password"
                                type="password"
                            />
                        </div>
                    </div>

                    <div className="form-link-text">Create account?</div>
                    <div>
                        <button className="btn-primary">
                            <span>Login</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
