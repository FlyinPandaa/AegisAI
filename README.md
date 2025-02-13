# AegisAI 

## Introduction :wave:
AegisAI is a web application that streamlines moderating YouTube comments by flagging toxic and harmful comments 
with just a YouTube link. Users can help make YouTube a safer community, by reporting flagged comments.

## Table of Contents :scroll:
- [Inspiration](#inspiration-sparkles)
- [Tech Stack](#tech-stack-wrench)
- [Architecture](#architecture-computer)
- [Getting Started](#getting-started-rocket)
- [Features](#features-clipboard)
- [APIs](#apis-ledger)
- [Future of AegisAI](#future-of-aegisai-hammer)
- [Author](#author-panda_face)

## Inspiration :sparkles:
Scrolling through social media, I was excited that a K-Pop group called LE SSERAFIM, was going to release their latest mini album, EASY. After the release of the album and the 'EASY' music video, it quickly became one of my favorite albums of 2024. Little did I know that there was a storm coming. 

After LE SSERAFIM's stage at Coachella 2024, they received a lot of criticism for poor vocal perfomance. 
It eventually led to a massive hate train on various social media platforms. Several weeks later, the hate train got 
progressively worse. That's when LE SSERAFIM disabled their comment sections for their social media platforms. 
Besides LE SSERAFIM, there are numerous K-Pop groups that also receive toxic or harmful comments. 
I started brainstorming if there was something I can do to reduce the amount of toxic and harmful comments, and 
that ultimately led me to AegisAI. I wanted to create a safer digital space where celebrities, content creators, brands/businesses, community members, and etc. are shielded from toxic and harmful comments.

## Tech Stack :wrench:

### Languages:
- HTML
- CSS
- JS
- Python

### Frameworks:
- React.js
- MaterialUI
- FastAPI

### Technologies/Tools:
- Git
- Docker
- Redis
- Supabase

![Home Page](./frontend/Assets/AegisAI_Home.png)

## Architecture :computer:
![Architecture V0](./frontend/Assets/AegisAI_ArchitectureV0.png)

## Getting started :rocket:

**Prequisites:**
- [Docker](https://www.docker.com/)
    - Download Docker
- [Python](https://www.python.org/)
    - Download Python
- [Node.js and npm](https://nodejs.org/en)
    - Download Node.js 
- [Supabase account](https://supabase.com/)
    - Sign up
    - Create a project and get API keys
    - Add URL and API Key to `.env` file
- [YouTube API Key](https://developers.google.com/youtube/v3)
    - Get API keys
    - Enable YouTube Data API v3
    - Add API Key to `.env` file
- [OpenAI API Key](https://platform.openai.com/docs/overview)
    - Get API keys
    - Add API Key to `.env` file

**Launch program**

1. Clone the project
2. Create `.env` file for API usage. Add API keys to `.env` file
3. While Docker is running in the background execute the following command:
    - To build: `docker-compose up -d --build`
    - To close: `docker-compose down`
4. Visit http://localhost:3000/
5. Paste a YouTube Video or Shorts URL 
- **Note:** Haven't tested with videos with more than 4,000 comments

## Features :clipboard:
- Can insert either a shorts or regular video URL
- Moderates and flags any toxic and harmful comments
- Displays the flagged comments within a table
    - Pagination for longer tables of flagged comments
- **"Report on YouTube"** button directs users to the flagged comment they want to report
    - Note: User will have to scroll down to the comment section once a new YouTube Tab opens up. The highlighted comment will be the comment the user wishes to report.

![Flagged Comments](./frontend/Assets/AegisAI_Flagged_Comment_Table.png)

## APIs :ledger:
1. [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation)
2. [YouTube Data API v3](https://developers.google.com/youtube/v3/getting-started)

---
**Calls**
- `@app.get("/")`: Used to check if the Backend is running properly
- `@app.get("/fetch-all-comments/")`: Fetches all YouTube comments from the provided video URL
- `@app.get("/flagged-comments/")`: Fetches all flagged comments that is stored in Supabase 
- `@app.post("/moderate-all-comments/")`: Fetches and moderates comments using OpenAI's Moderation API. Then stores the flagged comments in Supabase. 

## Future of AegisAI :hammer:
There are a lot of improvements and new features I would like to implement to AegisAI in the future:
- Populate About pages
- Create User Authentication (Google and email)
- Cross Platform capabilities (X and Reddit)
    - Instagram and TikTok might be difficult due to their Terms of Service, but I will have to find a workaround

## Acknowledgements
- **YouTube channels used for testing**
    - [ClearValue Tax](https://www.youtube.com/@clearvaluetax9382)
    - [Graham Stephan](https://www.youtube.com/@GrahamStephan)
    - [Seoulite TV](https://www.youtube.com/@seoulitetv)
    - [MBCkpop](https://www.youtube.com/@MBCkpop)
    - [IVE](https://www.youtube.com/@IVEstarship)

- **Structure of README**
    - Followed [David Kwan's](https://github.com/dwkwan/Lyrics_For_Learning) README structure

## Author :panda_face:

Michael Fang is a recent graduate from University of California, Merced with a degree in Cognitive Science. 
Passionate about solving real world problems with software, and eager to learn new skills to keep up with the ever-evolving technology field. 

## Updates/Tasks (Going to migrate to GitHub Projects):calendar:

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
    - Implemented testing to see if there is any major improvements using Redis for caching
        - TLDR; A very small perfomance boost for running the same Youtube link through the OpenAI Moderation API
        - Might be an issue with the moderation.py code, will have to come back to this later
        
- [] Task 3: Attach frontend to backend
    - Didn't get to this step, but will work on this tomorrow

### 2/5/25
- [x] Task 1: Attach frontend to backend
    - Experienced issues with connecting to the API from the frontend
        - Backend was working fine, but had to connect to LocalHost8000 to utilize the backend logic from the Frontend side
    - Next ran into issues with not being able to display the table of flagged comments
        - Later got fixed, by updating `handleSubmit` inside the Home.js file
    - Another issue where the usernames of the Authors of the flagged comments aren't being displayed on the table
        - Later fixed by changing what data was being accessed from `author` to `id`
            - `<TableCell>{comment?.author || "Unknown"}</TableCell>` -> `<TableCell>{comment?.id || "Unknown"}</TableCell>`
- [] Task 2: Improve design of frontend
    - Didn't get to this task, will work on this on 2/6/25 

### 2/6/25
- [x] Task 1: Improve design of frontend
    - Take inspiration from Mobbin and create home page
    - Ran into an issue with react-infinite-scroll-component not loading properly
        - Had to ensure it was installed, and then manually input the package into the package.json file
    - Will continue to work on frontend tomorrow

### 2/7/25
- [x] Task 1: Improve design of frontend pt2
    - Add navigation bar

### 2/8/25
- [] Task 1: Add report button
- [] Task 2: Optimize moderation backend

- Didn't work on AegisAI on 2/8/25


### 2/9/25
- [x] Task 1: Add report on YouTube button
    - Ran into issue with fetching the correct commentID and the videoURL to send the link to the comment the user wants to report
        - Solution was to create two new columns inside Supabase's tables
        - Afterwards modify the backend to be able to fetch the both the `comment_id` and `video_id` of the flagged comments
        - Then go back to frontend to modify the `generateYouTubeCommentLink` function to create the YouTube link that we will link as the href for the "Report on YouTube" button
        - Additionally within the table, we needed to specify that we want each button to have the correct YouTube link that highlights the comment the user wants to report attached to the button

### 2/10/25
- [x] Task 1: Optimize moderation backend
    - Increased minimum amount for batching comments to be sent to OpenAI's Moderation API. Reducing the amount of times the API is called
    - Additionally decrease the time delay that was previously implemented (from 2 to 1)
        - The time delay was used to  reduce the risk of the API throttling
- [] Task 2: Test the performance increase from using Redis caching
    - Ran into a connection error with the Redis server
        - Currently don't have a solution to this error as of 2/10/25

### 2/11/25
- [x] Work on README.md content

### 2/12/25
- [X] Continue work on README.md content

### 2/13/25
- [] Finish README.md content
    - Testing AegisAI again:
        - Ran into issue with CORS policy of No `Access-Control-Allow-Origin`
        - After checking main.py to make sure the code for enabling CORS for the Frontend is present. I reran the Docker containers and it works again.
        - Found a visual bug where "Loading more comments..." text still displays when there is no more comments