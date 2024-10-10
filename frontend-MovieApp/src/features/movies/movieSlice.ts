import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { log } from "console";

type movieProp = {
  userId: number;
  id: number;
  title: string;
  body: string;
};
interface MovieState {
  loading: boolean;
  error: null | string;
  data: null | { results: any[] };
}

// For GET Request
// Step-1: Define Async Thunk (Action)
export const getMovies = createAsyncThunk(
  "movies/getMovies", // slice_name/action_name This will be used internally to identify this action within the Redux store.
  async (_, thunkApi) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts`
      );

      return await response.json();
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

//POST Request

export const addMovie = createAsyncThunk(
  "movies/addMovie",
  async (movieData: movieProp, thunkApi) => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          body: JSON.stringify(movieData),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add movie");
      }

      return await response.json();
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

const initialState: MovieState = {
  loading: false,
  error: null,
  data: { results: [] },
};
// The createAsyncThunk (getMovies) and the createSlice are closely connected via the extraReducers field.
//Step-2: Create a Slice

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {}, //This is for Synchronous actions if any
  extraReducers(builder) {
    // This is for Asynchronous actions, The builder provides methods for handling different states of an async action (pending, fulfilled, and rejected).
    builder.addCase(getMovies.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getMovies.fulfilled,
      (state, action: PayloadAction<{ results: any[] }>) => {
        console.log(state.loading);

        state.loading = false;
        state.data = action.payload;
      }
    );

    builder.addCase(getMovies.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handling POST request (addMovie)
    builder.addCase(addMovie.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addMovie.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      getMovies();
    });

    builder.addCase(addMovie.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Creating Memoized Selectors :
// The memorized Selectors contains 2 Part 1. Input selectors 2.Result function
// The result function of a selector created with createSelector will be executed only when the input values provided by the input selectors have changed. If the input values are the same as the previous call, the memoized result will be returned, and the result function will not be executed again.
//Step 3: Define selectors after the slice definition
const movies = (state: any) => state.movies.data;
const searchTerm = (state: any) => state.search;

export const selectFilteredMovies = createSelector(
  [movies, searchTerm], //Part-1: Input selectors-- hese are responsible for pulling the required pieces of state from the Redux store

  (movies, searchTerm) => {
    // Part-2: result function
    const normalizedSearchTerm = searchTerm.toLowerCase(); // Normalize the searchTerm to lowercase

    // Ensure movies is an array, then apply filtering
    return Array.isArray(movies)
      ? movies.filter((movie) => {
          if (!normalizedSearchTerm.length) return movie; // Return all movies if no searchTerm
          if (!movie.title) return false; // Skip movies without a title
          return movie.title.toLowerCase().includes(normalizedSearchTerm); // Filter based on title
        })
      : [];
  }
);

export default movieSlice.reducer;
