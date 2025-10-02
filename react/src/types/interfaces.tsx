/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReactNode } from "react";

// Tipiziranje za children (PrivateRoute)
export interface PrivateRouteProps {
    children: ReactNode;
    requiredRole?: "admin" | "user"; // ili samo 'admin' ako ti ne treba za 'user'
}

export interface PublicRouteProps {
    children: ReactNode;
}
