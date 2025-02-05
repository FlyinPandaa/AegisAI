PandaShield45!67@

Ubuntu:
michael_fang
PandaWingz4567!

# AegisAI 

## Introduction
- Introduce AegisAI
- What is the problem?
- How does AegisAI solves this?

## Project Archeticture
- Explore what the archectivture of AegisAI

## Running Program
- Walk user through running code on their machine

## Thank you
- Thank users
- Insert a small About Me
- Introduce YouTube channel
- Drop socials and porfolio site

## Updates/Tasks/Timeline

### 2/2/25
- [x] Task 1: Start Repository
- [x] Task 2: Create React-app
- [x] Task 3: Setup basic frontend

### 2/3/25
- [x] Task 1: Setup API keys
- [x] Task 2: Test API keys
    - FastAPI wasn't working properly
    - Realized OpenAI's Moderation API changed and had to account for the new updates
- [x] Task 3: Test initial backend code
    - API not return desired results
    - Receiving errors regarding the data types being passed in
        - Fixed by modifying comments, moderation, and database files in the backend to provide and process the right data types

### 2/4/25
- [x] Task 1: Test flagged comments storage in Supabase
    - Ran into weird error with Python and Pylance extension
        - Fixed by downgrading Python and Pylance extension to 2023 version
    - Ran  into another error where `flagged comments` is not a list! Received: []
    - Issue with database.py while inserting the comments into Supabase
        - Misspelled the columns, so the `store_comments` inside database.py was trying to insert the `flagged_comments` in non-existing columns in Supabase

- [x] Task 2: Implement caching (backend optimization)
    - Issue with Redis not installing properly
        - Managed to proceed with project without the above issue impacting testing
        - Moved to using Docker for running backend for testing
        - To run docker:
            - docker-compose -d build
        - To shut down:
            - docker-compose down
        

- [] Task 3: Attach frontend to backend
    - Didn't get to this step, but will work on this tomorrow

### 2/5/25
- [] Task 3: Attach frontend to backend
- [] Task 3: Attach frontend to backend
- [] Task 3: Attach frontend to backend

### 2/6/25

### 2/7/25

### 2/8/25




# Future improvements
- 
