// import React, { useState, useEffect } from "react";
// import { TextField, Button, Container, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
// import { fetchComments, moderateComments } from "../api";
// import CommentItem from "../components/CommentItem"; 
// import InfiniteScroll from "react-infinite-scroll-component"; 
// import { motion } from "framer-motion"; 
// import "../styles/Home.css"; 

// const Home = () => {
//     const [url, setUrl] = useState("");
//     const [flaggedComments, setFlaggedComments] = useState([]);
//     const [visibleComments, setVisibleComments] = useState([]); 
//     const [hasMore, setHasMore] = useState(true);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         console.log("Home Component Mounted!");  
//     }, []);

//     useEffect(() => {
//         console.log("React State Updated: Flagged Comments →", flaggedComments);
//         setVisibleComments(flaggedComments.slice(0, 10)); 
//         setHasMore(flaggedComments.length > 10);
//     }, [flaggedComments]);

//     const handleSubmit = async () => {
//         console.log("URL Submitted:", url);
//         if (!url) {
//             console.error("No URL provided!");
//             return;
//         }

//         setLoading(true);
//         try {
//             await fetchComments(url);
//             const response = await moderateComments(url);
//             console.log("Moderation API Response:", response); 

//             if (response && Array.isArray(response.flagged_comments)) {
//                 setFlaggedComments(response.flagged_comments);
//                 console.log("Flagged Comments Updated:", response.flagged_comments);
//             } else {
//                 console.warn("No flagged comments returned!");
//             }
//         } catch (error) {
//             console.error("API Error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchMoreComments = () => {
//         const nextBatch = flaggedComments.slice(visibleComments.length, visibleComments.length + 10);
//         setVisibleComments(prev => [...prev, ...nextBatch]);

//         if (visibleComments.length + 10 >= flaggedComments.length) {
//             setHasMore(false);
//         }
//     };

//     /** 
//      * Generates a direct link to the comment on YouTube 
//      */
//     // const generateYouTubeCommentLink = (videoUrl, commentId) => {
//     //     if (!videoUrl || !commentId) {
//     //         console.warn("Missing videoUrl or commentId", { videoUrl, commentId });
//     //         return "#"; // Default placeholder
//     //     }

//     //     try {
//     //         const urlObj = new URL(videoUrl);
//     //         let videoId = "";
    
//     //         if (urlObj.hostname.includes("youtube.com")) {
//     //             if (urlObj.pathname.includes("/shorts/")) {
//     //                 // Extract Shorts ID
//     //                 videoId = urlObj.pathname.split("/shorts/")[1].split("?")[0];
//     //             } else {
//     //                 // Extract Video ID
//     //                 videoId = urlObj.searchParams.get("v");
//     //             }
//     //         } else if (urlObj.hostname === "youtu.be") {
//     //             videoId = urlObj.pathname.substring(1);
//     //         }
    
//     //         if (!videoId) {
//     //             console.error("Failed to extract videoId from:", videoUrl)
//     //             return "#"; // Return placeholder if invalid
//     //         }
            
//     //         const reportUrl = `https://www.youtube.com/watch?v=${videoId}&lc=${commentId}`;
//     //         console.log("Generated YouTube Comment URL:", reportUrl);
//     //         return reportUrl;
//     //     } catch (error) {
//     //         console.error("Error generating YouTube link:", error);
//     //         return "#";
//     //     }
//     // };

//     const generateYouTubeCommentLink = (videoUrl, commentId) => {
//         if (!videoUrl || !commentId) {
//             console.warn("Missing videoUrl or commentId", { videoUrl, commentId });
//             return "#"; // Default placeholder
//         }
    
//         try {
//             const urlObj = new URL(videoUrl);
//             let videoId = "";
    
//             if (urlObj.hostname.includes("youtube.com")) {
//                 if (urlObj.pathname.includes("/shorts/")) {
//                     // Extract Shorts ID
//                     videoId = urlObj.pathname.split("/shorts/")[1].split("?")[0];
//                 } else {
//                     // Extract Video ID from regular YouTube link
//                     videoId = urlObj.searchParams.get("v");
//                 }
//             } else if (urlObj.hostname.includes("youtu.be")) {
//                 // Extract Video ID from shortened YouTube link
//                 videoId = urlObj.pathname.substring(1);
//             }
    
