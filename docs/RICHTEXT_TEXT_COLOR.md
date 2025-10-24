# How to Add Text Color to RichText

## Overview

Text color is now supported in your richtext fields! Since Payload CMS's Lexical editor doesn't have a built-in color picker UI, you can add colored text by **pasting HTML with inline styles**.

## Method 1: Paste Formatted HTML (Easiest)

### Step 1: Create Your Colored Text in HTML

You can create HTML with colored text anywhere (in your code editor, or use this template):

```html
<span style="color: #ff0000;">This text is red</span>
<span style="color: #0066cc;">This text is blue</span>
<span style="color: #00aa00;">This text is green</span>
<span style="background-color: #ffff00;">This has a yellow background</span>
<span style="color: #ff6600; font-weight: bold;">This is orange and bold</span>
```

### Step 2: Copy and Paste into RichText Editor

1. Go to your Payload admin panel
2. Open any richtext field (Franchise description, Agent bio, Page hero subheading)
3. **Paste the HTML directly** into the editor
4. The HTMLConverter feature will automatically parse the HTML and preserve the colors

### Step 3: Save and View

The colors will be preserved and displayed on the frontend!

## Method 2: Use Developer Tools

### Step 1: Write Normal Text First

Type your text in the richtext editor as usual:

```
This is my important announcement!
```

### Step 2: Inspect the Database JSON (Advanced)

After saving, you can edit the JSON in the database to add inline styles to specific text nodes:

```json
{
  "type": "text",
  "text": "important",
  "style": "color: #ff0000; font-weight: bold;"
}
```

## Supported Inline Styles

The `RichTextRenderer` component supports all standard CSS inline styles:

### Text Color

```html
<span style="color: #ff0000;">Red text</span>
<span style="color: rgb(255, 0, 0);">Red text (RGB)</span>
<span style="color: red;">Red text (named color)</span>
```

### Background Color

```html
<span style="background-color: #ffff00;">Highlighted text</span>
```

### Font Size

```html
<span style="font-size: 24px;">Larger text</span> <span style="font-size: 14px;">Smaller text</span>
```

### Font Weight

```html
<span style="font-weight: bold;">Bold text</span> <span style="font-weight: 300;">Light text</span>
```

### Multiple Styles Combined

```html
<span style="color: #0066cc; font-size: 20px; font-weight: bold;"> Blue, large, bold text </span>
```

## Example Use Cases

### 1. Highlight Important Information

```html
As an Amazing Athletes owner, you'll introduce children to sports with programs designed for a
<span style="color: #ff6600; font-weight: bold;">wide range of settings</span>, including
after-school programs, daycares, summer camps, and birthday parties.
```

### 2. Color-Coded Categories

```html
We offer franchises in: <span style="color: #0066cc;">Food & Beverage</span>,
<span style="color: #00aa00;">Health & Wellness</span>,
<span style="color: #ff6600;">Home Services</span>
```

### 3. Highlighted Call-to-Action

```html
<span style="background-color: #ffff00; padding: 2px 6px;">
  Limited time offer: 50% off franchise fees!
</span>
```

## How It Works on Frontend

The `RichTextRenderer` component (`src/components/RichTextRenderer.tsx`) automatically:

1. ✅ **Parses inline styles** from text nodes and span elements
2. ✅ **Converts CSS properties** from kebab-case to camelCase for React
3. ✅ **Applies styles safely** using React's style prop
4. ✅ **Preserves all formatting** including colors, sizes, backgrounds

### Code Example

```tsx
// The renderer automatically handles this:
{
  "type": "text",
  "text": "colored text",
  "style": "color: #ff0000; font-weight: bold;"
}

// And converts it to:
<span style={{ color: '#ff0000', fontWeight: 'bold' }}>colored text</span>
```

## Collections with Color Support

Text color is now enabled in:

- ✅ **Franchises** - `description` field
- ✅ **Agents** - `bio` field
- ✅ **Pages** - `hero.subheading` field

## Tips & Best Practices

### 1. Use Hex Colors for Consistency

```html
<!-- ✅ Good -->
<span style="color: #0066cc;">Blue text</span>

<!-- ⚠️ Avoid named colors (inconsistent rendering) -->
<span style="color: blue;">Blue text</span>
```

### 2. Don't Overuse Colors

- Use colors sparingly for emphasis
- Stick to 2-3 colors that match your brand
- Ensure good contrast for accessibility

### 3. Test on Different Backgrounds

- Make sure colored text is readable on your page backgrounds
- Light text on light backgrounds = hard to read
- Dark text on dark backgrounds = hard to read

### 4. Accessible Color Contrast

Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to ensure your colors are accessible:

- **Normal text**: Minimum contrast ratio of 4.5:1
- **Large text**: Minimum contrast ratio of 3:1

## Common Color Codes

Here are some common colors you might want to use:

```html
<!-- Brand Colors -->
<span style="color: #004AAD;">Primary Blue</span>
<span style="color: #FF6600;">Accent Orange</span>

<!-- Status Colors -->
<span style="color: #00AA00;">Success Green</span>
<span style="color: #FF0000;">Error Red</span>
<span style="color: #FFAA00;">Warning Yellow</span>
<span style="color: #0066CC;">Info Blue</span>

<!-- Text Variations -->
<span style="color: #1a1a1a;">Dark Gray (almost black)</span>
<span style="color: #666666;">Medium Gray</span>
<span style="color: #999999;">Light Gray</span>
```

## Future Enhancement: Color Picker UI

If you want a visual color picker in the admin panel, you would need to:

1. Create a custom Lexical plugin with a color picker UI
2. Add it to your editor configuration
3. Handle the color formatting in the editor state

This is an advanced customization beyond the scope of this guide, but the HTML pasting method works great for now!

## Troubleshooting

### Colors Not Showing Up?

1. **Check the HTML format**: Make sure you're using proper inline styles

   ```html
   <!-- ✅ Correct -->
   <span style="color: #ff0000;">Red text</span>

   <!-- ❌ Wrong -->
   <span color="red">Red text</span>
   ```

2. **Verify RichTextRenderer is being used**: Make sure your page components are using the `RichTextRenderer` component, not plain text extraction

3. **Check browser console**: Look for any React errors related to style parsing

### Pasted HTML Not Working?

- Make sure `HTMLConverterFeature` is enabled in your collection config
- Try pasting simpler HTML first to test
- Restart your dev server after config changes

## Example: Complete Colored Text

Here's a complete example you can paste to test:

```html
<p>Welcome to <span style="color: #004AAD; font-weight: bold;">Future Franchise Owners</span>!</p>

<p>We specialize in:</p>
<ul>
  <li><span style="color: #0066cc;">Food & Beverage</span> opportunities</li>
  <li><span style="color: #00aa00;">Health & Wellness</span> franchises</li>
  <li><span style="color: #ff6600;">Home Services</span> businesses</li>
</ul>

<p>
  <span style="background-color: #fff3cd; padding: 4px 8px; border-radius: 4px;">
    💡 Pro Tip: Start with a low-cost franchise to minimize risk!
  </span>
</p>
```

## Need More Help?

- Check `docs/RICHTEXT_INTERLINKS.md` for link functionality
- Review `src/components/RichTextRenderer.tsx` for rendering logic
- Test in the admin panel and view results on your franchise pages
