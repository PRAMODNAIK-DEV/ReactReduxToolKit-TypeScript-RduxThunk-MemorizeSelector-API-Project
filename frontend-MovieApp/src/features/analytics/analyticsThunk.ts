import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchDataComplete, fetchDataFailure, fetchDataStart, fetchDataSuccess } from "./analyticsSlice";

// export const fetchAnalyticsData = createAsyncThunk(
//   "analytics/fetchData",
//   async () => {
//     const response = await axios.get("http://localhost:8000/api/analytics");
//     return response.data;
//   }
// );

export const fetchAnalyticsData = createAsyncThunk(
    'analytics/fetchData', 
    async (_, { dispatch }) => {
    try {
      dispatch(fetchDataStart());
      const response = await axios.get('http://localhost:8000/api/analytics');
      dispatch(fetchDataSuccess(response.data));
      dispatch(fetchDataComplete());
    } catch (error: any) {
      dispatch(fetchDataFailure(error.message));
    }
    // finally{
    //   dispatch(fetchDataComplete());

    // }
  });
