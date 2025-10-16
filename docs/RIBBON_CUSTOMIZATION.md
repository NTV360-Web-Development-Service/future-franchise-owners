# Ribbon/Ticker Block - Advanced Customization Guide

## Overview

The Ribbon Block is now a **fully customizable** announcement banner with extensive styling and animation controls. No more limited color presets - you have complete control over appearance and behavior!

## Features

✅ **Custom Colors** - Hex color picker for text and background  
✅ **Typography Control** - Adjustable font size (10-32px) and weight (300-800)  
✅ **Animation Toggle** - Enable/disable scrolling ticker  
✅ **Speed Control** - Adjust animation speed (10-200)  
✅ **Text Alignment** - Left, center, or right alignment for static text  
✅ **Clickable Links** - Optional click-through with new tab support  
✅ **Dismissible** - Users can close the ribbon

---

## Configuration Options

### 1. **Text Content**

- **Required**: Yes
- **Example**: `"🎉 Special Offer: 50% Off First Month!"`
- **Tip**: Use emojis to make it eye-catching

### 2. **Background Color** 🎨

- **Type**: Hex color picker + text input
- **Default**: `#2563eb` (blue)
- **Examples**:
  - Brand blue: `#2563eb`
  - Alert red: `#dc2626`
  - Success green: `#16a34a`
  - Warning yellow: `#eab308`
  - Premium purple: `#9333ea`
  - Energetic orange: `#ea580c`
- **Tip**: Click the color square to use the visual picker, or type hex codes directly

### 3. **Text Color** 🎨

- **Type**: Hex color picker + text input
- **Default**: `#ffffff` (white)
- **Examples**:
  - White: `#ffffff`
  - Black: `#000000`
  - Light gray: `#f3f4f6`
  - Dark gray: `#1f2937`
- **Tip**: Ensure good contrast for readability (use white on dark backgrounds, black on light)

### 4. **Font Size**

- **Range**: 10-32 pixels
- **Default**: `14px`
- **Recommendations**:
  - Subtle: `12px`
  - Normal: `14px`
  - Prominent: `16-18px`
  - Bold statement: `20-24px`
  - Hero announcement: `28-32px`

### 5. **Font Weight**

- **Options**:
  - Light (300) - Elegant, minimal
  - Normal (400) - Standard readability
  - Medium (500) - Slightly emphasized
  - Semibold (600) - Noticeable weight
  - Bold (700) - Strong emphasis
  - Extrabold (800) - Maximum impact
- **Default**: `Normal (400)`
- **Tip**: Use bold weights (600-800) for important announcements

### 6. **Is Moving** 🎬

- **Type**: Checkbox (on/off)
- **Default**: `✅ Enabled`
- **When Enabled**: Text scrolls continuously (ticker/marquee effect)
- **When Disabled**: Text is static with alignment control
- **Use Cases**:
  - ✅ Moving: Long messages, dynamic feel, grabbing attention
  - ⬜ Static: Short messages, formal tone, better readability

### 7. **Speed** 🏃

- **Range**: 10-200
- **Default**: `30`
- **Only applies when**: Is Moving = ✅ Enabled
- **Examples**:
  - Slow crawl: `10-20`
  - Normal scroll: `30-50`
  - Fast ticker: `60-100`
  - Rapid flash: `100-200`
- **Tip**: Slower speeds are more readable, faster speeds grab attention

### 8. **Text Align** 📐

- **Options**: Left, Center, Right
- **Default**: `Center`
- **Only applies when**: Is Moving = ⬜ Disabled
- **Use Cases**:
  - Left: Menu-style announcements
  - Center: Formal notices, centered hero text
  - Right: RTL languages, design balance

### 9. **Link** 🔗

- **Optional**: Yes
- **Fields**:
  - **URL**: Where to navigate (e.g., `/promotions` or `https://example.com`)
  - **Open in New Tab**: Checkbox for external links
- **Tip**: Makes the entire ribbon clickable

### 10. **Dismissible** ✖️

- **Type**: Checkbox
- **Default**: `✅ Enabled`
- **When Enabled**: Shows close button (X) on the right
- **When Disabled**: Ribbon cannot be closed
- **Tip**: Disable for critical announcements users must see

---

## Example Configurations

### 1. **Flash Sale Announcement** (Moving)

```
Text: "⚡ FLASH SALE: 50% OFF ALL FRANCHISES - TODAY ONLY! ⚡"
Background Color: #dc2626 (red)
Text Color: #ffffff (white)
Font Size: 16px
Font Weight: Bold (700)
Is Moving: ✅ Enabled
Speed: 50
Link: /promotions
Dismissible: ✅ Enabled
```

### 2. **Professional Notice** (Static)

```
Text: "New Franchise Opportunities Available in Your Area"
Background Color: #1e40af (dark blue)
Text Color: #ffffff (white)
Font Size: 14px
Font Weight: Medium (500)
Is Moving: ⬜ Disabled
Text Align: Center
Link: /franchises
Dismissible: ✅ Enabled
```

### 3. **Urgent Alert** (Fast Moving)

```
Text: "🚨 LIMITED TIME: Register Now to Secure Your Spot! 🚨"
Background Color: #ea580c (orange)
Text Color: #000000 (black)
Font Size: 18px
Font Weight: Extrabold (800)
Is Moving: ✅ Enabled
Speed: 80
Link: /register
Dismissible: ⬜ Disabled
```

