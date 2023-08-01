import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/Loginpage.css";

const Login = () => {
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();
    //form submit
    const submitHandler = async (values) => {
        try {
            setloading(true);
            const { data } = await axios.post("/api/v1/users/login", values);
            setloading(false);
            message.success("Login Success");
            localStorage.setItem(
                "user",
                JSON.stringify({ ...data.user, password: "" })
            );
            navigate("/");
        } catch (error) {
            setloading(false);
            message.error("Something Went Wrong");
        }
    };

    useEffect(() => {
        if (localStorage.getItem("user")) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <>
            <div className="register-page ">
                {loading && <Spinner />}
                    <Form className="register-form" autoComplete="off" layout="vertical" onFinish={submitHandler}>
                            <h2>Login Form</h2>

                            <Form.Item label="Email" name="email">
                                <Input type="email" required />
                            </Form.Item>
                            <Form.Item label="Password" name="password">
                                <Input type="password" required />
                            </Form.Item>
                            <div className="d-flex justify-content-between">
                                <Link to="/register">
                                    Not a user ? Click Here to regsiter !
                                </Link>
                                <button className="btn">Login</button>
                            </div>
                    </Form>
            </div>
        </>
    );
};

export default Login;
