import openai
import os

OPEN_API_KEY = os.getenv("OPENAI_API_KEY")

def moderate_comments(comments):
    flagged_comments = []
    
    for comment in comments:
        response = openai.Moderation.create(input=comment["text"])
        
        if response["results"][0]["flagged"]:
            flagged_comments.append(comment)
    
    return flagged_comments
   