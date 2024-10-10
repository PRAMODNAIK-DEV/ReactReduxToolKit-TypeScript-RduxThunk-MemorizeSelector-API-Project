import { configureStore } from "@reduxjs/toolkit";
import themeReducer from '../src/features/theme/themeSlice'     // This line will impport the default export from the themeSlice.ts file which is themeSlice.reducer;
import movieReducer from "./features/movies/movieSlice";
import searchReducer from './features/search/searchSlice';
import postsReducer from './features/posts/postsSlice';

export const store = configureStore({
    reducer: {
        search: searchReducer,
        darkTheme: themeReducer,            // Here the Updated State for ThemeSlice will be stored.
        movies: movieReducer,
        posts: postsReducer
    },
});

export type RootStateType = ReturnType<typeof store.getState>;      // These 2 are for type safety
export type AppDispatchType = typeof store.dispatch;