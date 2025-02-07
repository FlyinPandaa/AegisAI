// import React, { useState, useEffect } from "react";
// import { TextField, Button, Container, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
// import { fetchComments, moderateComments } from "../api";
// import InfiniteScroll from "react-infinite-scroll-component";
// import { motion } from "framer-motion";
// import { styled } from "@mui/system";

// // Styled Background Grid
// const BackgroundGrid = styled("div")({
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100vw",
//     height: "100vh",
//     backgroundColor: "#121217",
//     backgroundImage: `
//         linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px), 
//         linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
//     `,
//     backgroundSize: "80px 80px",
//     zIndex: -1,
// });

// // Modern Button Styling
// const ModernButton = styled(Button)({
//     fontFamily: '"Poppins", sans-serif',
//     fontWeight: "bold",
//     textTransform: "none",
//     fontSize: "16px",
//     backgroundColor: "#ffffff",
//     color: "#000000",
//     padding: "12px 20px",
//     borderRadius: "10px",
//     transition: "all 0.3s ease-in-out",
//     "&:hover": {
//         backgroundColor: "#E0E0E0",
//         transform: "scale(1.05)",
//     },
// });

// const Home = () => {
//     const [url, setUrl] = useState("");
//     const [flaggedComments, setFlaggedComments] = useState([]);
//     const [visibleComments, setVisibleComments] = useState([]);
//     const [hasMore, setHasMore] = useState(true);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         console.log("🏠 Home Component Mounted!");
//     }, []);

//     useEffect(() => {
//         console.log("🔄 React State Updated: Flagged Comments →", flaggedComments);
//         setVisibleComments(flaggedComments.slice(0, 10));
//         setHasMore(flaggedComments.length > 10);
//     }, [flaggedComments]);

//     const handleSubmit = async () => {
//         console.log("📩 URL Submitted:", url);

//         if (!url) {
//             console.error("❌ No URL provided!");
//             return;
//         }

//         setLoading(true);

//         try {
//             await fetchComments(url);
//             const response = await moderateComments(url);
//             console.log("✅ Moderation API Response:", response);

//             if (response && Array.isArray(response.flagged_comments)) {
//                 setFlaggedComments(response.flagged_comments);
//                 console.log("🚀 Flagged Comments Updated:", response.flagged_comments);
//             } else {
//                 console.warn("⚠️ No flagged comments returned!");
//             }
//         } catch (error) {
//             console.error("❌ Moderation API Error:", error);
//         }

//         setLoading(false);
//     };

//     const fetchMoreComments = () => {
//         const nextBatch = flaggedComments.slice(visibleComments.length, visibleComments.length + 10);
//         setVisibleComments(prev => [...prev, ...nextBatch]);

//         if (visibleComments.length + 10 >= flaggedComments.length) {
//             setHasMore(false);
//         }
//     };

//     return (
//         <Container 
//             maxWidth="false" 
//             sx={{ 
//                 display: "flex", 
//                 flexDirection: "column", 
//                 alignItems: "center", 
//                 height: "100vh", 
//                 justifyContent: "center",
//                 color: "#ffffff", 
//                 fontFamily: "'Inter', sans-serif",
//                 minWidth: "100vw",
//                 minHeight: "100vh",
//                 position: "relative",
//             }}
//         >
//             <BackgroundGrid />

//             <h2 
//                 style={{ 
//                     fontSize: "5rem", 
//                     fontWeight: "bold", 
//                     textAlign: "center", 
//                     fontFamily: "'Poppins', sans-serif",
//                     lineHeight: "1.2",
//                     marginBottom: "10px"
//                 }}
//             >
//                 Moderate YouTube Comments <br /> with AI
//             </h2>

