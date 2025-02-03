import requests
import os

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def fetch_comments(video_url):
    video_id = video_url.split("v=")[-1]
    url = f"https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId={video_id}&key={YOUTUBE_API_KEY}"
    
    response = requests.get(url)
    if response.status_code == 200:
        comments = [item["snippet"]["topLevelComment"]["snippet"]["textDisplay"] for item in response.json().get("items", [])]
        return [{"text": comment} for comment in comments]
    return []