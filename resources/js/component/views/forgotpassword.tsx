import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";  // Import apiService
import { TextField, Button, CircularProgress, Container, Typography } from "@mui/material";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);  // To show the loading state
    const navigate = useNavigate();  // Replace useHistory with useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiService.post("/forgot-password", { email });
            if (response.data.message) {
                setMessage(response.data.message);
                setTimeout(() => {
                    navigate("/login");  // Redirect after successful reset link sent
                }, 2000);
            }
        } catch (err) {
            setError("Unable to send reset link. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" className="mt-12 p-6 bg-white shadow-lg rounded-lg">
            <Typography variant="h4" className="text-center mb-6">Forgot Password</Typography>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <TextField
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="text-lg"
                    />
                </div>
                <div className="flex justify-center mt-6">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        className="text-lg py-2"
                    >
                        {loading ? <CircularProgress size={24} color="secondary" /> : "Send Password Reset Link"}
                    </Button>
                </div>
            </form>

            {message && <div className="text-green-500 mt-4 text-center">{message}</div>}
            {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
        </Container>
    );
};

export default ForgotPassword;
