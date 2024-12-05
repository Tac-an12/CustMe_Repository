import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Google, Facebook } from "@mui/icons-material";
import { TextField, Button, CircularProgress, Typography, Box } from "@mui/material";
import apiServices from "../../services/apiService";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [skills, setSkills] = useState<number[]>([]);
  const [printingSkills, setPrintingSkills] = useState<number[]>([]);
  const [bio, setBio] = useState("");
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [certificationsFiles, setCertificationsFiles] = useState<File[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as any;

    if (state?.roleId) {
      setSelectedRole(state.roleId.toString());
    } else {
      setSelectedRole("2");
    }

    if (state?.bio) setBio(state.bio);

    if (Array.isArray(state?.portfolioFile)) {
      setPortfolioFiles(state.portfolioFile);
    } else if (state?.portfolioFile) {
      setPortfolioFiles([state.portfolioFile]);
    }

    if (Array.isArray(state?.certificationFile)) {
      setCertificationsFiles(state.certificationFile);
    } else if (state?.certificationFile) {
      setCertificationsFiles([state.certificationFile]);
    }

    if (selectedRole === "3" && state?.skills) {
      setSkills(state.skills);
    } else if (selectedRole === "4" && state?.printingServices) {
      setPrintingSkills(state.printingServices);
    }
  }, [location, selectedRole]);

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(regex.test(email) ? "" : "Invalid email address");
  };

  const validatePassword = () => {
    setPasswordError(password.length >= 6 ? "" : "Password must be at least 6 characters");
  };

  const validateConfirmPassword = () => {
    setConfirmPasswordError(password === confirmPassword ? "" : "Passwords do not match");
  };

  const validateUsername = () => {
    setUsernameError(username.trim() ? "" : "Username is required");
  };

  const validatePhoneNumber = () => {
    const isNumeric = /^\d+$/.test(phoneNumber);
    const isValidLength = phoneNumber.length === 11; // Must be exactly 11 characters
    setPhoneNumberError(isNumeric && isValidLength ? "" : "Phone number must be 11 numeric digits");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    validateEmail();
    validatePassword();
    validateConfirmPassword();
    validateUsername();
    validatePhoneNumber();
  
    if (!emailError && !passwordError && !confirmPasswordError && !usernameError && !phoneNumberError) {
      const formData = new FormData();
      formData.append("role_id", selectedRole);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("zipcode", phoneNumber); // Map phoneNumber to zipcode for the database field
      formData.append("bio", bio);
  
      skills.forEach(skill => {
        formData.append("skills[]", skill.toString());
      });
  
      printingSkills.forEach(skill => {
        formData.append("printing_skills[]", skill.toString());
      });
  
      portfolioFiles.forEach((file, index) => {
        formData.append(`portfolio[${index}]`, file);
      });
  
      certificationsFiles.forEach((file, index) => {
        formData.append(`certificate[${index}]`, file);
      });
  
      try {
        const response = await apiServices.post("/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setRegistrationSuccess(true);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFirstname("");
        setLastname("");
        setPhoneNumber("");
        setBio("");
        setSkills([]);
        setPrintingSkills([]);
        setPortfolioFiles([]);
        setCertificationsFiles([]);
      } catch (error) {
        console.error("Registration error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
  
  const handleModalClose = () => {
    setRegistrationSuccess(false);
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="text-black font-extrabold text-4xl text-center">
            <span className="text-blue-500">C</span>
            <span className="text-blue-500">u</span>
            <span className="text-blue-500">s</span>
            <span className="text-yellow-500">t</span>
            <span className="text-blue-500">M</span>
            <span className="text-yellow-500">e</span>
          </div>
          <Typography variant="h6" className="text-center text-gray-700 mb-6">
            Register Your Account
          </Typography>

          {/* <Box display="flex" justifyContent="space-between" mb={2}>
            <Button variant="contained" startIcon={<Google />} className="bg-red-600 text-white w-[48%]">Google</Button>
            <Button variant="contained" startIcon={<Facebook />} className="bg-blue-700 text-white w-[48%]">Facebook</Button>
          </Box>

          <Typography className="text-center text-gray-500 mb-4">OR</Typography> */}

          <form onSubmit={handleSubmit}>
            <Box mb={3} display="flex" gap={2}>
              <TextField label="First Name" variant="outlined" fullWidth value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
              <TextField label="Last Name" variant="outlined" fullWidth value={lastname} onChange={(e) => setLastname(e.target.value)} required />
            </Box>

            <Box mb={2}>
              <TextField label="Username" variant="outlined" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} onBlur={validateUsername} error={Boolean(usernameError)} helperText={usernameError} required />
            </Box>

            <Box mb={2}>
              <TextField label="Email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} onBlur={validateEmail} error={Boolean(emailError)} helperText={emailError} required />
            </Box>

            <Box mb={2}>
              <TextField label="Password" type="password" variant="outlined" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} onBlur={validatePassword} error={Boolean(passwordError)} helperText={passwordError} required />
            </Box>

            <Box mb={2}>
              <TextField label="Confirm Password" type="password" variant="outlined" fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={validateConfirmPassword} error={Boolean(confirmPasswordError)} helperText={confirmPasswordError} required />
            </Box>

            <Box mb={2}>
              <TextField label="Phone Number" type="number" variant="outlined" fullWidth value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} onBlur={validatePhoneNumber} error={Boolean(phoneNumberError)} helperText={phoneNumberError} required />
            </Box>

            <Button type="submit" variant="contained" fullWidth className="bg-primary text-white py-2" disabled={loading}>
              {loading ? <CircularProgress size={24} className="text-white" /> : "Register"}
            </Button>
          </form>

          {registrationSuccess && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Registration Successful</h3>
                <p className="py-4">Successfully registered!</p>
                <div className="modal-action">
                  <button className="btn" onClick={handleModalClose}>Close</button>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <Typography variant="body2">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold">Log In</Link>
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
