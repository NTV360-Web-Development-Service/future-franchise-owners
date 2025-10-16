# Quick Guide: Published/Unpublished Toggle

## What Changed?

✅ Every block now has a **Published** checkbox toggle
✅ Unpublished blocks are hidden from visitors but kept in your CMS
✅ No need to delete blocks just to hide them temporarily

## How to Use

### In Payload CMS:

1. Open a page (**Collections → Pages**)
2. Find any block (Hero, Ribbon, CTA, etc.)
3. Look at the **sidebar** → You'll see "Published" checkbox
4. **Checked ✅** = Visible to visitors
5. **Unchecked ⬜** = Hidden from visitors
6. Save the page

## Benefits

🎯 **No More Deleting**: Hide blocks without losing your work
🎯 **Easy Testing**: Toggle blocks on/off to test different layouts  
🎯 **Seasonal Content**: Prepare holiday banners in advance, publish when ready
🎯 **Quick Rollback**: Keep old versions unpublished as backups

## Example Use Cases

### 1. Seasonal Promotion

```
Create a holiday ribbon banner
→ Leave it unpublished
→ When Black Friday arrives, just check "Published"
→ After the sale, uncheck to hide it
```

### 2. Testing New Design

```
Create new hero section
→ Keep it unpublished
→ Test in preview mode
→ When perfect, publish it and unpublish the old one
```

### 3. Quick Fix

```
Notice a typo in your CTA block
→ Unpublish it temporarily
→ Fix the text
→ Publish it again
```

## Where's the Toggle?

**Location**: Block sidebar (top right area of each block in the CMS)

**Label**: "✅ Published | ⬜ Unpublished (hidden from visitors)"

## What Happens to Unpublished Blocks?

- ✅ Saved in your CMS (not lost)
- ✅ Visible in admin panel
- ❌ NOT visible to website visitors
- ❌ NOT in the page HTML/DOM
- ❌ Does NOT affect SEO or page speed

## Quick Reference

| Status      | Checkbox     | Visible to Visitors? | In CMS? |
| ----------- | ------------ | -------------------- | ------- |
| Published   | ✅ Checked   | Yes                  | Yes     |
| Unpublished | ⬜ Unchecked | No                   | Yes     |
| Deleted     | N/A          | No                   | No      |

---

For full documentation, see: `docs/PUBLISHED_UNPUBLISHED_BLOCKS.md`
