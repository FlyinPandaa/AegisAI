import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { fetchComments, moderateComments } from "../api"; // Check if this is correctly imported

const Home = () => {
    const [url, setUrl] = useState("");
    const [flaggedComments, setFlaggedComments] = useState([]);

    // Debugging: Check if the component is being mounted
    useEffect(() => {
        console.log("Home Component Mounted!");  
    }, []);

    // Debugging: Log when flaggedComments updates
    useEffect(() => {
        console.log("React State Updated: Flagged Comments →", flaggedComments);
    }, [flaggedComments]);  // Runs whenever flaggedComments changes

    const handleSubmit = async () => {
        console.log("URL Submitted:", url);

        if (!url) {
            console.error("No URL provided!");
            return;
        }

        try {
            const response = await fetchComments(url);  // Call fetchComments function
            console.log("API Response:", response);  // Log the response from backend
        } catch (error) {
            console.error("API Error:", error);
        }

        try {
            const response = await moderateComments(url);  
            console.log("Moderation API Response:", response); 
    
            if (response && Array.isArray(response.flagged_comments)) {
                setFlaggedComments(response.flagged_comments);
                console.log("Flagged Comments Updated:", response.flagged_comments);
            } else {
                console.warn("No flagged comments returned!");
            }
        } catch (error) {
            console.error("Moderation API Error:", error);
        }

    };

    return (
        <Container>
            <h2>Enter a YouTube Link</h2>
            <TextField
                label="YouTube URL"
                variant="outlined"
                fullWidth
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: "10px" }}>
                Analyze Comments
            </Button>

            {/* Flagged Comments Table */}
            {flaggedComments.length > 0 && (
                <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Author</TableCell>
                                <TableCell>Comment</TableCell>
                                <TableCell>Flagged Reason</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {flaggedComments.map((comment, index) => (
                                <TableRow key={index}>
                                    <TableCell>{comment?.id || "Unknown"}</TableCell>
                                    <TableCell>{comment?.text || "No text available"}</TableCell>
                                    <TableCell>{comment?.flagged_reason || "Not specified"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

        </Container>
    );
};

export default Home;