//             if (!videoId) {
//                 console.error("Failed to extract videoId from:", videoUrl);
//                 return "#"; // Return placeholder if invalid
//             }
    
//             // Generate the YouTube comment report link
//             const reportUrl = `https://www.youtube.com/watch?v=${videoId}&lc=${commentId}`;
//             console.log("Generated YouTube Comment URL:", reportUrl);
//             return reportUrl;
//         } catch (error) {
//             console.error("Error generating YouTube link:", error);
//             return "#";
//         }
//     };
    

//     return (
//         <Container className="home-container">
//             <h2 className="title">
//                 Moderate YouTube Comments <br /> <span>with the Power of AI</span>
//             </h2>

//             <Box className="input-container">
//                 <TextField
//                     fullWidth
//                     variant="outlined"
//                     placeholder="Paste YouTube video link here..."
//                     value={url}
//                     onChange={(e) => setUrl(e.target.value)}
//                     className="input-field"
//                 />
//                 <Button variant="contained" className="moderate-button" onClick={handleSubmit}>
//                     Moderate
//                 </Button>
//             </Box>

//             {loading && (
//                 <motion.div className="loading-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                     <CircularProgress color="inherit" />
//                 </motion.div>
//             )}

//             {flaggedComments.length > 0 && (
//                 <motion.div className="comments-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                     <h3 className="comments-title">Flagged Comments</h3>
//                     <InfiniteScroll
//                         dataLength={visibleComments.length}
//                         next={fetchMoreComments}
//                         hasMore={hasMore}
//                         loader={<p className="loading-text">Loading more comments...</p>}
//                         height={300}
//                     >
//                         <TableContainer component={Paper} className="scrollable-table">
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell className="table-header">Author</TableCell>
//                                         <TableCell className="table-header">Comment</TableCell>
//                                         <TableCell className="table-header">Flagged Reason</TableCell>
//                                         <TableCell className="table-header">Report</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//     {visibleComments.map((comment, index) => {
//         const isShort = comment?.video_id?.length === 11 && url.includes("shorts"); // Detect Shorts

//         return (
//             <TableRow key={index}>
//                 <TableCell>{comment?.id || "Unknown"}</TableCell>
//                 <TableCell>{comment?.text || "No text available"}</TableCell>
//                 <TableCell>{comment?.flagged_reason || "Not specified"}</TableCell>
//                 <TableCell>
//                     {comment?.comment_id && comment?.video_id ? (
//                         <a
//                             href={generateYouTubeCommentLink(comment.video_id, comment.comment_id, isShort)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="report-button"
//                         >
//                             Report on YouTube
//                         </a>
//                     ) : (
//                         <span style={{ color: "gray", fontStyle: "italic" }}>No ID</span>
//                     )}
//                 </TableCell>
//             </TableRow>
//                         );
//                     })}
//             </TableBody>

//                             </Table>
//                         </TableContainer>
//                     </InfiniteScroll>
//                 </motion.div>
//             )}
//         </Container>
//     );
// };

// export default Home;


import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { fetchComments, moderateComments } from "../api";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";
import "../styles/Home.css";

