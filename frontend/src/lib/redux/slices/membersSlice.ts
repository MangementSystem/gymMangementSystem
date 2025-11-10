import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api/client";

export const fetchMembers = createAsyncThunk("members/fetchAll", async () => {
  const res = await api.get("/members");
  return res.data;
});

export const addMember = createAsyncThunk("members/add", async (data: any) => {
  const res = await api.post("/members", data);
  return res.data;
});

const membersSlice = createSlice({
  name: "members",
  initialState: {
    list: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMembers.pending, state => {
        state.loading = true;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch members";
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default membersSlice.reducer;
