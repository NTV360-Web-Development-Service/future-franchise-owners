# Cart Feature Documentation

## Overview

The cart feature allows users to save franchises in two separate lists: **Wishlist** (for franchises they're interested in) and **Cart** (for franchises they're ready to pursue). Users can add franchises from anywhere on the site, view their saved franchises in a slide-out drawer with tabs, and move items between lists.

## Features

- **Two Lists**: Wishlist (save for later) and Cart (ready to pursue)
- **Floating Button**: Fixed button in bottom right corner showing total count
- **Tabbed Drawer**: Slide-out panel with Wishlist and Cart tabs
- **Move Between Lists**: Easily move franchises from wishlist to cart and vice versa
- **Persistent Storage**: Both lists saved in browser localStorage
- **Remove Items**: Delete individual franchises from either list
- **Clear All**: Clear entire wishlist or cart separately
- **View Details**: Quick links to franchise detail pages
- **Always Accessible**: Cart button visible on all pages

## Setup

### 1. Enable Cart Feature (Optional - Enabled by Default)

Navigate to **Admin Panel → Globals → Site Settings → General** tab:

1. Check the **"Enable Cart"** checkbox in the sidebar
2. Save changes
3. The floating cart button will appear in the bottom right corner

To disable the cart feature site-wide, simply uncheck this box.

### 2. Add "Add to Cart" Block to Pages

You can add an "Add to Cart" block to any page:

1. Go to **Admin Panel → Collections → Pages**
2. Select or create a page
3. In the Layout section, click **"Add Block"**
4. Select **"Add To Cart"**
5. Configure the block:
   - **Franchise**: Select the franchise to add
   - **Button Text**: Custom text (default: "Add to Cart")
   - **Button Variant**: Default, Outline, or Ghost
   - **Button Size**: Small, Default, or Large
   - **Alignment**: Left, Center, or Right
6. Save the page

## Usage

### For Site Visitors

1. **Adding Franchises**:
   - **From Franchise Cards**: Click the heart icon (wishlist) or cart icon (cart) on any franchise card
   - **From Pages**: Click "Add to Wishlist" or "Add to Cart" buttons where available
   - The floating button badge updates with total count

2. **Viewing Saved Franchises**:
   - Click the floating button in the bottom right corner
   - A drawer slides out with two tabs: **Wishlist** and **Cart**
   - Switch between tabs to view each list
   - Each item shows:
     - Franchise image
     - Name and category
     - Cash required amount
     - Link to view full details
     - Move to other list button

3. **Managing Lists**:
   - **Move items**: Click "Move to Cart" or "Move to Wishlist"
   - **Remove items**: Click the trash icon
   - **Clear list**: Click "Clear Wishlist" or "Clear Cart"
   - **Close drawer**: Click "Continue Browsing" or the X button

### For Administrators

**Adding Cart Blocks**:

- Use the "Add to Cart" block on franchise detail pages
- Add multiple blocks to comparison pages
- Customize button appearance per page

**Monitoring Usage**:

- Cart data is stored client-side (localStorage)
- No server-side tracking by default
- Can be extended with analytics if needed

## Technical Details

### Components

- **CartContext** (`src/contexts/CartContext.tsx`): React context managing both wishlist and cart
- **CartProvider**: Wraps the app to provide cart functionality
- **FloatingCartButton** (`src/components/cart/FloatingCartButton.tsx`): Fixed floating button showing total count
- **CartDrawer** (`src/components/cart/CartDrawer.tsx`): Tabbed drawer with wishlist and cart
- **AddToCartButton** (`src/components/cart/AddToCartButton.tsx`): Reusable button supporting both lists
- **AddToCartBlock** (`src/components/blocks/AddToCartBlock.tsx`): CMS block for pages

### Data Structure

Each cart item contains:

```typescript
{
  id: string              // Unique franchise ID
  name: string            // Franchise name
  category: string        // Primary category
  cashRequired: string    // Investment amount
  image?: string          // Franchise image URL
  slug?: string           // URL slug for detail page
}
```

### Storage

- Cart data is stored in browser `localStorage` under the key `franchise-cart`
- Data persists across browser sessions
- Automatically syncs when items are added/removed
- Cleared when user clears browser data

## Customization

### Styling

The cart components use Tailwind CSS classes and can be customized:

- **Floating Button**: Blue background (#004AAD), fixed bottom-right, scales on hover
- **Cart Badge**: Red background with white text showing item count
- **Drawer**: White background, full height, max-width 28rem
- **Buttons**: Uses your existing Button component styles

### Button Variants

Three button styles available:

- **Default**: Solid background (primary color)
- **Outline**: Border with transparent background
- **Ghost**: No border, transparent background

### Button States

- **Normal**: "Add to Cart" with shopping cart icon
- **In Cart**: "In Cart" with check icon (disabled)
- **Just Added**: "Added!" with check icon (2 second animation)

## Best Practices

1. **Add cart blocks strategically**: Place on detail pages and comparison pages
2. **Keep cart items relevant**: Consider adding a "clear old items" feature if needed
3. **Mobile optimization**: Cart drawer and floating button are fully responsive and touch-friendly
4. **Positioning**: The floating button is fixed and won't interfere with page content

## Future Enhancements

Potential features to add:

- Export cart to PDF or email
- Share cart via URL
- Add notes to cart items
- Sort/filter cart items
- Compare franchises side-by-side
- Send cart to consultant/agent
- Analytics tracking for cart usage

## Troubleshooting

**Floating cart button not showing?**

- Check that "Enable Cart" is checked in Site Settings → General tab
- Verify you've saved the settings
- Check that FloatingCartButton is imported in the layout
- Verify CartProvider is wrapping the app
- Clear browser cache and reload

**Cart items not persisting?**

- Check browser localStorage is enabled
- Verify no browser extensions are blocking storage
- Check browser console for errors

**Add to Cart button not working?**

- Verify the franchise relationship is properly set
- Check browser console for errors
- Ensure CartProvider is wrapping the app

## Files Modified/Created

**New Files**:

- `src/contexts/CartContext.tsx`
- `src/components/cart/FloatingCartButton.tsx`
- `src/components/cart/CartDrawer.tsx`
- `src/components/cart/AddToCartButton.tsx`
- `src/components/blocks/AddToCartBlock.tsx`
- `docs/CART_FEATURE.md`
- `docs/CART_QUICK_START.md`

**Modified Files**:

- `src/collections/Pages.tsx` - Added `addToCart` block
- `src/app/(frontend)/layout.tsx` - Added CartProvider and FloatingCartButton
- `src/components/blocks/index.ts` - Export AddToCartBlock