const Home = () => {
    const [url, setUrl] = useState("");
    const [flaggedComments, setFlaggedComments] = useState([]);
    const [visibleComments, setVisibleComments] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Home Component Mounted!");
    }, []);

    useEffect(() => {
        console.log("React State Updated: Flagged Comments →", flaggedComments);
        setVisibleComments(flaggedComments.slice(0, 10));
        setHasMore(flaggedComments.length > 10);
    }, [flaggedComments]);

    const handleSubmit = async () => {
        console.log("URL Submitted:", url);
        if (!url) {
            console.error("No URL provided!");
            return;
        }

        setLoading(true);
        try {
            await fetchComments(url);
            const response = await moderateComments(url);
            console.log("Moderation API Response:", response);

            if (response && Array.isArray(response.flagged_comments)) {
                setFlaggedComments(response.flagged_comments);
                console.log("Flagged Comments Updated:", response.flagged_comments);
            } else {
                console.warn("No flagged comments returned!");
            }
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMoreComments = () => {
        const nextBatch = flaggedComments.slice(visibleComments.length, visibleComments.length + 10);
        setVisibleComments(prev => [...prev, ...nextBatch]);

        if (visibleComments.length + 10 >= flaggedComments.length) {
            setHasMore(false);
        }
    };

    /**
     * Generates a direct link to the comment on YouTube
     */
    // const generateYouTubeCommentLink = (videoUrl, commentId) => {
    //     if (!videoUrl || !commentId) {
    //         console.warn("Missing videoUrl or commentId", { videoUrl, commentId });
    //         return "#"; // Default placeholder
    //     }
    
    //     try {
    //         const urlObj = new URL(videoUrl);
    //         let videoId = "";
    
    //         if (urlObj.hostname.includes("youtube.com")) {
    //             if (urlObj.pathname.includes("/shorts/")) {
    //                 // Extract Shorts ID
    //                 videoId = urlObj.pathname.split("/shorts/")[1].split("?")[0];
    //             } else {
    //                 // Extract Video ID from regular YouTube link
    //                 videoId = urlObj.searchParams.get("v");
    //             }
    //         } else if (urlObj.hostname.includes("youtu.be")) {
    //             // Extract Video ID from shortened YouTube link
    //             videoId = urlObj.pathname.substring(1);
    //         }
    
    //         if (!videoId) {
    //             console.error("Failed to extract videoId from:", videoUrl);
    //             return "#"; // Return placeholder if invalid
    //         }
    
    //         // Generate the YouTube comment report link
    //         const reportUrl = `https://www.youtube.com/watch?v=${videoId}&lc=${commentId}`;
    //         console.log("Generated YouTube Comment URL:", reportUrl);
    //         return reportUrl;
    //     } catch (error) {
    //         console.error("Error generating YouTube link:", error);
    //         return "#";
    //     }
    // };

    const generateYouTubeCommentLink = (videoId, commentId) => {
        if (!videoId || !commentId) {
            console.warn("Missing videoId or commentId", { videoId, commentId });
            return "#"; // Default placeholder
        }
    
        try {
            console.log("Generating YouTube Link:", { videoId, commentId });
    
            // Construct valid YouTube comment link
            const reportUrl = `https://www.youtube.com/watch?v=${videoId}&lc=${commentId}`;
            console.log("Generated YouTube Comment URL:", reportUrl);
            return reportUrl;
        } catch (error) {
            console.error("Error generating YouTube link:", error);
            return "#";
        }
    };
    
    

    return (
        <Container className="home-container">
            <h2 className="title">
                Moderate YouTube Comments <br /> <span>with the Power of AI</span>
            </h2>

            <Box className="input-container">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Paste YouTube video link here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="input-field"
                />
                <Button variant="contained" className="moderate-button" onClick={handleSubmit}>
                    Moderate
                </Button>
            </Box>

            {loading && (
                <motion.div className="loading-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <CircularProgress color="inherit" />
                </motion.div>
            )}

            {flaggedComments.length > 0 && (
                <motion.div className="comments-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="comments-title">Flagged Comments</h3>
                    <InfiniteScroll
                        dataLength={visibleComments.length}
                        next={fetchMoreComments}
                        hasMore={hasMore}
                        loader={<p className="loading-text">Loading more comments...</p>}
                        height={300}
                    >
                        <TableContainer component={Paper} className="scrollable-table">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="table-header">Author</TableCell>
                                        <TableCell className="table-header">Comment</TableCell>
                                        <TableCell className="table-header">Flagged Reason</TableCell>
                                        <TableCell className="table-header">Report</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleComments.map((comment, index) => {
                                        const isShort = url.includes("shorts"); // Detect Shorts
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{comment?.id || "Unknown"}</TableCell>
                                                <TableCell>{comment?.text || "No text available"}</TableCell>
                                                <TableCell>{comment?.flagged_reason || "Not specified"}</TableCell>
                                                <TableCell>
                                                    {comment?.comment_id && comment?.video_id ? (
                                                        <a
                                                            href={generateYouTubeCommentLink(comment.video_id, comment.comment_id, isShort)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="report-button"
                                                        >
                                                            Report on YouTube
                                                        </a>
                                                    ) : (
                                                        <span style={{ color: "gray", fontStyle: "italic" }}>No ID</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </InfiniteScroll>
                </motion.div>
            )}
        </Container>
    );
};

export default Home;

