import os
import time
import redis
import json
from openai import OpenAI
from dotenv import load_dotenv

# Explicitly load .env file
load_dotenv(dotenv_path=".env")

# Retrieve API keys
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# # Debugging: Print values to check if they load
# print("Supabase URL:", SUPABASE_URL)
# print("YouTube API Key:", YOUTUBE_API_KEY)
# print("OpenAI API Key:", OPENAI_API_KEY)

redis_client = redis.Redis(host="redis", port=6379, db=0, decode_responses=True)

# Analyze comments using OpenAI's Moderation API, caches results, and returns flagged comments
def moderate_comments(comments, video_id):
    """ Moderates a batch of comments and returns flagged comments including comment_id & video_id. """

    print("Received Comments for Moderation:", comments)

    if not isinstance(comments, list):
        print("Error: `comments` is not a list! Received:", comments)
        return {"error": "Comment format is incorrect"}

    flagged_comments = []
    batch_size = 3  # Process comments in batches to reduce API calls

    for i in range(0, len(comments), batch_size):
        batch = comments[i:i + batch_size]

        attempt = 0
        max_attempts = 5

        while attempt < max_attempts:
            try:
                cached_results = []
                comments_to_process = []
                
                for comment in batch:
                    if not isinstance(comment, dict) or "text" not in comment or "comment_id" not in comment:
                        print("Error: Invalid comment format:", comment)
                        continue  

                    cache_key = f"moderation:{comment['text']}"
                    cached_result = redis_client.get(cache_key)
                    
                    if cached_result:
                        print(f"Returning cached moderation results for: {comment['text']}")
                        flagged_comments.append(json.loads(cached_result))
                    else:
                        comments_to_process.append(comment)
                
                if not comments_to_process:
                    break
                
                batch_texts = [comment["text"] for comment in comments_to_process]

                if not batch_texts:
                    print("Error: Batch does not contain valid text data:", batch)
                    return {"error": "Invalid comment format in batch"}

                response = client.moderations.create(
                    model="omni-moderation-latest",
                    input=batch_texts
                )

                print("OpenAI API Response:", response)

                for comment, result in zip(comments_to_process, response.results):
                    if result.flagged:
                        flagged_categories = ', '.join([key for key, value in result.categories.__dict__.items() if value])
                        
                        flagged_comment = {
                            "id": comment.get("id", "Unknown"),
                            "text": comment["text"],
                            "flagged_reason": flagged_categories,
                            "comment_id": comment.get("comment_id", "Unknown"),  # Pass comment_id
                            "video_id": comment.get("video_id", "Unknown") # Pass video_id 
                        }

                        redis_client.setex(f"moderation:{comment['text']}", 3600, json.dumps(flagged_comment))
                        flagged_comments.append(flagged_comment)

                time.sleep(2)
                break

            except Exception as e:
                error_message = str(e)
                print(f"Unexpected Error (Attempt {attempt+1}/{max_attempts}): {error_message}")

                if "usage_limit_exceeded" in error_message or "insufficient_quota" in error_message:
                    print("WARNING: You have run out of OpenAI credits!")
                    return {"error": "OpenAI API quota exceeded. Please add more credits."}

                if "Too Many Requests" in error_message or "429" in error_message:
                    wait_time = 2 ** attempt
                    print(f"Rate limit hit. Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                    attempt += 1
                else:
                    return {"error": f"Unexpected Error: {error_message}"}

    print("Final Flagged Comments Output:", flagged_comments)
    return flagged_comments
