import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../CSS/Signup.css';  // Ensure you have the correct path to the CSS file

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const submittingData = async (data) => {
        console.log(data);
        try {
          const response = await axios.post('http://localhost:5000/api/users/register', data);
    
          if (response.status === 200) {
            alert('Signup successful! Please login.');
            navigate('/');
          }
        } catch (error) {
          if (error.response) {
            console.error("Error Response", error.response.data);
            alert(error.response.data.message || 'Failed to register employee.');
          } else if (error.request) {
            console.error("No Response:", error.request);
            alert('Failed to connect to the server');
          } else {
            console.error("Error:", error.message);
            alert('An unexpected error occurred');
          }
        }
      }

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit(submittingData)} className="signup-form">
                <h1>Signup</h1>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Username"
                        {...register("username", { required: "Username is required" })}
                        className="input-field"
                    />
                    {errors.username && <p className="error-message">{errors.username.message}</p>}
                </div>
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
                <button type="submit" className="submit-button">Signup</button>
                <p className="login-link">
                    Already have an account? <a href="/">Login here</a>
                </p>
            </form>
        </div>
    );
};

export default Signup;
