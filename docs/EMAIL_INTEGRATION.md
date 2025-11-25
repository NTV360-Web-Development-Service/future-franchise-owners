# Email Integration with Resend

## Status: ✅ ACTIVE

Resend is fully integrated and sending emails for franchise information requests.

## Configuration

**Environment Variables** (already set in `.env` and `.env.local`):

```env
RESEND_API_KEY="re_FUwRmij7_7UATqWpmUZnEuBm8A7DDMtGu"
FROM_EMAIL="onboarding@resend.dev"
MAIN_CONTACT_EMAIL="efraimg@n-compass.biz"
```

## How It Works

When a user submits a franchise information request:

### 1. Admin/Sales Email

**To:** `efraimg@n-compass.biz` (MAIN_CONTACT_EMAIL)
**From:** `onboarding@resend.dev` (FROM_EMAIL)
**Subject:** "Franchise Information Request from [Name]"

**Contains:**

- Contact information (name, email, phone)
- List of requested franchises with details
- User's message (if provided)
- Timestamp

### 2. User Confirmation Email

**To:** User's email address
**From:** `onboarding@resend.dev` (FROM_EMAIL)
**Subject:** "Your Franchise Information Request"

**Contains:**

- Thank you message
- List of franchises they requested
- What to expect next (24-48 hours)
- Contact information for questions
- Professional and reassuring tone

## Testing

1. Add franchises to cart
2. Click "Request Information for All"
3. Fill out form with your email
4. Submit
5. Check both:
   - `efraimg@n-compass.biz` for admin notification
   - Your email for confirmation

## Error Handling

- If admin email fails: Logs error, continues to send user email
- If user email fails: Logs error, still returns success
- Request is considered successful even if emails fail (graceful degradation)

## Customization

### Change Admin Email

Update `MAIN_CONTACT_EMAIL` in `.env`:

```env
MAIN_CONTACT_EMAIL="your-sales-team@example.com"
```

### Change From Email

Update `FROM_EMAIL` in `.env`:

```env
FROM_EMAIL="noreply@yourdomain.com"
```

**Note:** You need to verify your domain in Resend to use a custom from address.

### Customize Email Templates

Edit `/src/app/api/request-info/route.ts`:

- `adminEmailBody` - Email to sales team
- `userEmailBody` - Confirmation to user

## Resend Dashboard

View sent emails, delivery status, and analytics:
https://resend.com/emails

## Production Checklist

- ✅ Resend API key configured
- ✅ From email set
- ✅ Admin email set
- ✅ Error handling in place
- ✅ User confirmation enabled
- ⚠️ Consider verifying custom domain for branded emails
- ⚠️ Set up email templates in Resend (optional)
- ⚠️ Monitor email delivery rates

## Future Enhancements

- HTML email templates (currently plain text)
- Email template builder in Resend
- Attach franchise PDFs to emails
- Schedule follow-up emails
- Track email opens/clicks
- A/B test email content
