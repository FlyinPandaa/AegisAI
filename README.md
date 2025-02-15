# AegisAI 

## Introduction :wave:
AegisAI is a web application that streamlines moderating YouTube comments by flagging toxic and harmful comments with just a YouTube link. Users can help make YouTube a safer community, by reporting flagged comments.

---

### **Click thumbnail below for a demo video on YouTube!** :arrow_down:

[![AegisAI V0 Demo](https://raw.githubusercontent.com/FlyinPandaa/AegisAI/main/frontend/Assets/AegisAI_Home.png)](https://www.youtube.com/watch?v=sy0-erU7Dwo)

## Table of Contents :scroll:
- [Inspiration](#inspiration-sparkles)
- [Tech Stack](#tech-stack-wrench)
- [Architecture](#architecture-computer)
- [Getting Started](#getting-started-rocket)
- [Features](#features-clipboard)
- [APIs](#apis-ledger)
- [Future of AegisAI](#future-of-aegisai-hammer)
- [Acknowledgements](#acknowledgements-eyes)
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
- `.env` file
    - Add a `.env` file inside root folder of **backend** and **frontend**
    - Inside the `.env` files:

| Folder | Content |
| ----------- | ----------- |
| `backend` | `SUPABASE_URL`; `SUPABASE_KEY`; `OPENAI_API_KEY`; `YOUTUBE_API_KEY` |
| `frontend` | `REACT_APP_API_BASE_URL` |

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
- Fetch comments from threads
- Create User Authentication (Google and email)
- Cross Platform capabilities (X and Reddit)
    - Instagram and TikTok might be difficult due to their Terms of Service, but I will have to find a workaround

## Acknowledgements :eyes:
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

![LinkedIn](https://www.linkedin.com/in/michael-d-fang/)
