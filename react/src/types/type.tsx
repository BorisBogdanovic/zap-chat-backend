// register form
export type RegisterFormUser = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

// User
export type User = {
    username: string;
    email: string;
    password: string;
};

// logged user
export type LoggedUser = {
    auth_token: string;
    email: string;
    name: string;
    profile_image: string;
    username: string;
};
