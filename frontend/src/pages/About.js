// frontend/src/pages/About.jsx
import React from "react";
import { Container, Typography, Box, Grid, Card, CardContent, Divider } from "@mui/material";

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom fontWeight={700}>
        About AegisAI
      </Typography>

      {/* Mission */}
      <Typography variant="h5" gutterBottom mt={4}>
        Our Mission
      </Typography>
      <Typography variant="body1">
        AegisAI empowers digital communities to thrive by providing seamless, AI-powered moderation across platforms. 
        We believe in fostering respectful discourse, reducing toxic content, and simplifying moderation workflows for creators and teams.
      </Typography>

      {/* Story */}
      <Typography variant="h5" gutterBottom mt={4}>
        Our Story
      </Typography>
      <Typography variant="body1">
        Born from the frustration of managing online toxicity with disjointed tools, AegisAI was created as a modern, unified moderation platform.
        Built for developers, creators, and community managers, AegisAI streamlines content filtering and reporting across multiple platforms.
      </Typography>

      {/* Features */}
      <Typography variant="h5" gutterBottom mt={4}>
        What AegisAI Does
      </Typography>
      <Grid container spacing={3} mt={1}>
        {[
          "AI-powered comment filtering",
          "Cross-platform support (YouTube, Reddit, and more)",
          "Customizable moderation rules and dashboards",
          "Fast moderation with Redis caching & batch processing",
          "‘Report to YouTube’ integration",
        ].map((feature, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body1">✅ {feature}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* What Makes AegisAI Unique */}
      <Typography variant="h5" gutterBottom mt={4}>
        Why AegisAI is Different
      </Typography>
      <Typography variant="body1">
        We built AegisAI to be lightning fast and flexible. It’s powered by FastAPI, React, Supabase, Redis, and OpenAI’s Moderation API.
        With Dockerized deployment and an open architecture, it scales from personal use to production-level moderation needs.
      </Typography>

      {/* Audience */}
      <Typography variant="h5" gutterBottom mt={4}>
        Who It's For
      </Typography>
      <Typography variant="body1">
        Whether you're a content creator, a community mod, or a developer integrating moderation into your product — AegisAI is built with you in mind.
      </Typography>

      {/* Call to Action */}
      <Divider sx={{ my: 6 }} />
      <Box textAlign="center">
        <Typography variant="h6">
          Want to learn more or get involved?
        </Typography>
        <Typography variant="body1" mt={1}>
          Check out our GitHub repo or contact us for early access.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
