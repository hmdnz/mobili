// src/actions.js
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const signupSuccess = (user) => ({
  type: "SIGNUP_SUCCESS",
  payload: user,
});

// actions.js
// actions.js
export const loginSuccess = (email, access_token, token_type) => (dispatch) => {
  // Store user data in localStorage
  const userData = JSON.stringify({ email, access_token, token_type });
  localStorage.setItem("user_data", userData);

  // Dispatch the action to update Redux state
  dispatch({
    type: "LOGIN_SUCCESS",
    payload: { email, access_token, token_type },
  });
};

export const signup = (email, name, phone, password) => async (dispatch) => {
  try {
    const response = await axios.post(
      "https://34.239.137.93/api/auth/users/create",
      {
        email,
        name,
        phone,
        password,
      }
    );
    const { email: userEmail, access_token, token_type } = response.data;
    const user = { email: userEmail, access_token, token_type };
    const userData = JSON.stringify({ email, access_token, token_type });
    console.log("zzzzzzzzzzzzz", response.data);
    dispatch(signupSuccess(user));
    localStorage.setItem("access_token", userData);
    dispatch(login(email, password)); // Automatically log in after successful signup
  } catch (error) {
    console.error("Registration failed:", error);
  }
};

export const login = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post(
      "https://34.239.137.93/api/auth/users/login",
      {
        email,
        password,
      }
    );

    const { email: userEmail, access_token, token_type } = response.data;
    const user = { email: userEmail, access_token, token_type };
    const userData = JSON.stringify({ email, access_token, token_type });
    dispatch(loginSuccess(user));
    localStorage.setItem("access_token", userData);
    console.log(user);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.detail) {
      const errorMessage = error.response.data.detail;
      // alert(errorMessage); // Display error message as an alert
      console.log(errorMessage);
    } else {
      console.error("Login failed:", error);
    }
  }
};

// Example implementation of restoreUserFromLocalStorage action
export const restoreUserFromLocalStorage = () => (dispatch) => {
  const access_token = localStorage.getItem("access_token");
  if (access_token) {
    dispatch(loginSuccess({ access_token }));
  }
};