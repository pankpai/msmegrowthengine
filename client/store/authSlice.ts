import api from "@/api/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Credit {
  remainingCredit: number;
  totalcredit: number;
}

interface AuthState {
  user: { id: string; name: string; email: string; credit: Credit,trialEndAt:Date,plan:string } | null;
  loading: boolean;
  error: string | null;
  accessToken: string;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  accessToken: "",
};

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/sign-in", credentials);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Sign in failed");
    }
  },
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    data: { name: string; email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/sign-up", data);
      console.log(response);
      return response.data;
    } catch (err: any) {
      console.log(err);
      return rejectWithValue(err.response?.data?.message || "Sign up failed");
    }
  },
);
export const userInfo = createAsyncThunk(
  "auth/userInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user-info");
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "User information fetching is failed",
      );
    }
  },
);

export const refreshToken = createAsyncThunk(
  "auth/refresh-token",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/refresh-token", {});
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Token refresh failed",
      );
    }
  },
);
export const signOut = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/logout", {});
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Token refresh failed",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<AuthState>) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signUp.fulfilled,
        (state, action: PayloadAction<AuthState["user"]>) => {
          state.loading = false;
          state.user = action.payload;
        },
      )
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        refreshToken.fulfilled,
        (state, action: PayloadAction<{ accessToken: string }>) => {
          state.loading = false;
          state.accessToken = action.payload.accessToken;
        },
      )
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(userInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(userInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signOut.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signOut.fulfilled,
        (state, action: PayloadAction<{ accessToken: string }>) => {
          state.loading = true;
          state.accessToken = "";
        },
      )
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
