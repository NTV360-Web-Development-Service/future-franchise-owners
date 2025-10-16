# Published/Unpublished Toggle for Blocks

## Overview

Every block in your page layouts now has a **Published/Unpublished** toggle. This allows you to hide blocks from visitors without deleting them, making it easy to temporarily disable content or prepare blocks for future use.

## Features

✅ **Toggle On/Off**: Check or uncheck to publish or unpublish any block
✅ **Non-Destructive**: Blocks remain in your CMS even when unpublished
✅ **Sidebar Position**: The toggle appears in the sidebar for easy access
✅ **Default Published**: New blocks are published by default
✅ **Clear Indicator**: Visual checkmarks show publication status

## How to Use

### Publishing/Unpublishing a Block

1. Open any page in Payload CMS (**Collections → Pages**)
2. Find the block you want to toggle
3. Look for the **Published** checkbox in the block's sidebar
4. **Checked (✅)**: Block is published and visible to visitors
5. **Unchecked (⬜)**: Block is unpublished and hidden from visitors
6. Save the page

### Visual Indicators

In the Payload CMS admin, you'll see:

```
✅ Published | ⬜ Unpublished (hidden from visitors)
```

## Use Cases

### Temporary Content

Hide seasonal or promotional blocks without losing the configuration:

- Holiday banners
- Limited-time offers
- Event announcements

### Staged Rollouts

Prepare blocks in advance and publish them when ready:

- Create a new hero section
- Set up a call-to-action block
- Configure completely
- Leave unpublished until launch day

### A/B Testing

Quickly swap between different versions:

- Create two versions of a block
- Keep one published, one unpublished
- Swap them by toggling published status

### Maintenance

Hide broken or outdated content temporarily:

- Issue with an image? Unpublish the hero block temporarily
- Updating copy? Unpublish while editing
- Re-publish when ready

## Available on All Blocks

The published toggle is available on:

- ✅ Hero Block
- ✅ Ribbon Block
- ✅ Navbar Block
- ✅ Franchise Grid Block
- ✅ About Teaser Block
- ✅ Call to Action Block
- ✅ Blog Highlights Block
- ✅ Map Block
- ✅ Footer Block (if added to pages)

## Technical Details

### How It Works

1. **CMS Side**: Each block has a `published` boolean field (defaults to `true`)
2. **Frontend Side**: The page renderer checks `published` status before rendering
3. **Unpublished blocks**: Return `null` and don't appear in the DOM at all

### Code Implementation

**In the CMS** (`src/collections/Pages.tsx`):

```typescript
{
  name: 'published',
  type: 'checkbox',
  defaultValue: true,
  admin: {
    description: '✅ Published | ⬜ Unpublished (hidden from visitors)',
    position: 'sidebar',
  },
}
```

**In the Frontend** (`src/app/(frontend)/page.tsx`):

```typescript
const renderBlock = (block, index) => {
  // Skip rendering if block is unpublished
  if ('published' in block && block.published === false) {
    return null
  }

  // ... render block normally
}
```

## FAQs

**Q: What happens to unpublished blocks?**
A: They remain in your CMS database but don't appear on the live site. They're completely invisible to visitors.

**Q: Can I see unpublished blocks in the admin?**
A: Yes! In the Payload admin panel, you can see all blocks regardless of their published status. The checkbox shows whether each block is published or not.

**Q: Do unpublished blocks affect SEO?**
A: No. Unpublished blocks don't render any HTML, so they don't impact SEO or page load times.

**Q: What's the default state for new blocks?**
A: New blocks are **published by default** (checked). You need to manually uncheck to unpublish.

**Q: Can I schedule blocks to publish later?**
A: Not automatically (yet). You would need to manually publish them when ready. For scheduling, you'd need to add a custom date field and additional logic.

## Best Practices

### ✅ Do:

- Unpublish blocks when testing new designs
- Use unpublished status for seasonal content that's not yet relevant
- Keep old versions unpublished as backups
- Unpublish broken blocks instead of deleting them

### ❌ Don't:

- Don't delete blocks just to hide them temporarily
- Don't forget you have unpublished blocks when wondering why content isn't showing
- Don't leave critical blocks unpublished by accident

## Difference from Deleting

| Action            | Published Toggle | Delete Block          |
| ----------------- | ---------------- | --------------------- |
| **Visibility**    | Hidden           | Gone                  |
| **Data**          | Preserved        | Lost                  |
| **Reversible**    | ✅ Instant       | ❌ No (must recreate) |
| **Configuration** | Kept             | Lost                  |
| **Use Case**      | Temporary hiding | Permanent removal     |

## Migration Note

If you have existing pages with blocks created before this feature was added, those blocks will default to `published: true` automatically, so they'll continue to display normally.

## Troubleshooting

**Block not showing on the frontend?**

1. Check if the block's "Published" checkbox is checked
2. Make sure you saved the page after making changes
3. Clear your browser cache if needed
4. Check the page is published (not just the block)

**Can't find the Published checkbox?**

- Look in the **sidebar** of each block (not in the main fields area)
- It should be at the top of the sidebar
- If you still can't see it, the feature may not have been deployed yet

## Example Workflow

### Scenario: Updating a Hero Section

1. **Current State**: Hero block is published and live
2. **Create New Version**: Duplicate the hero block
3. **Edit New Version**: Make all your changes to the duplicate
4. **Keep Unpublished**: Leave the new version unchecked (unpublished)
5. **Test in Preview**: Use preview mode to see the unpublished version
6. **Go Live**: When ready:
   - Unpublish the old hero
   - Publish the new hero
   - Save the page
7. **Rollback Ready**: Keep the old version unpublished as a backup

---

This feature gives you maximum flexibility while maintaining your content library! 🎉