//             {/* Input Box with Expanded TextField */}
//             <motion.div 
//                 initial={{ opacity: 0, y: -20 }} 
//                 animate={{ opacity: 1, y: 0 }} 
//                 transition={{ duration: 0.5 }}
//             >
//                 <Box
//                     sx={{
//                         width: "100%",
//                         maxWidth: 700,
//                         backgroundColor: "#1E1E24", 
//                         borderRadius: "12px",
//                         boxShadow: 3,
//                         padding: 2,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         gap: 2
//                     }}
//                 >
//                     <TextField
//                         fullWidth
//                         variant="outlined"
//                         placeholder="Paste YouTube video link here..."
//                         value={url}
//                         onChange={(e) => setUrl(e.target.value)}
//                         sx={{ 
//                             flexGrow: 1, 
//                             backgroundColor: "#26262E", 
//                             borderRadius: "6px", 
//                             input: { color: "#fff", fontSize: "16px", fontFamily: "'Poppins', sans-serif" } 
//                         }}
//                     />
//                     <ModernButton onClick={handleSubmit}>
//                         Moderate
//                     </ModernButton>
//                 </Box>
//             </motion.div>

//             {/* Loading Box */}
//             {loading && (
//                 <motion.div 
//                     initial={{ opacity: 0 }} 
//                     animate={{ opacity: 1 }} 
//                     transition={{ duration: 0.3 }}
//                 >
//                     <Box sx={{
//                         width: "100%",
//                         maxWidth: 700,
//                         marginTop: "20px",
//                         backgroundColor: "#1E1E24",
//                         padding: "20px",
//                         borderRadius: "12px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center"
//                     }}>
//                         <CircularProgress color="secondary" />
//                     </Box>
//                 </motion.div>
//             )}

//             {/* Flagged Comments Box */}
//             {flaggedComments.length > 0 && (
//                 <motion.div 
//                     initial={{ opacity: 0, y: 20 }} 
//                     animate={{ opacity: 1, y: 0 }} 
//                     transition={{ duration: 0.5 }}
//                 >
//                     <Box sx={{
//                         width: "100%",
//                         maxWidth: 700,
//                         marginTop: "20px",
//                         backgroundColor: "#1E1E24",
//                         padding: "20px",
//                         borderRadius: "12px",
//                         boxShadow: 3
//                     }}>
//                         <InfiniteScroll
//                             dataLength={visibleComments.length}
//                             next={fetchMoreComments}
//                             hasMore={hasMore}
//                             loader={<CircularProgress color="secondary" />}
//                             style={{ overflowY: "auto", maxHeight: "300px", padding: "10px" }}
//                         >
//                             <TableContainer>
//                                 <Table>
//                                     <TableHead>
//                                         <TableRow>
//                                             <TableCell sx={{ color: "#ffffff" }}>Author</TableCell>
//                                             <TableCell sx={{ color: "#ffffff" }}>Comment</TableCell>
//                                             <TableCell sx={{ color: "#FF6B6B" }}>Flagged Reason</TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {visibleComments.map((comment, index) => (
//                                             <TableRow key={index}>
//                                                 <TableCell sx={{ color: "#ffffff" }}>{comment?.id || "Unknown"}</TableCell>
//                                                 <TableCell sx={{ color: "#ffffff" }}>{comment?.text || "No text available"}</TableCell>
//                                                 <TableCell sx={{ color: "#FF6B6B" }}>{comment?.flagged_reason || "Not specified"}</TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                         </InfiniteScroll>
//                     </Box>
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
        console.log("🏠 Home Component Mounted!");  
    }, []);

    useEffect(() => {
        console.log("🔄 React State Updated: Flagged Comments →", flaggedComments);
        setVisibleComments(flaggedComments.slice(0, 10)); 
        setHasMore(flaggedComments.length > 10);
    }, [flaggedComments]);

    const handleSubmit = async () => {
        console.log("📩 URL Submitted:", url);
        if (!url) {
            console.error("❌ No URL provided!");
            return;
        }

        setLoading(true);
        try {
            await fetchComments(url);
            const response = await moderateComments(url);
            console.log("✅ Moderation API Response:", response); 

            if (response && Array.isArray(response.flagged_comments)) {
                setFlaggedComments(response.flagged_comments);
                console.log("🚀 Flagged Comments Updated:", response.flagged_comments);
            } else {
                console.warn("⚠️ No flagged comments returned!");
            }
        } catch (error) {
            console.error("❌ API Error:", error);
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
                <Button variant="contained" className="analyze-button" onClick={handleSubmit}>
                    Analyze
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
                        height={300} // 🔹 Keeps table inside the box
                    >
                        <TableContainer component={Paper} className="scrollable-table">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Author</TableCell>
                                        <TableCell>Comment</TableCell>
                                        <TableCell>Flagged Reason</TableCell>
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

