# 🎨 Ribbon Block - Quick Reference

## Configuration Fields

| Field                | Type      | Default   | Description                      |
| -------------------- | --------- | --------- | -------------------------------- |
| **Text**             | String    | Required  | Message to display               |
| **Background Color** | Hex Color | `#2563eb` | Background color (blue)          |
| **Text Color**       | Hex Color | `#ffffff` | Text color (white)               |
| **Font Size**        | Number    | `14`      | Size in pixels (10-32)           |
| **Font Weight**      | Select    | `400`     | Weight (300-800)                 |
| **Is Moving**        | Boolean   | `true`    | Enable ticker animation          |
| **Speed**            | Number    | `30`      | Animation speed (10-200) \*      |
| **Text Align**       | Select    | `center`  | Alignment (left/center/right) \* |
| **Link URL**         | String    | Optional  | Make ribbon clickable            |
| **Open in New Tab**  | Boolean   | `false`   | Link behavior                    |
| **Dismissible**      | Boolean   | `true`    | Show close button                |
| **Published**        | Boolean   | `true`    | Show on frontend                 |

\* _Conditional: Speed shows when Is Moving = true, Text Align shows when Is Moving = false_

---

## Popular Color Combinations

### Alert/Urgent

```
Background: #dc2626 (red)
Text: #ffffff (white)
Font Weight: 700 (bold)
```

### Success/Positive

```
Background: #16a34a (green)
Text: #ffffff (white)
Font Weight: 600 (semibold)
```

### Info/Professional

```
Background: #2563eb (blue)
Text: #ffffff (white)
Font Weight: 500 (medium)
```

### Warning

```
Background: #eab308 (yellow)
Text: #000000 (black)
Font Weight: 700 (bold)
```

### Premium

```
Background: #7c3aed (purple)
Text: #ffffff (white)
Font Weight: 600 (semibold)
```

---

## Speed Guide

| Value   | Speed     | Use Case                      |
| ------- | --------- | ----------------------------- |
| 10-20   | Very Slow | Legal notices, important info |
| 30-50   | Normal    | Standard announcements        |
| 60-100  | Fast      | Promotions, sales             |
| 100-200 | Very Fast | Urgent alerts, breaking news  |

---

## Font Size Guide

| Value | Size   | Use Case                         |
| ----- | ------ | -------------------------------- |
| 10-12 | Small  | Cookie notices, disclaimers      |
| 14-16 | Normal | Standard announcements           |
| 18-22 | Large  | Important promotions             |
| 24-32 | Hero   | Major events, hero announcements |

---

## Quick Tips

✅ **Use high contrast** - Light text on dark background or vice versa  
✅ **Bold for urgency** - Use weight 700-800 for important messages  
✅ **Slow for readability** - Speed 30-50 for long messages  
✅ **Static for formal** - Disable "Is Moving" for professional contexts  
✅ **Center align static** - Center alignment works best for short messages

---

## Common Hex Colors

| Color  | Hex Code  |
| ------ | --------- |
| Red    | `#dc2626` |
| Orange | `#ea580c` |
| Yellow | `#eab308` |
| Green  | `#16a34a` |
| Blue   | `#2563eb` |
| Purple | `#9333ea` |
| Pink   | `#ec4899` |
| Black  | `#000000` |
| White  | `#ffffff` |
| Gray   | `#6b7280` |

---

**Need more help?** See `RIBBON_CUSTOMIZATION.md` for detailed examples!
