import os
import datetime
import supabase
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in the .env file")

# Initialize Supabase client
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

# Stores flagged comments in Supabase with additional metadata
def store_comments(flagged_comments, video_id):
    for comment in flagged_comments:
        try:
            # Ensure comment has necessary fields
            if "text" not in comment or "flagged_reason" not in comment or "comment_id" not in comment:
                print("Error: Comment missing required fields:", comment)
                continue  # Skip storing invalid comments

            # Insert flagged comment into Supabase
            response = supabase_client.table("flagged_comments").insert({
                "id": comment.get("id", "Unknown"),  # Default to "Unknown" if missing
                "text": comment["text"],
                "flagged_reason": str(comment["flagged_reason"]),  # Convert dict to string
                "comment_id": comment["comment_id"],  # Save comment_id
                "video_id": comment["video_id"],  # Save video_id
                "created_at": datetime.datetime.utcnow().isoformat()  # Timestamp
            }).execute()

            # Debugging: Print the inserted data response
            print("Successfully stored comment:", response)

        except Exception as e:
            print("Error storing comment in Supabase:", str(e))

# Fetch all flagged comments from Supabase
def fetch_flagged_comments():
    try:
        response = supabase_client.table("flagged_comments").select("id, text, flagged_reason, comment_id, video_id").execute()
        return response.data  # Ensure this returns a list with comment_id and video_id
    except Exception as e:
        print("Error fetching flagged comments:", str(e))
        return []
