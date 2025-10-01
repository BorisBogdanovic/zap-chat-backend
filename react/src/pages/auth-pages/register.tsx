function Register() {
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
                    <div className="form-heading">Welcome to Zapchat</div>
                    <div className="form-underheading">
                        Welcome! Please enter your details.
                    </div>
                    <div className="input-wrapper">
                        <label>Name</label>

                        <div className="icon-input-wrapper">
                            <img src="/icons/user-icon.png" alt="icon" />
                            <input placeholder="Enter your name" type="text" />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label>Lastname</label>
                        <div className="icon-input-wrapper">
                            {" "}
                            <img src="/icons/user-icon.png" alt="icon" />
                            <input
                                placeholder="Enter your lastname"
                                type="text"
                            />
                        </div>
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
                    <div className="input-wrapper">
                        <label>Confirm password</label>
                        <div className="icon-input-wrapper">
                            <img src="/icons/password-icon.png" alt="icon" />
                            <input
                                placeholder="Confirm your password"
                                type="password"
                            />
                        </div>
                    </div>
                    <div className="form-link-text">
                        Already have an account?
                    </div>
                    <div>
                        <button className="btn-primary">
                            <span>Sign in</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
