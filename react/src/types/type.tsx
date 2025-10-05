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

// User
export type User = {
    username: string;
    email: string;
    image_path: string;
    last_name: string;
    id: number;
    name: string;
};

// Edited User Form
export type EditedUser = {
    name: string;
    last_name: string;
    username: string;
    password: string;
    password_confirmation: string;
};

// logged user
export type LoggedUser = {
    auth_token: string;
    email: string;
    name: string;
    last_name: string;
    image_path: string;
    username: string;
    id: number;
};

export type ForgotPassField = {
    email: string;
};

// Reset user obj
export type ResetUserObj = {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
};

// Message
export type Message = {
    data: {
        created_at: string;
        from_id: number;
        id: number;
        message: string;
        read_at: null;
        to_id: number;
        updated_at: string;
    };
    status: string;
};

// Chat Message
export type ChatMessage = {
    created_at: string;
    from_id: number;
    id: number;
    message: string;
    read_at: null;
    to_id: number;
    updated_at: string;
};

// Live Message
export type LiveMessage = {
    from_id: number;
    message: string;
    to_id: number;
};
