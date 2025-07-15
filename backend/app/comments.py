# Imports
import requests
import os
# Data
import json
# Caching
import redis
# Python's regular expressions module
import re
# Environments
from dotenv import load_dotenv

# Load .env file
load_dotenv(dotenv_path=".env")

# Retrieve API keys
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# # Debugging: Print values to check if they load
    # print("Supabase URL:", SUPABASE_URL)
    # print("YouTube API Key:", YOUTUBE_API_KEY)
    # print("OpenAI API Key:", OPENAI_API_KEY)

redis_client = redis.Redis(host="redis", port=6379, db=0, decode_responses=True)

def extract_video_id(url):
    """Extracts the YouTube video ID from regular videos, Shorts, and youtu.be links"""
    video_id = None

    # Check for Shorts URL
    shorts_match = re.search(r"youtube\.com/shorts/([a-zA-Z0-9_-]+)", url)
    if shorts_match:
        video_id = shorts_match.group(1)

    # Check for regular YouTube video URL (watch?v=...)
    regular_match = re.search(r"(?:v=|youtu\.be/)([a-zA-Z0-9_-]+)", url)
    if regular_match:
        video_id = regular_match.group(1)

    # Check for shortened YouTube link (youtu.be/...)
    if "youtu.be/" in url:
        video_id = url.split("youtu.be/")[-1].split("?")[0]

    if not video_id:
        print("Error: Could not extract video_id from:", url)

    return video_id

def fetch_all_comments(video_url):
    """Fetches all YouTube comments using pagination (always returns a list)."""
    video_id = extract_video_id(video_url)
    
    if not video_id:
        print("Error: Invalid YouTube URL")
        return []  # Always a list
    
    cache_key = f"youtube_comments:{video_id}"
    cached = redis_client.get(cache_key)
    if cached:
        print(f"Returning cached comments for video {video_id} from Redis")
        return json.loads(cached)  # List
    
    url = "https://www.googleapis.com/youtube/v3/commentThreads"
    params = {
        "part":       "snippet",
        "videoId":    video_id,
        "key":        YOUTUBE_API_KEY,
        "maxResults": 50
    }

    all_comments = []
    next_page_token = None

    while True:
        if next_page_token:
            params["pageToken"] = next_page_token

        response = requests.get(url, params=params)
        if response.status_code != 200:
            print("Error fetching YouTube comments:", response.status_code, response.text)
            return []  # Unified return type

        data = response.json()
        items = data.get("items", [])
        next_page_token = data.get("nextPageToken")

        comments = [
            {
                "author":     item["snippet"]["topLevelComment"]["snippet"]["authorDisplayName"],
                "text":       item["snippet"]["topLevelComment"]["snippet"]["textDisplay"],
                "comment_id": item["snippet"]["topLevelComment"]["id"],
                "video_id":   video_id
            }
            for item in items
        ]
        all_comments.extend(comments)

        # Debug logging
        for c in comments:
            print(f"Extracted Comment ID: {c['comment_id']} | Author: {c['author']}")

        print(f"Fetched {len(comments)} comments, Total so far: {len(all_comments)}")

        if not next_page_token:
            break

    # Cache and return list
    redis_client.setex(cache_key, 3600, json.dumps(all_comments))
    print(f"Cached comments for video {video_id} in Redis")
    print("Final Retrieved Comments:", all_comments)

    return all_comments


