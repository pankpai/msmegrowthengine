// 📁 src/hooks/use-auth.ts
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { refreshToken, setAccessToken, signOut, userInfo } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, user } = useSelector(
    (state: RootState) => state.auth as RootState["auth"],
  );
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        await dispatch(refreshToken()).unwrap();
      } finally {
        setAuthLoading(false);
      }
    };
    fetchAccessToken();
  }, [dispatch]);

  useEffect(() => {
    if (!accessToken) return;

    const fetchUserInfo = async () => {
      try {
        const res = await dispatch(userInfo()).unwrap();
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [accessToken, dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(signOut());
      localStorage.clear();
      dispatch(setAccessToken(null))
       navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log("ERROR:logout falid", error);
    }
  };

  return {
    accessToken,
    authLoading,
    user,
    handleLogout,
  };
};
