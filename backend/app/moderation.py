import os
import time
from openai import OpenAI
from dotenv import load_dotenv
# import json

# Explicitly load .env file
load_dotenv(dotenv_path=".env")

# Retrieve API keys
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# openai.api_key = OPENAI_API_KEY

# # Debugging: Print values to check if they load
    # print("Supabase URL:", SUPABASE_URL)
    # print("YouTube API Key:", YOUTUBE_API_KEY)
    # print("OpenAI API Key:", OPENAI_API_KEY)

# Analyze comments using OpenAI's Moderation API and return flagged comments
def moderate_comments(comments):
    """Analyzes comments with OpenAI Moderation API and returns flagged comments."""

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

                # Process batch results
                for comment, result in zip(batch, response.results):
                    if result.flagged:
                        flagged_comments.append({
                            "author": comment.get("author", "Unknown"),
                            "text": comment["text"],
                            "flagged_categories": result.categories
                        })

                time.sleep(1)  # Add delay to reduce API call frequency
                break  # If successful, exit retry loop

            except Exception as e:
                error_message = str(e)
                print(f"Unexpected Error (Attempt {attempt+1}/{max_attempts}): {error_message}")

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