import supabase
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in the .env file")

# Initialize Supabase client
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

def store_comments(flagged_comments):
    for comment in flagged_comments:
        supabase_client.table("flagged_comments").insert({"text": comment["text"]}).execute()
        
def fetch_flagged_comments():
    """Fetch all flagged comments from Supabase."""
    response = supabase_client.table("flagged_comments").select("*").execute()
    
    # # Debugging: Print raw responses from supabase
    # print("Supabase Response:", response)

    return response.data  # Ensure this returns a list