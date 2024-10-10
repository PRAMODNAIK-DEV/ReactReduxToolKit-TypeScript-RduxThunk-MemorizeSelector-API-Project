from fastapi.middleware.cors import CORSMiddleware
from typing import List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows all origins. Change it to specific origins if necessary.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

posts = [
    {"id": 1, "title": "First Post", "body": "This is the first post."},
    {"id": 2, "title": "Second Post", "body": "This is the second post."},
    {"id": 3, "title": "Third Post", "body": "This is the third post."}
]

class Post(BaseModel):
    id: int
    title: str
    body: str
    
# Define the PostCreate model without the id field
class PostCreate(BaseModel):
    title: str
    body: str
    
@app.get("/")
def read_root():
    return {"message": "Welcome to PRAMOD FastAPI backend!"}


@app.get("/posts", response_model=List[Post])
async def get_posts():
    return posts

@app.post("/posts", response_model=Post)
async def create_post(post: PostCreate):
    new_id = max([p["id"] for p in posts], default=0) + 1  # Generate a new ID
    new_post = {"id": new_id, **post.model_dump()}  # Merge the generated ID with the post data
    posts.append(new_post)
    return new_post

@app.put("/posts/{post_id}", response_model=Post)
async def update_post(post_id: int, updated_post: Post):
    for post in posts:
        if post["id"] == post_id:
            post.update(updated_post.dict())
            return post
    raise HTTPException(status_code = 404, detail="Post Not Found")

@app.delete("/posts/{post_id}", response_model=dict)
async def delete_post(post_id: int):
    for post in posts:
        if post["id"] == post_id:
            posts.remove(post)
            return {"message": "Post deleted"}
    raise HTTPException(status_code=404, detail="Post not found")
