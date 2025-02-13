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

# Define high-risk words for prioritization
HIGH_RISK_KEYWORDS = {"kill", "bomb", "hate", "murder", "racist", "attack", "threat", "suicide", "terrorist"}

def is_high_risk(comment_text):
    """Determines if a comment is high-risk based on predefined keywords."""
    if not comment_text:
        return False
    return any(word in comment_text.lower() for word in HIGH_RISK_KEYWORDS)

# Efficient batching with reduced OpenAI API calls
def moderate_comments(comments, video_id):
    """
    Moderates comments in efficient batches, prioritizing high-risk comments first.
    - Caches results to reduce duplicate API calls
    - Implements batching for cost reduction
    - Processes high-risk comments before low-risk ones
    """

    print(f"Received {len(comments)} Comments for Moderation")

    if not isinstance(comments, list):
        print("Error: `comments` is not a list! Received:", comments)
        return {"error": "Comment format is incorrect"}

    flagged_comments = []
    batch_size = min(50, len(comments))  # Up to 50 comments at a time

    comments_to_process = []
    high_risk_comments = []  # High-risk comments to prioritize
    low_risk_comments = []   # Process low-risk comments later

    for comment in comments:
        if not isinstance(comment, dict) or "text" not in comment or "comment_id" not in comment:
            print("Skipping Invalid Comment Format:", comment)
            continue

        cache_key = f"moderation:{comment['text']}"
        cached_result = redis_client.get(cache_key)

        if cached_result:
            print(f"Returning Cached Result for: {comment['text']}")
            flagged_comments.append(json.loads(cached_result))
        else:
            if is_high_risk(comment["text"]):
                high_risk_comments.append(comment)
            else:
                low_risk_comments.append(comment)

    # Combine priority first
    comments_to_process = high_risk_comments + low_risk_comments

    if not comments_to_process:
        print("All comments were cached. No API call needed.")
        return flagged_comments

    print(f"Processing {len(high_risk_comments)} High-Risk Comments First")
    print(f"Processing {len(low_risk_comments)} Low-Risk Comments After")

    # Process comments in batches
    for i in range(0, len(comments_to_process), batch_size):
        batch = comments_to_process[i:i + batch_size]
        batch_texts = [comment["text"] for comment in batch]

        attempt = 0
        max_attempts = 5

        while attempt < max_attempts:
            try:
                # Send batch request to OpenAI Moderation API
                response = client.moderations.create(
                    model="omni-moderation-latest",
                    input=batch_texts
                )

                print(f"OpenAI API Response for Batch {i//batch_size + 1}:", response)

                for comment, result in zip(batch, response.results):
                    if result.flagged:
                        flagged_categories = ', '.join(
                            [key for key, value in result.categories.__dict__.items() if value]
                        )
                        
                        flagged_comment = {
                            "id": comment.get("id", "Unknown"),
                            "text": comment["text"],
                            "flagged_reason": flagged_categories,
                            "comment_id": comment.get("comment_id", "Unknown"),
                            "video_id": video_id  
                        }

                        # Cache result for future use (up to 1 hour)
                        redis_client.setex(f"moderation:{comment['text']}", 3600, json.dumps(flagged_comment))
                        flagged_comments.append(flagged_comment)

                time.sleep(1)  # Reduce the risk of API throttling risk
                break  

            except Exception as e:
                error_message = str(e)
                print(f"OpenAI API Error (Attempt {attempt+1}/{max_attempts}): {error_message}")

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
