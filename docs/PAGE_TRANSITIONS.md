# Page Transitions & Performance

Smooth page transitions and caching have been implemented for better UX.

## Features

### 1. Smooth Crossfade Transitions

- **Duration**: 0.4 seconds
- **Effect**: Pure crossfade (opacity only, no sliding)
- **Loading indicator**: Blue bar at top during transition
- **Browser support**: Chrome, Edge, Safari 18+
- **Fallback**: Instant navigation in older browsers

### 2. Page Caching

- **Revalidation**: Every 60 seconds
- **Static generation**: Pages are pre-rendered and cached
- **Performance**: Instant navigation after first load
- **Fresh content**: Updates every minute automatically

### 3. Link Prefetching

- **Automatic**: Next.js Link components prefetch on hover
- **Smart**: Only prefetches visible links
- **Fast**: Pages load instantly when clicked

## How It Works

### View Transitions API

The native browser View Transitions API creates smooth crossfades:

- Old page fades out (opacity 1 → 0)
- New page fades in (opacity 0 → 1)
- Both happen simultaneously for smooth effect

### Caching Strategy

```typescript
export const revalidate = 60 // Revalidate every 60 seconds
```

Pages are:

1. **Generated** at build time (static)
2. **Cached** by Next.js and CDN
3. **Revalidated** every 60 seconds
4. **Served** instantly from cache

### Loading Indicator

A blue progress bar appears at the top during transitions to provide visual feedback.

## Customization

### Adjust Transition Speed

In `src/app/globals.css`:

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.4s; /* Change this value */
}
```

### Adjust Cache Duration

In page files:

```typescript
export const revalidate = 60 // Change to desired seconds
// 0 = no cache (always fresh)
// 60 = cache for 1 minute
// 3600 = cache for 1 hour
// false = cache forever (until rebuild)
```

### Disable Transitions

Remove or comment out the `<PageTransition>` wrapper in `src/app/(frontend)/layout.tsx`.

## Browser Support

| Browser        | View Transitions | Fallback           |
| -------------- | ---------------- | ------------------ |
| Chrome 111+    | ✅ Smooth fade   | -                  |
| Edge 111+      | ✅ Smooth fade   | -                  |
| Safari 18+     | ✅ Smooth fade   | -                  |
| Firefox        | ⏳ Coming soon   | Instant navigation |
| Older browsers | ❌ Not supported | Instant navigation |

## Performance Tips

1. **Keep revalidate at 60s** for good balance of freshness and speed
2. **Use Next.js Link** components for automatic prefetching
3. **Optimize images** with Next.js Image component
4. **Monitor Core Web Vitals** in production

## Troubleshooting

### Transitions not visible

- Check browser version (Chrome 111+, Safari 18+)
- Clear browser cache
- Restart dev server

### Pages loading slowly

- Check network tab in DevTools
- Verify revalidate is set (not 0)
- Check database query performance

### Cache not working

- Ensure `revalidate` is set (not `dynamic = 'force-dynamic'`)
- Check Next.js cache in `.next/cache`
- Verify no `cache: 'no-store'` in fetch calls
