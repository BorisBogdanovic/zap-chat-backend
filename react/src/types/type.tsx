// register form
export type RegisterFormUser = {
    name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
};

// Login form user
export type LoginFormUser = {
    email: string;
    password: string;
};

// User?
export type User = {
    username: string;
    email: string;
    password: string;
};

// logged user?
export type LoggedUser = {
    auth_token: string;
    email: string;
    name: string;
    image_path: string;
    username: string;
    id: number;
};

export type ForgotPassField = {
    email: string;
};

// Reset user obj?
export type ResetUserObj = {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
};
