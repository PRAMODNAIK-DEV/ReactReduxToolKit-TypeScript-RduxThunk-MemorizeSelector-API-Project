import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import {
  createPost,
  deletePost,
  fetchPosts,
  Post,
  updatePost,
} from "../../features/posts/postsSlice";
import "./Posts.css";
const Posts = () => {
  const dispatch = useAppDispatch();

  const { posts, loading, error } = useAppSelector(
    (currState) => currState.posts
  );

  const [editPost, setEditPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({ title: "", body: "" });

  //   useEffect(() => {
  //     dispatch(fetchPosts());
  //   }, [dispatch]);

  const hanldeFetchPosts = () => {
    dispatch(fetchPosts());
  };

  const handleCreatePost = () => {
    dispatch(createPost(newPost));
    setNewPost({ title: "", body: "" });
  };

  const handleUpdatePost = (post: Post) => {
    dispatch(updatePost(post));
    setEditPost(null);
  };

  const handleDeletePost = (id: number) => {
    dispatch(deletePost(id));
  };

  return (
    <div className="container">
      <button onClick={hanldeFetchPosts}>Fetch Posts</button>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      <ul>
        {posts.map((post) => {
          return (
            <li key={post.id}>
              {editPost && editPost.id === post.id ? (
                <div className="editing-area">
                  <input
                    type="text"
                    value={editPost.title}
                    onChange={(e) =>
                      setEditPost({ ...editPost, title: e.target.value })
                    }
                  />
                  <textarea
                    value={editPost.body}
                    onChange={(e) =>
                      setEditPost({ ...editPost, body: e.target.value })
                    }
                  />
                  <button onClick={() => handleUpdatePost(editPost)}>
                    Update
                  </button>
                </div>
              ) : (
                <div>
                  <h2>{post.title}</h2>
                  <p>{post.body}</p>
                  <button onClick={() => setEditPost(post)}>Edit</button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="create-post">
        <h2>Create New Post</h2>
        <input
          type="text"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          placeholder="Title"
        />
        <textarea
          value={newPost.body}
          onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          placeholder="Body"
        />
        <button onClick={handleCreatePost}>Create Post</button>
      </div>
    </div>
  );
};

export default Posts;
