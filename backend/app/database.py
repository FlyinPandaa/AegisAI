import os
from dotenv import load_dotenv
import supabase
import datetime

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in the .env file")

# Initialize Supabase client
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

def store_comments(flagged_comments):
    """Stores flagged comments in Supabase with additional metadata."""
    for comment in flagged_comments:
        try:
            # Ensure comment has necessary fields
            if "text" not in comment or "flagged_reason" not in comment:
                print("Error: Comment missing required fields:", comment)
                continue  # Skip storing invalid comments

            # Insert flagged comment into Supabase
            response = supabase_client.table("flagged_comments").insert({
                "id": comment.get("id", "Unknown"),  # Default to "Unknown" if missing
                "text": comment["text"],
                "flagged_reason": str(comment["flagged_reason"]),  # Convert dict to string
                "created_at": datetime.datetime.utcnow().isoformat()  # Timestamp
            }).execute()

            # Debugging: Print the inserted data response
            print("Successfully stored comment:", response)

        except Exception as e:
            print("Error storing comment in Supabase:", str(e))

def fetch_flagged_comments():
    """Fetch all flagged comments from Supabase."""
    try:
        response = supabase_client.table("flagged_comments").select("*").execute()
        return response.data  # Ensure this returns a list
    except Exception as e:
        print("Error fetching flagged comments:", str(e))
        return []







# import supabase
# import os
# from dotenv import load_dotenv

# load_dotenv()

# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# if not SUPABASE_URL or not SUPABASE_KEY:
#     raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in the .env file")

# # Initialize Supabase client
# supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

# def store_comments(flagged_comments):
#     for comment in flagged_comments:
#         supabase_client.table("flagged_comments").insert({"text": comment["text"]}).execute()
        
# def fetch_flagged_comments():
#     """Fetch all flagged comments from Supabase."""
#     response = supabase_client.table("flagged_comments").select("*").execute()
    
#     # # Debugging: Print raw responses from supabase
#     # print("Supabase Response:", response)

#     return response.data  # Ensure this returns a list