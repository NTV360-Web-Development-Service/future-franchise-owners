# Live Preview Feature

Live preview has been successfully integrated into your Payload CMS project. This feature allows you to preview pages in real-time as you edit them in the admin panel.

## How It Works

The live preview feature uses Next.js Draft Mode to show unpublished changes without affecting the production site.

### Key Components

1. **Live Preview Configuration** (`src/collections/Pages.tsx`)
   - Added `livePreview` configuration to the Pages collection
   - Automatically generates preview URLs based on page slugs
   - Homepage uses root path `/`, other pages use `/{slug}`

2. **Preview API Route** (`src/app/api/preview/route.ts`)
   - Handles preview requests from the admin panel
   - Validates requests using `PAYLOAD_SECRET`
   - Enables Next.js Draft Mode for authenticated previews

3. **Draft Mode Support** (Frontend pages)
   - Updated homepage and dynamic pages to fetch draft content
   - Preview shows unpublished changes in real-time

## How to Use

1. **Open a Page in the Admin Panel**
   - Navigate to `/admin/collections/pages`
   - Select any page to edit

2. **Click the Preview Button**
   - Look for the "Preview" button in the top-right corner of the editor
   - Click it to open a live preview in a new tab

3. **Make Changes**
   - Edit any content in the admin panel
   - The preview will automatically update to show your changes
   - Changes are shown in real-time without publishing

4. **Publish When Ready**
   - Once satisfied with your changes, click "Save" or "Publish"
   - The changes will then be visible on the live site

## Environment Variables

The following environment variable is used for live preview:

```env
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
```

**Important:** Update this to your production URL when deploying:

- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

## Features

- ✅ Real-time preview of unpublished changes
- ✅ Works with all page blocks (Hero, Navbar, Franchise Grid, etc.)
- ✅ Secure authentication using Payload secret
- ✅ No impact on production content
- ✅ Automatic URL generation based on page slug

## Technical Details

### Draft Mode

Next.js Draft Mode is used to bypass static generation and show draft content:

- Enabled via `/api/preview` route
- Passes `draft: true` to Payload queries
- Only shows draft content when authenticated

### Security

- Preview requests are validated using `PAYLOAD_SECRET`
- Only authenticated admin users can access previews
- Draft content is never cached or indexed

## Troubleshooting

### Preview button not showing

- Make sure you're logged into the admin panel
- Check that `NEXT_PUBLIC_SERVER_URL` is set correctly

### Preview shows old content

- Clear your browser cache
- Restart the development server
- Check that Draft Mode is enabled (look for a cookie named `__prerender_bypass`)

### Preview URL is incorrect

- Verify `NEXT_PUBLIC_SERVER_URL` in `.env.local`
- For production, update to your actual domain

## Next Steps

Consider adding live preview to other collections:

- Franchises
- Blog posts (if added)
- Landing pages

The same pattern can be applied to any collection that needs preview functionality.
