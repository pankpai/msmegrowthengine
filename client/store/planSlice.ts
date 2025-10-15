import api from "@/api/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
interface Services {
  creditsRemaining: number;
  creditsTotal: number;
  expiresAt: Date;
  isExpired: boolean;
  planId: string;
  remainingDays: number;
  serviceKey: string;
  startsAt: Date;
  status: string;
}

interface SubscriptionInfo {
  services: Services[];
  totalCredits: number;
  totalRemaining: number;
}
interface Plan {
  creditsTotal: number;
  durationDays: number;
  feature: string[];
  planName: string;
  priceCents: number;
  serviceKey: string;
  serviceName: string;
}
export interface Credit {
  _id: string;
  totalcredit: string;
}
interface InitialState {
  subscribtionInfo: SubscriptionInfo | null;
  loading: boolean;
  error: string;
  plan: Plan | null;
  credit: Credit[] | null;
}
const initialState: InitialState = {
  subscribtionInfo: null,
  plan: null,
  error: null,
  loading: null,
  credit: null,
};

export const getUserSubscriptionInfo = createAsyncThunk(
  "plan/getSubscriptionInfo",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/plan/get-subscription-detail");
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Sign up failed");
    }
  },
);

export const getPlanByserviceKey = createAsyncThunk(
  "plan/getPlanByserviceKey",
  async (serviceKey: string, { rejectWithValue }) => {
    try {
      const res = await api?.get(`/plan/get-plan/${serviceKey}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Sign up failed");
    }
  },
);
export const getUsesCredit = createAsyncThunk(
  "plan/getUsesCredit",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api?.get(`/plan/get-credit-uses`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Sign up failed");
    }
  },
);

const planSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserSubscriptionInfo.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUserSubscriptionInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribtionInfo = action.payload;
      })
      .addCase(getUserSubscriptionInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Some thing went wrong";
      })
      .addCase(getPlanByserviceKey.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getPlanByserviceKey.fulfilled, (state, action) => {
        state.loading = false;
        state.plan = action.payload;
      })
      .addCase(getPlanByserviceKey.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Some thing went wrong";
      })
      .addCase(getUsesCredit.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUsesCredit.fulfilled, (state, action) => {
        state.loading = false;
        state.credit = action.payload;
      })
      .addCase(getUsesCredit.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Some thing went wrong";
      });
  },
});

export default planSlice.reducer;
