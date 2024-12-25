import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../CSS/Login.css';  // Ensure you have the correct path to the CSS file

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    let submittingData = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', data);

            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                console.log("Token saved to localStorage:", token);
                alert("Login Successful");
                navigate('/tasklist');
            }

        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || (error.response.data.errors && error.response.data.errors[0]?.msg || "Failed to login.");
                alert(errorMessage);
            } else if (error.request) {
                alert("Failed to connect to the server");
            } else {
                alert("An unexpected error occurred");
            }
        }
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit(submittingData)} className="login-form">
                <h1>Login</h1>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email", { required: "Email is required" })}
                        className="input-field"
                    />
                    {errors.email && <p className="error-message">{errors.email.message}</p>}
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password", { required: "Password is required" })}
                        className="input-field"
                    />
                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                </div>
                <button type="submit" className="submit-button">Login</button>
                <p className="signup-link">
                    Don't have an account? <a href="/signup">Sign up here</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
