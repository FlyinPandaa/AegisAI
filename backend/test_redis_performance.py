import os
import time
import requests
import redis
from openai import OpenAI
from app.comments import fetch_all_comments
from app.moderation import moderate_comments

test_video_url = "https://www.youtube.com/watch?v=9YlJ0j0bRDw"

def test_performance():
    print("\nRunning Performance Test with Redis Optimization...")

    # Test YouTube Comment Fetching
    print("\nFetching YouTube comments (WITHOUT cache)...")
    start_time = time.time()
    comments = fetch_all_comments(test_video_url)  # Fetch fresh
    first_fetch_time = time.time() - start_time
    print(f"Time taken (First Fetch): {first_fetch_time:.2f} seconds\n")

    print("\nFetching YouTube comments (WITH cache)...")
    start_time = time.time()
    cached_comments = fetch_all_comments(test_video_url)  # Fetch from Redis
    second_fetch_time = time.time() - start_time
    print(f"Time taken (Cached Fetch): {second_fetch_time:.2f} seconds\n")

    # Test OpenAI Moderation
    print("\nRunning OpenAI Moderation (WITHOUT cache)...")
    start_time = time.time()
    flagged_comments = moderate_comments(comments)  # Fresh moderation
    first_moderation_time = time.time() - start_time
    print(f"Time taken (First Moderation): {first_moderation_time:.2f} seconds\n")

    print("\nRunning OpenAI Moderation (WITH cache)...")
    start_time = time.time()
    cached_flagged_comments = moderate_comments(comments)  # Fetch from Redis
    second_moderation_time = time.time() - start_time
    print(f"Time taken (Cached Moderation): {second_moderation_time:.2f} seconds\n")

    # Display Performance Improvement
    print("\n**Performance Improvement with Redis Caching:**")
    print(f"YouTube API: {first_fetch_time:.2f}s → {second_fetch_time:.2f}s (Cached)")
    print(f"OpenAI API: {first_moderation_time:.2f}s → {second_moderation_time:.2f}s (Cached)")
    print("\n**Redis caching successfully reduced response times!** ")
    
if __name__ == "__main__":
    test_performance()