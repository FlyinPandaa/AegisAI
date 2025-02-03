from fastapi import FastAPI
from app.comments import fetch_comments
from app.moderation import moderate_comments
from app.database import store_comments
from app.database import fetch_flagged_comments


app = FastAPI()

@app.get("/")
async def root():
    return {"message": "AegisAI Backend is Running!"}

@app.post("/fetch-comments")
async def fetch_and_moderate(url:str):
    comments = fetch_comments(url)
    flagged_comments = moderate_comments(comments)
    store_comments(flagged_comments)
    return {"success": True, "flagged_comments": flagged_comments}

@app.get("/comments")
async def get_comments():
    return {"comments": fetch_flagged_comments()}

async def get_flagged_comments():
    comments = fetch_flagged_comments()
    return {"flagged_comments": comments}