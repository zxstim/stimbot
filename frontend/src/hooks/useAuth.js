import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import axios from "../api/axios";
import Cookies from 'js-cookie'

const LOGIN_URL = '/auth/login/'
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();
  const csrftoken = Cookies.get('csrftoken');

  // call this function when you want to authenticate the user
  const login = async (data) => {
    try {
      const response = await axios.post(LOGIN_URL, data, {
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          'X-CSRFToken': csrftoken
        },
        withCredentials: true
      });
      const accessToken = response?.data?.access_token
      const refreshToken = response?.data?.refresh_token
      const user = response?.data?.user
      setUser({ accessToken, refreshToken, user })
      navigate("/dashboard/bots");
    } catch (err) {
      if (!!err?.response.data.non_field_errors) {
        alert(err.response.data.non_field_errors)
      } else {
        alert(err.response.data.email)
      }
    };
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    // eslint-disable-next-line
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};