### 4. **Subtle Info Banner** (Static)

```
Text: "We use cookies to improve your experience"
Background Color: #f3f4f6 (light gray)
Text Color: #1f2937 (dark gray)
Font Size: 12px
Font Weight: Normal (400)
Is Moving: ⬜ Disabled
Text Align: Center
Dismissible: ✅ Enabled
```

### 5. **Event Countdown** (Moving)

```
Text: "⏰ WEBINAR STARTS IN 2 HOURS - Don't Miss Out! Register Now ⏰"
Background Color: #9333ea (purple)
Text Color: #ffffff (white)
Font Size: 16px
Font Weight: Semibold (600)
Is Moving: ✅ Enabled
Speed: 40
Link: /events/webinar
Dismissible: ✅ Enabled
```

---

## Design Tips

### Color Combinations (High Contrast)

**Professional & Trustworthy:**

- Background: `#1e40af` (navy blue) + Text: `#ffffff` (white)
- Background: `#0f172a` (slate) + Text: `#f8fafc` (light)

**Attention-Grabbing:**

- Background: `#dc2626` (red) + Text: `#ffffff` (white)
- Background: `#ea580c` (orange) + Text: `#000000` (black)

**Success & Positive:**

- Background: `#16a34a` (green) + Text: `#ffffff` (white)
- Background: `#059669` (emerald) + Text: `#f0fdf4` (light green)

**Warning & Caution:**

- Background: `#eab308` (yellow) + Text: `#000000` (black)
- Background: `#f59e0b` (amber) + Text: `#78350f` (brown)

**Premium & Luxurious:**

- Background: `#7c3aed` (violet) + Text: `#ffffff` (white)
- Background: `#000000` (black) + Text: `#fbbf24` (gold)

### Animation Best Practices

**Use Moving Ticker When:**

- Message is longer than viewport width
- You want to create urgency/excitement
- Multiple pieces of information to display
- Targeting younger/tech-savvy audience

**Use Static Text When:**

- Message is short and fits on screen
- Professional/corporate context
- Accessibility is a priority
- Message requires careful reading

**Speed Guidelines:**

- **10-20**: Legal notices, terms updates
- **30-50**: Standard promotions, announcements
- **60-100**: Flash sales, urgent alerts
- **100-200**: Event countdowns, breaking news

### Typography Guidelines

**Font Size by Context:**

- **10-12px**: Cookie notices, disclaimers
- **14-16px**: Standard announcements
- **18-22px**: Important promotions
- **24-32px**: Hero announcements, major events

**Font Weight by Urgency:**

- **300-400**: Informational, low priority
- **500-600**: Standard announcements
- **700-800**: Urgent, high-priority messages

---

## Technical Details

### Color Picker Component

The ribbon uses a custom `ColorPickerField` component that provides:

- **Visual Picker**: Native HTML5 color input (click the color square)
- **Text Input**: Manual hex code entry (e.g., `#2563eb`)
- **Real-time Preview**: See colors as you type

### Conditional Fields

The admin interface shows/hides fields based on configuration:

- **Speed field**: Only visible when "Is Moving" is enabled
- **Text Align field**: Only visible when "Is Moving" is disabled

This keeps the interface clean and prevents confusion!

### Accessibility

The ribbon includes:

- Proper color contrast (ensure manually)
- Dismissible close button with `aria-label`
- Keyboard-accessible dismiss functionality
- Smooth animations that respect user preferences

---

## Troubleshooting

**Problem**: Color picker not showing

- **Solution**: Make sure you're using Payload CMS 3.x+. The custom field component requires the new field API.

**Problem**: Colors look wrong

- **Solution**: Ensure hex codes start with `#` (e.g., `#ff0000` not `ff0000`)

**Problem**: Text unreadable

- **Solution**: Check color contrast. Use light text on dark backgrounds, dark text on light backgrounds.

**Problem**: Ticker not moving

- **Solution**: Verify "Is Moving" is checked. Speed field only appears when moving is enabled.

**Problem**: Text cut off

- **Solution**: Increase font size or reduce font weight. Also check if moving is enabled (static text respects width).

---

## Files Modified

- **Config**: `src/collections/Pages.tsx` (Ribbon block fields)
- **Component**: `src/components/blocks/RibbonBlock.tsx` (Rendering logic)
- **Custom Field**: `src/collections/fields/ColorPickerField.tsx` (Color picker UI)

---

## Quick Reference

| Setting          | Type    | Default   | Range/Options                |
| ---------------- | ------- | --------- | ---------------------------- |
| Text             | String  | Required  | Any text                     |
| Background Color | Hex     | `#2563eb` | `#000000` - `#ffffff`        |
| Text Color       | Hex     | `#ffffff` | `#000000` - `#ffffff`        |
| Font Size        | Number  | `14`      | `10` - `32` px               |
| Font Weight      | Select  | `400`     | 300, 400, 500, 600, 700, 800 |
| Is Moving        | Boolean | `true`    | true/false                   |
| Speed            | Number  | `30`      | `10` - `200`                 |
| Text Align       | Select  | `center`  | left, center, right          |
| Link URL         | String  | Optional  | Any URL                      |
| Open in New Tab  | Boolean | `false`   | true/false                   |
| Dismissible      | Boolean | `true`    | true/false                   |

---

**Pro Tip**: Save your favorite color combinations in a separate document for quick reuse! Brand consistency is key. 🎨
