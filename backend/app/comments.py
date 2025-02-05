import requests
import os
import json
import redis
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
    
# Extracts the video ID from a YouTube URL
def extract_video_id(url):
    if "youtube.com/watch?v=" in url:
        return url.split("v=")[-1].split("&")[0]
    elif "youtu.be/" in url:
        return url.split("youtu.be/")[-1].split("?")[0]
    elif "youtube.com/shorts/" in url:
        return url.split("shorts/")[-1].split("?")[0]
    return None

def fetch_all_comments(video_url):
    """Fetches ALL YouTube comments using pagination (automatically)."""
    video_id = extract_video_id(video_url)
    if not video_id:
        print("Error: Invalid YouTube URL")
        return {"comments": [], "message": "Invalid YouTube URL"}
    
    cached_comments = redis_client.get(f"youtube_comments:{video_id}")
    if cached_comments:
        print(f"Returning cached comments for video {video_id} from Redis")
        return json.loads(cached_comments)

    url = "https://www.googleapis.com/youtube/v3/commentThreads"
    params = {
        "part": "snippet",
        "videoId": video_id,
        "key": YOUTUBE_API_KEY,
        "maxResults": 50  # Fetch 50 comments per request
    }

    all_comments = []  # Store all retrieved comments
    next_page_token = None  # To keep track of pagination

    while True:
        if next_page_token:
            params["pageToken"] = next_page_token  # Use next page token if available

        response = requests.get(url, params=params)

        if response.status_code == 200:
            data = response.json()
            items = data.get("items", [])
            next_page_token = data.get("nextPageToken", None)  # Get next page token

            # Debugging: Print YouTube API response
            print("YouTube API Response:", data)

            # Extract comments from the response
            comments = [
                {
                    "id": item["snippet"]["topLevelComment"]["snippet"]["authorDisplayName"],
                    "text": item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
                }
                for item in items
            ]

            all_comments.extend(comments)  # Add comments to list

            # Debugging: Print progress
            print(f"Fetched {len(comments)} comments, Total so far: {len(all_comments)}")

            # Stop if there are no more pages left
            if not next_page_token:
                break
        else:
            print("Error fetching YouTube comments:", response.status_code, response.text)
            return {"comments": [], "message": "Error fetching comments"}
        
    redis_client.setex(f"youtube_comments:{video_id}", 3600, json.dumps(all_comments))
    print(f"Cached comments for video {video_id} in Redis")

    # Debugging: Print final comments before returning
    print("Final Retrieved Comments:", all_comments)
    return all_comments  # Always return a LIST, not a dictionary

