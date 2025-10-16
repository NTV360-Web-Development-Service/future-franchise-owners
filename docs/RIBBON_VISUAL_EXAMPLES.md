# Ribbon Block - Visual Examples

## Color Picker Interface

When editing a ribbon block in Payload CMS, you'll see:

```
┌─────────────────────────────────────────────┐
│ Background Color                            │
│ ┌────┐  ┌──────────────────────────────┐  │
│ │ 🎨 │  │ #2563eb                      │  │
│ └────┘  └──────────────────────────────┘  │
│ ↑        ↑                                  │
│ Click    Or type hex code                  │
│ for                                         │
│ picker                                      │
└─────────────────────────────────────────────┘
```

## Example Renders

### 1. Animated Sale Banner

```
Background: #dc2626 (red)
Text: #ffffff (white)
Font Size: 18px
Font Weight: 700 (bold)
Moving: ✅ Yes
Speed: 60

┌──────────────────────────────────────────────────────────┐
│ 🔥 FLASH SALE: 50% OFF - TODAY ONLY! 🔥  →→→→→→→→→      │
│                                                      [X] │
└──────────────────────────────────────────────────────────┘
   ↑                                                   ↑
   Scrolling animation                               Close
```

### 2. Static Professional Notice

```
Background: #1e40af (dark blue)
Text: #ffffff (white)
Font Size: 14px
Font Weight: 500 (medium)
Moving: ⬜ No
Align: Center

┌──────────────────────────────────────────────────────────┐
│        New Franchise Opportunities Available         [X] │
└──────────────────────────────────────────────────────────┘
              ↑
         Centered text
```

### 3. Urgent Alert (No Close)

```
Background: #ea580c (orange)
Text: #000000 (black)
Font Size: 16px
Font Weight: 800 (extrabold)
Moving: ✅ Yes
Speed: 100
Dismissible: ⬜ No

┌──────────────────────────────────────────────────────────┐
│ 🚨 REGISTRATION CLOSES IN 1 HOUR! 🚨  →→→→→→→→→→→→→→    │
└──────────────────────────────────────────────────────────┘
   ↑                                          ↑
   Fast scrolling                         No close button
```

### 4. Subtle Cookie Notice

```
Background: #f3f4f6 (light gray)
Text: #1f2937 (dark gray)
Font Size: 12px
Font Weight: 400 (normal)
Moving: ⬜ No
Align: Center

┌──────────────────────────────────────────────────────────┐
│        We use cookies to improve your experience     [X] │
└──────────────────────────────────────────────────────────┘
   ↑
   Small, subtle text
```

### 5. Event Countdown

```
Background: #9333ea (purple)
Text: #ffffff (white)
Font Size: 16px
Font Weight: 600 (semibold)
Moving: ✅ Yes
Speed: 40

┌──────────────────────────────────────────────────────────┐
│ ⏰ WEBINAR STARTS IN 2 HOURS - Register Now! ⏰  →→→→ [X]│
└──────────────────────────────────────────────────────────┘
```

## Admin Interface Preview

### Ribbon Block Settings in Payload CMS

```
┌─────────────────────────────────────────────┐
│ □ Ribbon                                    │
│ ────────────────────────────────────────    │
│                                             │
│ Text *                                      │
│ ┌─────────────────────────────────────┐    │
│ │ 🎉 Special Offer!                   │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ Background Color * 🎨                       │
│ ┌───┐  ┌──────────────────────────┐        │
│ │███│  │ #dc2626                  │        │
│ └───┘  └──────────────────────────┘        │
│                                             │
│ Text Color * 🎨                             │
│ ┌───┐  ┌──────────────────────────┐        │
│ │███│  │ #ffffff                  │        │
│ └───┘  └──────────────────────────┘        │
│                                             │
│ Font Size                                   │
│ ┌─────────────┐                            │
│ │ 16          │ (10-32px)                  │
│ └─────────────┘                            │
│                                             │
│ Font Weight                                 │
│ ┌─────────────────────────────┐            │
│ │ Bold (700)             ▼    │            │
│ └─────────────────────────────┘            │
│                                             │
│ ☑ Is Moving                                 │
│                                             │
│ Speed (shows when moving)                   │
│ ┌─────────────┐                            │
│ │ 50          │ (10-200)                   │
│ └─────────────┘                            │
│                                             │
│ Text Align (hidden when moving)             │
│ ┌─────────────────────────────┐            │
│ │ Center                 ▼    │            │
│ └─────────────────────────────┘            │
│                                             │
│ Link (optional)                             │
│   URL                                       │
│   ┌─────────────────────────────────────┐  │
│   │ /promotions                         │  │
│   └─────────────────────────────────────┘  │
│   ☑ Open in New Tab                        │
│                                             │
│ ☑ Dismissible                               │
│                                             │
└─────────────────────────────────────────────┘
```

## Color Contrast Examples

### Good Contrast ✅

```
Dark background + Light text:
#1e40af + #ffffff  ✓ Highly readable
#000000 + #fbbf24  ✓ Gold on black
#7c3aed + #ffffff  ✓ Purple + white

Light background + Dark text:
#f3f4f6 + #1f2937  ✓ Gray on light gray
#fef3c7 + #78350f  ✓ Dark on light yellow
#ffffff + #000000  ✓ Classic black on white
```

### Poor Contrast ❌

```
#eab308 + #ffffff  ✗ Yellow + white (too bright)
#16a34a + #000000  ✗ Green + black (low contrast)
#f3f4f6 + #ffffff  ✗ Light gray + white (invisible)
```

## Animation Speed Guide

```
Speed 10-20 (Slow):
🐌 ─→ "This text moves very slowly..."

Speed 30-50 (Normal):
🚶 ──→ "Standard comfortable reading speed"

Speed 60-100 (Fast):
🏃 ───→ "Quick attention-grabbing movement"

Speed 100-200 (Very Fast):
🚀 ────→ "Ultra-fast ticker for urgency!"
```

## Font Size Comparison

```
10px: Tiny text for disclaimers
12px: Small text for subtle notices
14px: Normal readable text ← Default
16px: Comfortable prominent text
18px: Large attention-grabbing
20px: Very large important announcement
24px: Bold statement
32px: Maximum hero announcement
```

## Font Weight Comparison

```
300 (Light):     Elegant minimal text
400 (Normal):    Standard readable text  ← Default
500 (Medium):    Slightly emphasized
600 (Semibold):  Noticeable weight
700 (Bold):      Strong emphasis
800 (Extrabold): MAXIMUM IMPACT
```

---

**Tip**: Test your ribbon on different screen sizes and with different content lengths to ensure it looks good everywhere!
