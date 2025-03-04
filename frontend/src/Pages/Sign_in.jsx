import  { useState } from "react";
import  "../dist/sign_in.css";

function SignIn () {
    const [data,setData] = useState({
        email:"",
        password:""
    });
    const [err,setErr] = useState({
        email:"",
        password:""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!data.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = "Email address is invalid";
        }
        if (!data.password) {
            newErrors.password = "Password is required";
        }

        setErr(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("Form data: ", data);
            setData({
                email:"",
                password:""
            })
        }
    };

    return (
        <div className="signin-container">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit} className="signin-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        className={err.email ? "error-input" : ""}
                    />
                    {err.email && <span className="error-message">{err.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        className={err.password ? "error-input" : ""}
                    />
                    {err.password && <span className="error-message">{err.password}</span>}
                </div>

                <div className="form-group">
                    <button type="submit" className="signin-button">Sign In</button>
                </div>
            </form>
            <div className="signin-link">
                Don't have an account? <a href="/register">Register here</a>
            </div>
        </div>
    );
}

export default SignIn;
