function ForgotPassword() {
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
                    <div className="form-heading">Forgot Password?</div>
                    <div className="form-underheading">
                        No worries, we’ll send you reset instructions.
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

                    <div className="form-link-text">Create account?</div>
                    <div>
                        <button className="btn-primary">
                            <span>Send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
