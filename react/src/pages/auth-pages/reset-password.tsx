function ResetPassword() {
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
                    <div className="form-heading">Reset Password</div>
                    <div className="form-underheading">Create Password</div>

                    <div className="input-wrapper">
                        <label>New Password</label>
                        <div className="icon-input-wrapper">
                            <img src="/icons/password-icon.png" alt="icon" />
                            <input
                                placeholder="Enter your password"
                                type="password"
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label>Confirm New Password</label>
                        <div className="icon-input-wrapper">
                            <img src="/icons/password-icon.png" alt="icon" />
                            <input
                                placeholder="Confirm your password"
                                type="password"
                            />
                        </div>
                    </div>

                    <div>
                        <button className="btn-primary mt-16">
                            <span>Send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
