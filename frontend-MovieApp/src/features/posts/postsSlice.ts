import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { title } from "process";

const API_URL = "http://127.0.0.1:8000/posts";

export interface Post{
  id: number;
  title: string;
  body: string;
}

interface PostsState  {
    posts: Post[];
    loading: boolean;
    error: string | null;
}
const initialState: PostsState  = {
    posts:[],
    loading: false,
    error: null
}

// Create Thunk for GET:
export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async () =>{
        const response = await axios.get(API_URL);
        return response.data;
    }
)

export const createPost = createAsyncThunk(
    'posts/createPost',
    async (post: Omit< Post, 'id'>) => {                    // Here Omit is a utility type that constructs a new type by removing one or more properties from an existing type. So here it is removing the key 'id' from the interface Post
        const response = await axios.post(API_URL, {
            title: post.title,
            body: post.body
        });
        return response.data;
    }
)

export const updatePost = createAsyncThunk(
    'posts/updatePost',
    async (post: Post) =>{
        const response = await axios.put(`${API_URL}/${post.id}`, post);

        return response.data;
    }
)

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async (id: number) =>{
        await axios.delete(`${API_URL}/${id}`);
        return id;
    }
)

// Create Slice
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchPosts.pending, (state) =>{
            state.loading = true;
            state.error = null;
        })

        .addCase(fetchPosts.fulfilled, (state, action) => {             // V.V. Important Here the action is basically the data returned by the above fetchPosts Thunk 
            state.loading = false;
            state.posts = action.payload;
        })

        .addCase(fetchPosts.rejected, (state, action) => {              // V.V. Important Here the action is basically the data returned by the above fetchPosts Thunk 
            state.loading = false;
            state.error = action.error.message || 'Failed to Fetch the Posts';
        })

        .addCase(createPost.fulfilled, (state, action) =>{              // V.V. Important Here the action is basically the data returned by the above createPost Thunk 
            state.posts.push(action.payload);
        })

        .addCase(updatePost.fulfilled, (state, action) =>{              // V.V. Important Here the action is basically the data returned by the above updatePost Thunk 
            const index = state.posts.findIndex((post) => post.id === action.payload.id);

            state.posts[index] = action.payload;
        })

        .addCase(deletePost.fulfilled, (state, action) =>{              // V.V. Important Here the action is basically the data returned by the above deletePost Thunk which is id.
            state.posts = state.posts.filter((post) => post.id !== action.payload)
        })
    }

})

export default postsSlice.reducer;