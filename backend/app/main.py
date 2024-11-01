import requests
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel
from datetime import datetime, timedelta
from app.models import data, TableData

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


# Secret key for encoding the JWT
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Dummy user database
fake_users_db = {
    "user@example.com": {
        "username": "user@example.com",
        "password": "password123"  # In practice, this should be hashed.
    }
}

# Helper function to create JWT tokens
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Login route
@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or user["password"] != form_data.password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/analytics")
def get_analytics_data():
    # Fetch data from the CoinGecko API
    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": 10,  # Number of coins to fetch
        "page": 1,
        "sparkline": "false"
    }
    
    response = requests.get(url, params=params)
    return response.json()


@app.get("/table-data", response_model=List[TableData])
async def get_table_data():
    return data