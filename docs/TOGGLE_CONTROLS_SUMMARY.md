# Toggle Controls Summary

## Overview

You now have complete control over what appears on your site with toggle controls at two levels:

1. **Block Level** - Toggle individual blocks on pages (Hero, CTA, etc.)
2. **Global Level** - Toggle navbar and footer site-wide

## Block Level Toggles

### What: Individual Page Blocks

Every block in your page layouts has a publish/unpublish toggle.

### Where: Inside Each Block

- Location: Block sidebar in Payload CMS
- Available on: Hero, Ribbon, Navbar, CTA, Blog Highlights, Map, About Teaser, Franchise Grid

### How:

1. Edit any page (**Collections → Pages**)
2. Find the block you want to toggle
3. Check/uncheck "Published" in the block's sidebar
4. Save

### Effect:

- ✅ **Checked**: Block visible on that page
- ⬜ **Unchecked**: Block hidden on that page (but saved in CMS)

### Use Cases:

- Seasonal content (hide Black Friday banner after sale)
- A/B testing (swap between two hero sections)
- Staging content (prepare blocks before launch)
- Quick fixes (hide broken block temporarily)

---

## Global Level Toggles

### What: Site-Wide Navbar & Footer

Control whether navbar and footer appear on ALL pages across your entire site.

### Where: Site Settings Global

- Location: **Globals → Site Settings**
- Two toggles:
  - **Published** (in Navbar tab sidebar)
  - **Published** (in Footer tab sidebar)

### How:

1. Go to **Globals → Site Settings**
2. Click **Navbar** tab
3. Check/uncheck "Navbar Enabled" in sidebar
4. Same for **Footer** tab
5. Save

### Effect:

- ✅ **Checked**: Navbar/Footer visible on all pages
- ⬜ **Unchecked**: Navbar/Footer hidden site-wide

### Use Cases:

- Create immersive landing page experiences
- Maintenance mode (hide nav while updating)
- Special events (full-screen experiences)
- Testing layouts without navigation

---

## Comparison

| Feature           | Block Toggle             | Global Toggle        |
| ----------------- | ------------------------ | -------------------- |
| **Scope**         | Single block on one page | All pages site-wide  |
| **Location**      | Inside page block        | Site Settings global |
| **Controls**      | Hero, CTA, Ribbon, etc.  | Navbar & Footer only |
| **Use For**       | Per-page customization   | Site-wide changes    |
| **Configuration** | Saved when unchecked     | Saved when unchecked |

---

## Quick Reference

### Hide a Block on One Page

```
Pages → Edit Page → Find Block → Uncheck "Published" → Save
```

### Hide Navbar Site-Wide

```
Globals → Site Settings → Navbar Tab → Uncheck "Published" → Save
```

### Hide Footer Site-Wide

```
Globals → Site Settings → Footer Tab → Uncheck "Published" → Save
```

---

## Important Notes

✅ **Non-Destructive**: Unchecking preserves all your configuration
✅ **Reversible**: Check the box to bring content back instantly
✅ **No Code Needed**: All done through Payload CMS admin
✅ **Defaults to Visible**: New blocks/settings are published by default

❌ **Not Scheduling**: Toggles are manual, not time-based (for now)
❌ **Not Per-User**: Toggles affect all visitors, not specific users

---

## Example Workflows

### Scenario 1: Seasonal Promotion

**Goal**: Show a holiday banner for 2 weeks

1. Create Ribbon block with "Holiday Sale!" message
2. Leave it **unpublished** until the sale starts
3. When sale starts: Check "Published" → Save
4. When sale ends: Uncheck "Published" → Save
5. Next year: Check "Published" again (content still there!)

### Scenario 2: Maintenance Mode

**Goal**: Work on navbar without showing broken state

1. Go to **Globals → Site Settings → Navbar**
2. Uncheck "Published" → Save
3. Make all your updates to navbar configuration
4. Check "Published" → Save
5. Updated navbar now visible to all!

### Scenario 3: Landing Page Redesign

**Goal**: Test new hero without affecting live site

1. On your landing page, create a new Hero block
2. Keep it **unpublished** while you work
3. Test in preview mode
4. When ready: Unpublish old hero, publish new hero
5. Save - instant swap!

### Scenario 4: Immersive Experience

**Goal**: Create a distraction-free microsite

1. Uncheck **Published** in Navbar tab of Site Settings
2. Uncheck **Published** in Footer tab of Site Settings
3. Save
4. Your entire site now has no nav/footer
5. Perfect for focused landing pages or special campaigns

---

## Troubleshooting

**Block not showing?**

- ✓ Check if "Published" is checked on the block
- ✓ Check if the page is saved
- ✓ Clear browser cache

**Navbar/Footer not showing?**

- ✓ Check "Published" checkbox in Navbar/Footer tab of Site Settings
- ✓ Make sure you saved Site Settings
- ✓ Check that navbar/footer is actually configured (has content)

**Want to schedule toggles?**

- Currently manual only
- For scheduling, you'd need custom development or a cron job
- Consider using a task list as a reminder to toggle manually

---

## Documentation Links

- **Block Toggles**: See `docs/PUBLISHED_UNPUBLISHED_BLOCKS.md`
- **Global Nav/Footer**: See `docs/GLOBAL_NAVBAR_FOOTER.md`
- **Quick Starts**: See `docs/QUICK_START_*.md` files
