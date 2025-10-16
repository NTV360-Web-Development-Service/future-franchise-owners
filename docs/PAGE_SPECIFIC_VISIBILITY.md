# Page-Specific Visibility for Navbar & Footer

## Overview

You can now control exactly which pages show the global navbar and footer! Choose to show them on all pages, only on specific pages, or hide them on specific pages.

## How It Works

### Three Visibility Modes:

1. **Show on All Pages** (default)
   - Navbar/Footer appears on every page
2. **Show on Specific Pages**
   - Choose which pages should have the navbar/footer
   - All other pages won't show it
3. **Hide on Specific Pages**
   - Choose which pages should NOT have the navbar/footer
   - All other pages will show it

## Configuration

### For Navbar:

1. Go to **Globals → Site Settings → Navbar** tab
2. Find the **"Navbar Visibility"** dropdown
3. Select your visibility mode:
   - `Show on All Pages` - Default, shows everywhere
   - `Show on Specific Pages` - Only show on pages you select
   - `Hide on Specific Pages` - Hide on pages you select
4. If you chose a specific mode, the **"Navbar Pages"** field appears
5. Select the pages from the dropdown
6. Save

### For Footer:

1. Go to **Globals → Site Settings → Footer** tab
2. Find the **"Footer Visibility"** dropdown
3. Select your visibility mode
4. Select pages in the **"Footer Pages"** field if applicable
5. Save

## Use Cases

### Landing Page Without Navigation

**Goal**: Create an immersive landing page without navbar/footer

**Setup**:

```
Navbar Visibility: "Hide on Specific Pages"
Navbar Pages: Select "Landing Page"

Footer Visibility: "Hide on Specific Pages"
Footer Pages: Select "Landing Page"
```

**Result**: Landing page has no nav/footer, all other pages have them

---

### Admin-Only Pages

**Goal**: Show navbar/footer only on public pages, not admin pages

**Setup**:

```
Navbar Visibility: "Show on Specific Pages"
Navbar Pages: Select "Home", "About", "Contact", etc. (all public pages)

Footer Visibility: "Show on Specific Pages"
Footer Pages: Select "Home", "About", "Contact", etc.
```

**Result**: Only selected pages have nav/footer

---

### Full-Screen Experience

**Goal**: Create a distraction-free experience for specific pages

**Setup**:

```
Navbar Visibility: "Hide on Specific Pages"
Navbar Pages: Select "Franchise Showcase", "Video Gallery"

Footer Visibility: "Hide on Specific Pages"
Footer Pages: Select "Franchise Showcase", "Video Gallery"
```

**Result**: Selected pages are full-screen, others have nav/footer

---

### Blog Section Only

**Goal**: Show navbar/footer only on blog-related pages

**Setup**:

```
Navbar Visibility: "Show on Specific Pages"
Navbar Pages: Select all blog pages

Footer Visibility: "Show on Specific Pages"
Footer Pages: Select all blog pages
```

**Result**: Nav/footer only visible on blog pages

## How It Works Technically

### URL Matching

The system matches pages based on their **slug** field:

- `"/"` maps to slug `"landing-page"`
- `"/about"` maps to slug `"about"`
- `"/franchises"` maps to slug `"franchises"`

### Logic Flow:

1. **Published Check**: Is navbar/footer published globally?
2. **Visibility Check**: What's the visibility mode?
3. **Page Match**: Does current page match selected pages?
4. **Render Decision**: Show or hide based on the above

### Examples:

**Show on Specific Pages**:

```
IF visibility = "include" AND current page IN selected pages
  → SHOW
ELSE
  → HIDE
```

**Hide on Specific Pages**:

```
IF visibility = "exclude" AND current page IN selected pages
  → HIDE
ELSE
  → SHOW
```

## Priority Order

The system checks conditions in this order:

1. **Published Toggle** - If unpublished, never shows (even if page matches)
2. **Visibility Mode** - Determines the logic to use
3. **Page Selection** - Which pages to include/exclude
4. **Current Page** - Matches against the current URL

## Examples

### Example 1: Marketing Landing Page

**Scenario**: You have a special landing page for a campaign and want it to be distraction-free.

**Configuration**:

```
Navbar:
  Published: ✅
  Visibility: "Hide on Specific Pages"
  Pages: ["campaign-landing"]

Footer:
  Published: ✅
  Visibility: "Hide on Specific Pages"
  Pages: ["campaign-landing"]
```

**Result**:

- `/campaign-landing` → No nav/footer
- All other pages → Has nav/footer

---

### Example 2: Members-Only Section

**Scenario**: You want navbar/footer only on the members area.

**Configuration**:

```
Navbar:
  Published: ✅
  Visibility: "Show on Specific Pages"
  Pages: ["members-dashboard", "members-profile", "members-settings"]

Footer:
  Published: ✅
  Visibility: "Show on Specific Pages"
  Pages: ["members-dashboard", "members-profile", "members-settings"]
```

**Result**:

- Members pages → Has nav/footer
- All other pages → No nav/footer

---

### Example 3: Public Site with Admin Section

**Scenario**: Hide nav/footer from admin pages only.

**Configuration**:

```
Navbar:
  Published: ✅
  Visibility: "Hide on Specific Pages"
  Pages: ["admin-dashboard", "admin-settings", "admin-users"]

Footer:
  Published: ✅
  Visibility: "Hide on Specific Pages"
  Pages: ["admin-dashboard", "admin-settings", "admin-users"]
```

**Result**:

- Admin pages → No nav/footer
- Public pages → Has nav/footer

## Tips & Best Practices

### ✅ Do:

- Use "Show on All Pages" for standard websites
- Use "Hide on Specific Pages" when you have 1-2 special pages
- Use "Show on Specific Pages" when you have multiple distinct sections
- Test on different pages after configuration
- Document which pages have custom visibility

### ❌ Don't:

- Don't select too many pages in "Show on Specific" mode (use "Hide on Specific" instead)
- Don't forget to save after changing settings
- Don't unpublish nav/footer thinking visibility will still work (unpublished always hides)
- Don't confuse page slugs with URLs

## Troubleshooting

**Navbar/Footer not showing on expected pages?**

1. Check "Published" is checked
2. Verify "Visibility" mode is correct
3. Check if current page is in selected pages
4. Check page slug matches the URL path

**Navbar/Footer showing on pages it shouldn't?**

1. Check if you selected the right visibility mode
2. Verify the correct pages are selected
3. Make sure you saved settings

**Can't find a page in the dropdown?**

1. Make sure the page exists in **Collections → Pages**
2. Check if the page has a slug
3. Refresh the admin panel

## Visual Guide

### Visibility Matrix:

| Mode        | No Pages Selected | Page A Selected | Current Page is A |
| ----------- | ----------------- | --------------- | ----------------- |
| **All**     | Show              | Show            | Show              |
| **Include** | Hide              | Show on A only  | Show              |
| **Exclude** | Show              | Hide on A only  | Hide              |

## Files

**Configuration**: `src/globals/SiteSettings.ts`
**Logic**: `src/lib/shouldShowOnPage.ts`
**Component**: `src/components/GlobalNavigation.tsx`
**Layout**: `src/app/(frontend)/layout.tsx`

---

Now you have complete control over where your navbar and footer appear! 🎯
