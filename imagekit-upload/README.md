# ImageKit Upload Bundle for Maharashtra Sepaktakraw (MSTA)

This folder contains all the official, production-ready image assets for the Maharashtra Sepaktakraw Association website.

## How to Upload to ImageKit

1. Log into your [ImageKit.io Dashboard](https://imagekit.io/dashboard).
2. Go to **Media Library**.
3. Upload this entire `imagekit-upload` folder (or its subfolders: `logos`, `players`, `hero`, `official`).
4. Note your **URL-endpoint** from ImageKit dashboard (e.g. `https://ik.imagekit.io/your_id`).
5. In your `.env.local` or Vercel Environment Variables, set:
   ```bash
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
   ```
   *(Or `NEXT_PUBLIC_CDN_URL=https://ik.imagekit.io/your_id`)*

## Automatic Local Fallback
The application uses `lib/cdn-image.ts`. If `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` is empty or not set, the application will automatically serve images locally from the `public/` folder. Once you upload to ImageKit and set the environment variable, all images immediately route through ImageKit's global CDN with zero code changes!
