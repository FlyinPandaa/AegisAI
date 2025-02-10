import React from "react";

const CommentItem = ({ comment }) => {
    // Check if it's a YouTube Short based on the URL or flag set from the backend
    const isShort = comment.isShort;

    // Create YouTube URL for the comment
    const videoUrl = isShort
        ? `https://www.youtube.com/shorts/${comment.videoId}?lc=${comment.id}`
        : `https://www.youtube.com/watch?v=${comment.videoId}&lc=${comment.id}`;

    return (
        <div className="comment-item">
            <p><strong>@{comment.id}</strong>: {comment.text}</p>
            <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="report-on-youtube-button"
            >
                Report on YouTube
            </a>
        </div>
    );
};

export default CommentItem;
