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

redis_client = redis.Redis(host="redis", port=6379, db=0, decode_responses=True)

# # Debugging: Print values to check if they load
    # print("Supabase URL:", SUPABASE_URL)
    # print("YouTube API Key:", YOUTUBE_API_KEY)
    # print("OpenAI API Key:", OPENAI_API_KEY)

# Analyze comments using OpenAI's Moderation API, caches results in flagged comments, and return flagged comments
def moderate_comments(comments):

    # Debugging: Print received comments before processing
    print("Received Comments for Moderation:", comments)

    # Ensure `comments` is a list before proceeding
    if not isinstance(comments, list):
        print("Error: `comments` is not a list! Received:", comments)
        return {"error": "Comment format is incorrect"}

    # Ensure each comment is a dictionary and has a "text" key
    for comment in comments:
        if not isinstance(comment, dict) or "text" not in comment:
            print("Error: Comment is not a dictionary or missing 'text' key:", comment)
            return {"error": "Comment format is incorrect"}

    flagged_comments = []
    batch_size = 3  # Process comments in batches to reduce API calls

    for i in range(0, len(comments), batch_size):
        batch = comments[i:i+batch_size]  # Process batch of comments

        attempt = 0  # Track retries
        max_attempts = 5  # Maximum retries

        while attempt < max_attempts:
            try:
                cached_results = []
                comments_to_process = []
                
                for comment in batch:
                    cache_key = f"moderation:{comment['text']}"
                    cached_result = redis_client.get(cache_key)
                    
                    if cached_result:
                        print(f"Returning cached moderation results for: {comment['text']}")
                        flagged_comments.append(json.loads(cached_result))
                    else:
                        comments_to_process.append(comment)
                
                if not comments_to_process:
                    break
                
                # Ensure batch contains valid text data
                batch_texts = [comment["text"] for comment in batch if isinstance(comment, dict) and "text" in comment]

                if not batch_texts:
                    print("Error: Batch does not contain valid text data:", batch)
                    return {"error": "Invalid comment format in batch"}

                # Send multiple comments in one API request
                response = client.moderations.create(
                    model="omni-moderation-latest",
                    input=batch_texts  # List of comment texts
                )

                # Debugging: Print OpenAI API response
                print("OpenAI API Response:", response)

                for comment, result in zip(comments_to_process, response.results):
                    if result.flagged:
                        flagged_categories = ', '.join([key for key, value in result.categories.__dict__.items() if value])
                        
                        flagged_comment = {
                            "id": comment.get("id", "Unknown"),
                            "text": comment["text"],
                            "flagged_reason": flagged_categories
                        }

                        # Store flagged comment in Redis for 1 hour (3600 seconds)
                        redis_client.setex(f"moderation:{comment['text']}", 3600, json.dumps(flagged_comment))
                        # Append flagged comments to the flagged_comment
                        flagged_comments.append(flagged_comment)

                time.sleep(2)  # Add delay to reduce API call frequency
                break  # If successful, exit retry loop

            except Exception as e:
                error_message = str(e)
                print(f"Unexpected Error (Attempt {attempt+1}/{max_attempts}): {error_message}")

                # If OpenAI credits exceeded
                if "usage_limit_exceeded" in error_message or "insufficient_quota" in error_message:
                    print("WARNING: You have run out of OpenAI credits!")
                    return {"error": "OpenAI API quota exceeded. Please add more credits."}

                # If rate limit error, apply exponential backoff
                if "Too Many Requests" in error_message or "429" in error_message:
                    wait_time = 2 ** attempt  # Exponential backoff (2s, 4s, 8s, etc.)
                    print(f"Rate limit hit. Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                    attempt += 1
                else:
                    return {"error": f"Unexpected Error: {error_message}"}

    print("Final Flagged Comments Output:", flagged_comments)  # Debugging
    return flagged_comments