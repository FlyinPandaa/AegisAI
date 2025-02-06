from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel  # Import BaseModel for request validation
from app.comments import fetch_all_comments
from app.moderation import moderate_comments
from app.database import store_comments, fetch_flagged_comments

app = FastAPI()

# Enable CORS for Frontend (localhost:3000 or other origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Define Expected Request Body for Video URL
class VideoRequest(BaseModel):
    video_url: str

# Health check to confirm backend is running properly
@app.get("/")
async def root():
    return {"message": "AegisAI Backend is Running!"}

# Fetches all YouTube comments from a given video URL
@app.get("/fetch-all-comments/")
async def get_all_youtube_comments(video_url: str):
    return fetch_all_comments(video_url)

# Fetches all flagged comments stored in the Supabase database
@app.get("/flagged-comments/")
async def get_flagged_comments():
    comments = fetch_flagged_comments()
    return {"flagged_comments": comments}

# Fetches, moderates comments using OpenAI API, and stores flagged comments
@app.post("/moderate-all-comments/")
async def fetch_and_moderate_all(request: VideoRequest):  # Use request body
    comments = fetch_all_comments(request.video_url)  # Extract video_url correctly
    flagged_comments = moderate_comments(comments)
    
    print("Flagged comments before storing:", flagged_comments)
    
    if flagged_comments and isinstance(flagged_comments, list):
        store_comments(flagged_comments)
    else:
        print("Error: `flagged_comments` is not a list! Received:", flagged_comments)
    
    return {"success": True, "flagged_comments": flagged_comments}
