# **App Name**: KalpanaAI: Empowering Artisans

## Core Features:

- Artisan Profile Creation: Enable artisans to sign up and create profiles with location auto-detection, craft type selection, and language preference, generating SEO-optimized profile pages.
- Story Studio: Allow artisans to upload a product photo and short story, then use the story_generator_agent tool (via POST to https://asia-south1-kalpanaai.cloudfunctions.net/generate-story with payload: { 'image_url': await uploadToGCS(file), 'bio': '20 years experience...', 'language': 'hi-IN' }) to generate an emotional product story and AI-enhanced images for marketplace publishing.  Artisans will upload photo -> photo saved to Cloud Storage -> gs:// URL used as input to agent
- Market Pulse: Display hyperlocal demand alerts automatically, such as 'Diwali in Jaipur: 3.2x demand for brass diyas!' with an animated city heatmap powered by the demand_forecaster_agent. Data updates every 6 hours.
- The Muse (Design Co-Pilot): Enable artisans to upload a craft photo and trigger the design_muse_agent to show 3 AI-generated design variations, such as 'Modern geometric diya for urban buyers.' Input = Cloud Storage image URL -> Output = 3 design variants.
- Artisan Circle: Connect artisans with AI-matched mentors, e.g., 'Meera sells 87% more to US buyers,' and provide 1-click video call functionality using the Google Meet API.
- Language Support: Offer a top-right language tab with 20+ Indian languages (Hindi, Tamil, Bengali, etc.) for instant UI translation, including AI outputs, and enable voice input for text fields.
- Marketplace Publishing: Implement a '1-Click Publish' button for publishing the generated story and images to marketplaces like Etsy/Amazon.

## Style Guidelines:

- Primary color: Indigo (#4B0082), inspired by traditional Indian textiles, represents wisdom and trustworthiness.
- Background color: Very light lavender (#F0F8FF), same hue family as the primary, to maintain a clean, digital 'haveli' atmosphere in the app.
- Accent color: Terracotta (#E2725B), an analogous color to indigo, adds a warm, earthy touch.
- Font for headlines: 'Playfair Display' (serif),  creates an elegant, high-end feel; font for body text: 'PT Sans' (sans-serif), which gives a modern look and a little warmth and personality to be readable in paragraphs of text.
- Utilize hand-drawn SVGs for a 'digital haveli' style, incorporating artisan signatures as watermarks and subtle craft tool effects on button hovers (e.g., chisel engraving).
- Implement a glassmorphism UI design with warm colors (terracotta/indigo), ensuring a load time of <1s.
- Use subtle animations with craft tool effects on button hovers, floating craft elements (e.g., animated threads) for page transitions, and evolving Kolam patterns during AI processing waits.