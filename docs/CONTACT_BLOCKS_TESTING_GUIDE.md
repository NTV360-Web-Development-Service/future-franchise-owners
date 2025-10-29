# Contact Blocks Testing Guide

## Quick Start

### 1. Start the Development Server

```bash
pnpm dev
```

### 2. Access the Admin Panel

Navigate to: `http://localhost:3000/admin`

## Testing Contact Form Block

### In the CMS Admin Panel

1. **Create/Edit a Page:**
   - Go to Collections → Pages
   - Create a new page or edit an existing one
   - Click "Add Block" in the Layout section
   - Select "Contact Form" from the block list

2. **Configure the Block:**
   - **Heading:** "Get in Touch" (or customize)
   - **Description:** Add optional description text
   - **Submit Button Text:** "Send Message" (or customize)
   - **Success Message:** Customize the success message
   - **Form Fields:** Toggle which fields to show/require
     - Try different combinations (e.g., only name + email + message)
     - Test required toggles

3. **Save and View:**
   - Save the page
   - Visit the page on the frontend
   - The form should appear with your configured fields

### On the Frontend

1. **Test Form Submission:**
   - Fill out the form with valid data
   - Click submit
   - Should see success message
   - Check "Contact Submissions" collection in admin to verify submission was stored

2. **Test Validation:**
   - Try submitting with empty required fields → Should show error messages
   - Try invalid email format → Should show email validation error
   - Errors should clear when you start typing

3. **Test Different Field Combinations:**
   - Create multiple test pages with different field configurations
   - Verify only configured fields appear
   - Verify required/optional behavior matches configuration

## Testing Contact Info Block

### In the CMS Admin Panel

1. **Add Contact Info Block:**
   - Go to Collections → Pages
   - Add "Contact Info" block to a page
   - Configure the block:

2. **Configure Contact Details:**
   - **Heading:** "Contact Information" (or customize)
   - **Phone:** Toggle show, add number like "(555) 123-4567"
   - **Email:** Toggle show, add email address
   - **Address:** Toggle show, add multi-line address
   - **Business Hours:** Toggle show, add hours (use line breaks)

3. **Optional Map:**
   - Toggle "Show Map"
   - Add Google Maps embed URL
   - Set map height (200-600px)

### On the Frontend

1. **Test Contact Details Display:**
   - Verify heading appears
   - Check that only toggled-on details are visible
   - Click phone number → Should open phone dialer
   - Click email → Should open email client
   - Verify address formatting (line breaks preserved)
   - Verify hours formatting

2. **Test Map Integration:**
   - If map is enabled, verify it displays correctly
   - Check that map height matches configuration
   - Verify map is interactive (zoom, pan)

3. **Test Different Configurations:**
   - Try showing only phone and email
   - Try showing all details
   - Try with and without map
   - Verify layout adapts properly

## Testing Responsive Design

### Desktop (1920x1080)

- Form should be centered with max-width
- Contact info should use 2-column grid
- All elements should be properly spaced

### Tablet (768x1024)

- Form should remain centered
- Contact info may stack to single column
- Touch targets should be adequate

### Mobile (375x667)

- Form should be full-width with padding
- Contact info should stack vertically
- All text should be readable
- Form fields should be easy to tap

## Testing Accessibility

### Keyboard Navigation

1. Tab through form fields → Should follow logical order
2. Press Enter on submit button → Should submit form
3. Error messages should be focusable
4. All interactive elements should have visible focus states

### Screen Reader Testing

1. Use browser screen reader (or NVDA/JAWS)
2. Verify form labels are announced
3. Verify required fields are announced
4. Verify error messages are announced
5. Verify success message is announced

### ARIA Attributes

- Check that form fields have proper `aria-required`
- Check that errors have `aria-invalid` and `aria-describedby`
- Check that error messages have `role="alert"`

## Testing Form Submission Storage

### In the Admin Panel

1. **Submit a Test Form:**
   - Fill out and submit a contact form on the frontend

2. **Check Contact Submissions:**
   - Go to Collections → Contact Submissions
   - Verify your submission appears
   - Check that all fields were captured correctly
   - Verify IP address was captured
   - Verify status is "new"

3. **Test Status Management:**
   - Click on a submission
   - Change status to "read" or "archived"
   - Verify status updates correctly

## Common Issues to Check

### Contact Form Block

- [ ] Form appears on the page
- [ ] Only configured fields are visible
- [ ] Required fields show asterisk (\*)
- [ ] Validation works correctly
- [ ] Success message displays after submission
- [ ] Form clears after successful submission
- [ ] Loading state shows during submission
- [ ] Error handling works for API failures

### Contact Info Block

- [ ] Heading displays correctly
- [ ] Only toggled-on details appear
- [ ] Phone link uses `tel:` protocol
- [ ] Email link uses `mailto:` protocol
- [ ] Address preserves line breaks
- [ ] Hours preserve line breaks
- [ ] Icons display correctly
- [ ] Map displays when enabled
- [ ] Map height matches configuration

### General

- [ ] Blocks respect published toggle
- [ ] Blocks appear in correct order
- [ ] Styling is consistent with other blocks
- [ ] No console errors
- [ ] TypeScript compiles without errors
- [ ] Responsive design works on all screen sizes

## Test Data Examples

### Contact Form Test Data

```
Name: John Doe
Email: john.doe@example.com
Phone: (555) 123-4567
Company: Acme Corp
Subject: Franchise Inquiry
Message: I'm interested in learning more about franchise opportunities.
```

### Contact Info Test Data

```
Phone: (555) 123-4567
Email: info@futurefranchiseowners.com
Address:
123 Main Street
Suite 100
New York, NY 10001

Business Hours:
Monday - Friday: 9:00 AM - 5:00 PM
Saturday: 10:00 AM - 2:00 PM
Sunday: Closed
```

### Google Maps Embed URL Example

```
https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841!2d-73.9857!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjIiTiA3M8KwNTknMDguNSJX!5e0!3m2!1sen!2sus!4v1234567890
```

## Reporting Issues

If you find any issues during testing:

1. Note the exact steps to reproduce
2. Include browser and device information
3. Take screenshots if applicable
4. Check browser console for errors
5. Document expected vs actual behavior

## Next Steps After Testing

Once testing is complete:

1. Document any bugs found
2. Create tickets for any issues
3. Test on staging environment
4. Get stakeholder approval
5. Deploy to production
