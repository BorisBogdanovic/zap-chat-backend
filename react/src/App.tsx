import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Register = lazy(() => import("./pages/auth-pages/register"));
const Login = lazy(() => import("./pages/auth-pages/login"));
const ForgotPassword = lazy(() => import("./pages/auth-pages/forgot-password"));
const ResetPassword = lazy(() => import("./pages/auth-pages/reset-password"));

const Home = lazy(() => import("./pages/home"));

function App() {
    return (
        <>
            <BrowserRouter>
                <Suspense fallback={<h2>Loading...</h2>}>
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                        <Route
                            path="/reset-password"
                            element={<ResetPassword />}
                        />

                        <Route path="/" element={<Home />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    );
}

export default App;
