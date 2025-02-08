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
        console.log("🔄 React State Updated: Flagged Comments →", flaggedComments);
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
                                    {visibleComments.map((comment, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{comment?.id || "Unknown"}</TableCell>
                                            <TableCell>{comment?.text || "No text available"}</TableCell>
                                            <TableCell>{comment?.flagged_reason || "Not specified"}</TableCell>
                                        </TableRow>
                                    ))}
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

