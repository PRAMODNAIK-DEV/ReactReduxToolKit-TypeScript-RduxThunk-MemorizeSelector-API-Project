import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAnalyticsData } from "./analyticsThunk";

interface FilterState {
  category: string;
  startDate: string;
  endDate: string;
  minValue: number;
  maxValue: number;
}

interface AnalyticsState {
  data: any[];
  filteredData: any[];
  loading: boolean;
  error: string | null;
  filter: FilterState; // New filter state with multiple conditions
}

const initialState: AnalyticsState = {
  data: [],
  filteredData: [],
  loading: false,
  error: null,
  filter: {
    category: "Top 3",
    startDate: "",
    endDate: "",
    minValue: 0,
    maxValue: Number.MAX_SAFE_INTEGER,
  },
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    fetchDataSuccess(state, action: PayloadAction<any[]>) {
      state.data = action.payload;
      state.filteredData = action.payload; // Initially set filteredData to full data
    },
    fetchDataFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    fetchDataStart(state) {
      state.loading = true;
    },
    fetchDataComplete(state) {
      state.loading = false;
    },
    setFilter(state, action: PayloadAction<FilterState>) {
      const { category } = action.payload;

      let frameSize = 3;

      // Determine the frame size based on the category filter
      if (category === "3") {
        frameSize = 3;
      } else if (category === "4") {
        frameSize = 4;
      } else if (category === "5") {
        frameSize = 5;
      } else {
        frameSize = 7; // Default to 10 if not specified
      }

      console.log("before", state.filteredData);

      // Sort the data based on market_cap and slice the top `frameSize` items
      state.filteredData = state.data
        .slice() // Clone data array (to avoid mutating original).   This is V.V Important otherwise will get 
        .sort((a, b) => b.market_cap - a.market_cap) // Sort descending by value
        .slice(0, frameSize) || []; // Take the top N based on frameSize

        console.log(state.filteredData);
      // Update the filters in the state
      state.filter = action.payload;
    },
  },
});

export const {
  fetchDataSuccess,
  fetchDataFailure,
  fetchDataStart,
  fetchDataComplete,
  setFilter,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
