const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

export const fetchComments = async (videoUrl, pageToken = null) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/fetch-all-comments/?video_url=${encodeURIComponent(videoUrl)}${pageToken ? `&page_token=${pageToken}` : ''}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching comments:", error);
        return {comments: [], nextPageToken: null};
    }
};

export const moderateComments = async (videoUrl) => {
    try {
        const response = await fetch(`${API_BASE_URL}/moderate-all-comments/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ video_url: videoUrl }), // check for correct key name
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error moderating comments:", error);
        return { flagged_comments: [] };
    }
};

