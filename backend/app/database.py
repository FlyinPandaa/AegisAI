import os, datetime, supabase
from dotenv import load_dotenv
from postgrest import APIError

load_dotenv()
SUPABASE_URL   = os.getenv("SUPABASE_URL")
SUPABASE_KEY   = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase URL or service-role key")

supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

def store_comments(flagged_comments, video_id):
    for comment in flagged_comments:
        payload = {
            "author":         comment.get("author", "Unknown"),
            "text":           comment["text"],
            "flagged_reason": comment["flagged_reason"] or ["Not specified"],
            "comment_id":     comment["comment_id"],
            "video_id":       comment["video_id"],
            "report":         True,
            "created_at":     datetime.datetime.utcnow().isoformat()
        }

        try:
            # Attempt the insert — if it fails, supabase-py will raise an exception
            resp = supabase_client.table("flagged_comments").insert(payload).execute()

            
            print("Supabase insert OK, data:", resp.data)

        except Exception as e:
            # Anything that goes wrong—network, permission, schema mismatch—lands here
            print("Supabase insert failed:", e)
            # Print the payload that caused it
            print("   payload:", payload)


def fetch_flagged_comments():
    try:
        resp = supabase_client.table("flagged_comments")\
                    .select("uuid, text, flagged_reason, comment_id, video_id")\
                    .execute()
        if resp.error:
            print("Supabase fetch error:", resp.error)
            return []
        return resp.data
    except Exception as e:
        print("Exception fetching flagged comments:", e)
        return []
