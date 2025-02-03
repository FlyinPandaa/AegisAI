import React, {useState} from "react";
import { TextField, Button, Container } from "@mui/material";

const Home = () => {
    const [url, setUrl] = useState("");

    const handleSubmit = () => {
        console.log("URL Submitted:", url);
    };

    return (
        <Container>
            <h2>Enter a YouTube Link</h2>
            <TextField
                label= "YouTube URL"
                variant = "outlined"
                fullwidth
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit} style={{marginTop: "10px"}}>
                Analyze Comments
            </Button>
        </Container>
    );
};

export default Home;