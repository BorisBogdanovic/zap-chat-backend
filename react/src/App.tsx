import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/privateRoute";
import PublicRoute from "./components/publicRoute";
import Layout from "./components/layout";
import "ldrs/ring";
import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";
import { ToastContainer } from "react-toastify";

const Register = lazy(() => import("./pages/auth-pages/register"));
const Login = lazy(() => import("./pages/auth-pages/login"));
const ForgotPassword = lazy(() => import("./pages/auth-pages/forgot-password"));
const ResetPassword = lazy(() => import("./pages/auth-pages/reset-password"));

const Home = lazy(() => import("./pages/home"));
const Settings = lazy(() => import("./pages/settings"));

// Default values shown

function App() {
    return (
        <>
            <BrowserRouter>
                <Suspense
                    fallback={<Helix size="45" speed="2.5" color="black" />}
                >
                    <ToastContainer position="top-right" autoClose={3000} />
                    <Routes>
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/forgot-password"
                            element={
                                <PublicRoute>
                                    <ForgotPassword />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/reset-password"
                            element={
                                <PublicRoute>
                                    <ResetPassword />
                                </PublicRoute>
                            }
                        />

                        <Route element={<Layout />}>
                            {" "}
                            <Route
                                path="/"
                                element={
                                    <PrivateRoute>
                                        <Home />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/settings"
                                element={
                                    <PrivateRoute>
                                        <Settings />
                                    </PrivateRoute>
                                }
                            />
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    );
}

export default App;
