from fastapi import FastAPI
from app.comments import fetch_all_comments
from app.moderation import moderate_comments
from app.database import store_comments, fetch_flagged_comments

app = FastAPI()

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

# Fetches comments, moderates them using Moderation API from OpenAI, and stores flagged comments
@app.post("/moderate-all-comments/")
async def fetch_and_moderate_all(video_url: str):
    comments = fetch_all_comments(video_url)
    flagged_comments = moderate_comments(comments)
    
    print("Flagged comments before storing:", flagged_comments)
    
    if flagged_comments and isinstance(flagged_comments, list):
        store_comments(flagged_comments)
    else:
        print("Error: `flagged_comments` is not a list! Received:", flagged_comments)
    
    return {"success": True, "flagged_comments": flagged_comments}

