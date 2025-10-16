# Social Media Icons with Lucide

## Overview

Social media links in the footer now use **Lucide React icons** - beautiful, consistent icons that match your design. No more confusing emoji or manual icon entry!

## How It Works

### In Payload CMS:

1. Go to **Globals → Site Settings → Footer** tab
2. Enable **"Show Social Links"**
3. Click **"Add Social Link"**
4. Select a platform from the dropdown (e.g., "Facebook", "LinkedIn")
5. Enter the URL (e.g., `https://facebook.com/yourpage`)
6. Save

**That's it!** The icon is automatically displayed based on your platform selection.

## Available Platforms & Icons:

| Platform            | Icon           | Notes                  |
| ------------------- | -------------- | ---------------------- |
| **Facebook**        | Facebook icon  | Official Facebook icon |
| **Twitter / X**     | Twitter icon   | Twitter/X bird icon    |
| **Instagram**       | Instagram icon | Instagram camera icon  |
| **LinkedIn**        | LinkedIn icon  | LinkedIn logo          |
| **YouTube**         | YouTube icon   | YouTube play button    |
| **GitHub**          | GitHub icon    | GitHub octocat         |
| **GitLab**          | GitLab icon    | GitLab logo            |
| **Discord**         | Message Circle | Chat bubble icon       |
| **Telegram**        | Send icon      | Paper plane icon       |
| **Slack**           | Slack icon     | Slack hash icon        |
| **WhatsApp**        | Message Circle | Chat bubble icon       |
| **Mail**            | Mail icon      | Envelope icon          |
| **Globe / Website** | Globe icon     | World/globe icon       |
| **TikTok**          | Message Circle | Generic chat icon      |
| **Pinterest**       | Globe          | Globe fallback         |
| **Reddit**          | Message Circle | Generic chat icon      |
| **Twitch**          | Message Circle | Generic chat icon      |

## Example Setup:

### Corporate Website:

```
Social Link 1:
  Platform: LinkedIn
  URL: https://linkedin.com/company/yourcompany

Social Link 2:
  Platform: Twitter / X
  URL: https://twitter.com/yourcompany

Social Link 3:
  Platform: YouTube
  URL: https://youtube.com/@yourcompany
```

### Community-Focused:

```
Social Link 1:
  Platform: Discord
  URL: https://discord.gg/yourcommunity

Social Link 2:
  Platform: Reddit
  URL: https://reddit.com/r/yourcommunity

Social Link 3:
  Platform: Twitch
  URL: https://twitch.tv/yourstream
```

### Developer/Tech:

```
Social Link 1:
  Platform: GitHub
  URL: https://github.com/yourorg

Social Link 2:
  Platform: GitLab
  URL: https://gitlab.com/yourorg

Social Link 3:
  Platform: Slack
  URL: https://yourworkspace.slack.com
```

## Technical Details

### Icon Mapping:

The FooterBlock component automatically maps platform selections to Lucide icons:

```typescript
const SOCIAL_ICONS = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  gitlab: Gitlab,
  mail: Mail,
  globe: Globe,
  discord: MessageCircle,
  telegram: Send,
  slack: Slack,
  whatsapp: MessageCircle,
  // ... etc
}
```

### Rendering:

```tsx
{
  socialLinks.map((social) => {
    const IconComponent = SOCIAL_ICONS[social.platform] || Globe
    return (
      <a href={social.url}>
        <IconComponent className="w-5 h-5" />
      </a>
    )
  })
}
```

## Styling

Icons are styled with:

- **Size**: `w-5 h-5` (20x20px)
- **Opacity**: 70% default, 100% on hover
- **Transition**: Smooth opacity transition
- **Color**: Inherits from footer text color

## Customization

Want different icons for certain platforms? Update the mapping in `src/components/blocks/FooterBlock.tsx`:

```typescript
import { YourCustomIcon } from 'lucide-react'

const SOCIAL_ICONS = {
  // ... existing
  customplatform: YourCustomIcon,
}
```

Then add the platform to the select options in `src/globals/SiteSettings.ts`:

```typescript
options: [
  // ... existing
  { label: 'Your Custom Platform', value: 'customplatform' },
]
```

## Benefits

✅ **No confusion** - Select from a dropdown, icon appears automatically
✅ **Consistent design** - All icons from the same Lucide library
✅ **Accessible** - Proper aria-labels for screen readers
✅ **Scalable** - Vector icons that look great at any size
✅ **Performance** - Tree-shaken, only imports icons you use
✅ **Maintainable** - Easy to add/remove platforms

## Troubleshooting

**Icon not showing?**

- Check that the platform value matches exactly (case-insensitive)
- Check that lucide-react is installed: `pnpm list lucide-react`
- Fallback globe icon will show if platform not found

**Want a different icon?**

- Update the SOCIAL_ICONS mapping in FooterBlock.tsx
- Browse available icons: https://lucide.dev/icons/

**Want to add a new platform?**

1. Add option to SiteSettings.ts select field
2. Add icon mapping to FooterBlock.tsx SOCIAL_ICONS
3. Import the icon from lucide-react if needed

---

**Files:**

- Config: `src/globals/SiteSettings.ts`
- Component: `src/components/blocks/FooterBlock.tsx`
- Icons: `lucide-react` package
