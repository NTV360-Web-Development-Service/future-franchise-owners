# Global Site Settings (Navbar & Footer)

## Overview

The navbar and footer are now managed globally through Payload CMS via the **Site Settings** global configuration. This means you can set them once and they'll appear on all pages automatically. You can also toggle them on/off globally without losing your configuration.

## How It Works

### 1. **Global Configuration**

- Located at: **Admin Panel → Globals → Site Settings**
- Three tabs available:
  - **Navbar** - Configure global navigation + toggle on/off
  - **Footer** - Configure global footer + toggle on/off
  - **General** - Site-wide settings (name, description, contact info)

### 2. **Automatic Rendering**

The navbar and footer are automatically rendered in the frontend layout (`src/app/(frontend)/layout.tsx`). They wrap around all page content, so you don't need to add them to individual pages.

### 3. **Toggle On/Off**

Each tab (Navbar and Footer) has a checkbox in the sidebar to enable/disable globally:

- **Checked ✅**: Navbar/Footer appears on all pages
- **Unchecked ⬜**: Navbar/Footer is hidden site-wide

## Configuration Guide

### Navbar Configuration

Navigate to **Globals → Site Settings → Navbar** tab:

**Sidebar Toggle:**

- **Published**: ✅ Published | ⬜ Unpublished (hidden from all pages)

**Fields:**

- **Logo**: Upload a logo image from media library
- **Logo Text**: Fallback text if no logo is uploaded
- **Links**: Array of navigation links
  - Label (text to display)
  - URL (link destination)
  - Open in New Tab (checkbox)
- **CTA Button**: Call-to-action button
  - Enabled (checkbox to show/hide)
  - Label (button text)
  - URL (button destination)

**Example Setup:**

```
Logo: [Upload your logo.png]
Logo Text: "Future Franchise Owners"

Links:
  - Label: "Home", URL: "/"
  - Label: "Franchises", URL: "/franchises"
  - Label: "About", URL: "/about"
  - Label: "Contact", URL: "/contact"

CTA Button:
  - Enabled: ✓
  - Label: "Get Started"
  - URL: "/contact"
```

### Footer Configuration

Navigate to **Globals → Site Settings → Footer** tab:

**Sidebar Toggle:**

- **Published**: ✅ Published | ⬜ Unpublished (hidden from all pages)

**Fields:**

- **Company Name**: Your company name
- **Tagline**: Brief description/tagline
- **Copyright Text**: Custom copyright (auto-generated if empty)
- **Show Social Links**: Toggle social media section
- **Social Links**: Array of social media links
  - Platform (e.g., "Facebook", "LinkedIn")
  - URL (social profile URL)
  - Icon (emoji or icon character)
- **Footer Columns**: Navigation columns
  - Heading (column title)
  - Links (array of links with label, URL, and open in new tab option)
- **Bottom Links**: Legal/policy links at the bottom
  - Label
  - URL
- **Background Color**: Footer background (hex code)
- **Text Color**: Footer text color (hex code)

**Example Setup:**

```
Company Name: "Future Franchise Owners"
Tagline: "Your partner in franchise success"
Show Social Links: ✓

Social Links:
  - Platform: "LinkedIn", URL: "https://linkedin.com/company/...", Icon: "in"
  - Platform: "Facebook", URL: "https://facebook.com/...", Icon: "f"

Footer Columns:
  Column 1:
    Heading: "Company"
    Links:
      - Label: "About Us", URL: "/about"
      - Label: "Our Team", URL: "/team"
      - Label: "Contact", URL: "/contact"

  Column 2:
    Heading: "Resources"
    Links:
      - Label: "Blog", URL: "/blog"
      - Label: "FAQs", URL: "/faq"
      - Label: "Guides", URL: "/guides"

Bottom Links:
  - Label: "Privacy Policy", URL: "/privacy"
  - Label: "Terms of Service", URL: "/terms"

Background Color: "#0F172A"
Text Color: "#F1F5F9"
```

## Usage in Pages

### Automatic (Recommended)

The navbar and footer are **automatically included** in all frontend pages through the layout. You don't need to do anything - just create your page content and the global navbar/footer will wrap around it.

### Per-Page Override (Advanced)

If you need different navbar/footer for specific pages (e.g., landing pages), you can:

1. Create a custom layout for that specific page
2. Don't include the global navbar/footer in that layout
3. Add custom navbar/footer blocks directly to the page layout in CMS

Example: Create a minimal landing page without global nav/footer by using a custom layout.

## Benefits

✅ **Consistency**: One place to manage navbar/footer across entire site
✅ **Easy Updates**: Change once, applies everywhere
✅ **No Duplication**: No need to add navbar/footer to every page
✅ **Toggle On/Off**: Hide navbar/footer globally without losing configuration
✅ **Flexibility**: Can still override on specific pages if needed
✅ **SEO Friendly**: Consistent navigation structure helps SEO

## Technical Details

**Files:**

- Global Config: `src/globals/SiteSettings.ts`
- Helper Function: `src/lib/getSiteSettings.ts`
- Frontend Layout: `src/app/(frontend)/layout.tsx`
- Navbar Component: `src/components/blocks/NavbarBlock.tsx`
- Footer Component: `src/components/blocks/FooterBlock.tsx`

**Data Flow:**

1. Settings stored in Payload global (`site-settings`)
2. `getSiteSettings()` fetches the data
3. Frontend layout reads settings and renders navbar/footer
4. All pages automatically get navbar/footer wrapped around them

## First-Time Setup

After deploying this update:

1. Navigate to Payload Admin Panel
2. Click **Globals** in the sidebar
3. Click **Site Settings**
4. Configure your **Navbar** tab
5. Configure your **Footer** tab
6. Save changes
7. View any page on your site - navbar and footer should now appear!

## Troubleshooting

**Navbar/Footer not appearing?**

- Make sure you've saved the Site Settings in Payload CMS
- Check that the global is properly configured in `payload.config.ts`
- Verify the layout is using `getSiteSettings()`

**Styling issues?**

- Adjust colors in the Footer tab (background/text colors)
- Customize components in `NavbarBlock.tsx` or `FooterBlock.tsx`

**Need different navbar on specific pages?**

- Create a separate layout file for those pages
- Or add override logic in the frontend layout
