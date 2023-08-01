import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/RegisterPage.css";


const Register = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    //form submit
    const submitHandler = async (values) => {
        try {
            setLoading(true);
            console.log(values);

            await axios.post("/api/v1/users/register", values);

            message.success("Registration Successfull");
            setLoading(false);
            navigate("/login");
        } catch (error) {
            setLoading(false);
            console.log(error);
            message.error("Something Went Wrong");
        }
    };

    //prevent for login user

    useEffect(() => {
        if (localStorage.getItem("user")) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <>
            <div className="register-page">
                {loading && <Spinner />}
                <Form className="register-form" autoComplete="off" layout="vertical" onFinish={submitHandler}>
                    <h2>Register Form</h2>
                    <Form.Item label="Name" name="name">
                        <Input type="text" required/>
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input type="email" required/>
                    </Form.Item>
                    <Form.Item label="Password" name="password">
                        <Input type="password" required/>
                    </Form.Item>
                    <div className="d-flex justify-content-between">
                        <Link to="/login">
                            Already Register ? Click Here To Login
                        </Link>
                        <button className="btn">Register</button>
                    </div>
                </Form>
            </div>
        </>
    );
};

export default Register;
