# Form Builder Block - Configuration Examples

## Example 1: Simple Contact Form

Perfect for basic contact pages.

### Configuration

```
Heading: "Get in Touch"
Description: "We'd love to hear from you!"

Fields:
1. Full Name
   - Type: Text
   - Name: fullName
   - Width: Full
   - Required: Yes

2. Email Address
   - Type: Email
   - Name: email
   - Width: Full
   - Required: Yes

3. Message
   - Type: Text Area
   - Name: message
   - Width: Full
   - Required: Yes

Submit Button: "Send Message"
Success Message: "Thank you! We'll get back to you soon."
```

### Visual Result

```
┌────────────────────────────────────────┐
│          Get in Touch                  │
│    We'd love to hear from you!         │
├────────────────────────────────────────┤
│  Full Name *                           │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Email Address *                       │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Message *                             │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  │                                  │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │       Send Message               │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

---

## Example 2: Professional Inquiry Form

Better use of space with side-by-side fields.

### Configuration

```
Heading: "Request Information"
Description: "Fill out the form below and we'll get back to you within 24 hours."

Fields:
1. First Name
   - Type: Text
   - Name: firstName
   - Width: Half
   - Required: Yes

2. Last Name
   - Type: Text
   - Name: lastName
   - Width: Half
   - Required: Yes

3. Email
   - Type: Email
   - Name: email
   - Width: Half
   - Required: Yes

4. Phone
   - Type: Phone
   - Name: phone
   - Placeholder: (555) 123-4567
   - Width: Half
   - Required: No

5. Company Name
   - Type: Text
   - Name: company
   - Width: Full
   - Required: No

6. How did you hear about us?
   - Type: Select
   - Name: referralSource
   - Width: Full
   - Required: Yes
   - Options:
     * Google Search
     * Social Media
     * Referral
     * Advertisement
     * Other

7. Your Message
   - Type: Text Area
   - Name: message
   - Width: Full
   - Required: Yes

Submit Button: "Submit Inquiry"
Success Message: "Thank you for your inquiry! We'll respond within 24 hours."
```

### Visual Result

```
┌────────────────────────────────────────────────┐
│          Request Information                   │
│  Fill out the form below and we'll get back    │
│  to you within 24 hours.                       │
├────────────────────────────────────────────────┤
│  First Name *          Last Name *             │
│  ┌──────────────────┐ ┌──────────────────┐    │
│  │                  │ │                  │    │
│  └──────────────────┘ └──────────────────┘    │
│                                                │
│  Email *               Phone                   │
│  ┌──────────────────┐ ┌──────────────────┐    │
│  │                  │ │ (555) 123-4567   │    │
│  └──────────────────┘ └──────────────────┘    │
│                                                │
│  Company Name                                  │
│  ┌──────────────────────────────────────────┐ │
│  │                                          │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  How did you hear about us? *                  │
│  ┌──────────────────────────────────────────┐ │
│  │ Select an option...              ▼      │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  Your Message *                                │
│  ┌──────────────────────────────────────────┐ │
│  │                                          │ │
│  │                                          │ │
│  │                                          │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │         Submit Inquiry                   │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

---

## Example 3: Franchise Application Form

Detailed form with three-column layout for address fields.

### Configuration

```
Heading: "Franchise Application"
Description: "Start your journey to franchise ownership today."

Fields:
1. First Name
   - Type: Text
   - Name: firstName
   - Width: Third
   - Required: Yes

2. Middle Initial
   - Type: Text
   - Name: middleInitial
   - Width: Third
   - Required: No

3. Last Name
   - Type: Text
   - Name: lastName
   - Width: Third
   - Required: Yes

4. Email Address
   - Type: Email
   - Name: email
   - Width: Half
   - Required: Yes

5. Phone Number
   - Type: Phone
   - Name: phone
   - Width: Half
   - Required: Yes

6. Street Address
   - Type: Text
   - Name: address
   - Width: Full
   - Required: Yes

7. City
   - Type: Text
   - Name: city
   - Width: Third
   - Required: Yes

8. State
   - Type: Text
   - Name: state
   - Placeholder: CA
   - Width: Third
   - Required: Yes

9. ZIP Code
   - Type: Text
   - Name: zipCode
   - Width: Third
   - Required: Yes

10. Investment Budget
    - Type: Select
    - Name: budget
    - Width: Full
    - Required: Yes
    - Options:
      * Under $50,000
      * $50,000 - $100,000
      * $100,000 - $250,000
      * $250,000 - $500,000
      * Over $500,000

11. Industry Interest
    - Type: Select
    - Name: industry
    - Width: Full
    - Required: Yes
    - Options:
      * Food & Beverage
      * Retail
      * Services
      * Health & Fitness
      * Education
      * Other

12. Tell us about your background
    - Type: Text Area
    - Name: background
    - Width: Full
    - Required: No

Submit Button: "Submit Application"
Success Message: "Application received! A franchise consultant will contact you within 2 business days."
```

### Visual Result

```
┌──────────────────────────────────────────────────────┐
│            Franchise Application                     │
│    Start your journey to franchise ownership today.  │
├──────────────────────────────────────────────────────┤
│  First Name *    Middle Initial   Last Name *        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │            │  │            │  │            │     │
│  └────────────┘  └────────────┘  └────────────┘     │
│                                                      │
│  Email Address *           Phone Number *            │
│  ┌──────────────────────┐ ┌──────────────────────┐  │
│  │                      │ │                      │  │
│  └──────────────────────┘ └──────────────────────┘  │
│                                                      │
│  Street Address *                                    │
│  ┌────────────────────────────────────────────────┐ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  City *          State *         ZIP Code *          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │            │  │ CA         │  │            │     │
│  └────────────┘  └────────────┘  └────────────┘     │
│                                                      │
│  Investment Budget *                                 │
│  ┌────────────────────────────────────────────────┐ │
│  │ Select an option...                    ▼      │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  Industry Interest *                                 │
│  ┌────────────────────────────────────────────────┐ │
│  │ Select an option...                    ▼      │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  Tell us about your background                       │
│  ┌────────────────────────────────────────────────┐ │
│  │                                                │ │
│  │                                                │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │          Submit Application                    │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## Example 4: Newsletter Signup

Minimal form for quick signups.

### Configuration

```
Heading: "Stay Updated"
Description: "Get the latest franchise opportunities delivered to your inbox."

Fields:
1. Email Address
   - Type: Email
   - Name: email
   - Placeholder: your@email.com
   - Width: Full
   - Required: Yes

2. I'm interested in
   - Type: Select
   - Name: interest
   - Width: Full
   - Required: No
   - Options:
     * All Opportunities
     * Food & Beverage Only
     * Retail Only
     * Services Only
     * Low Investment (<$50k)

Submit Button: "Subscribe"
Success Message: "You're subscribed! Check your email for confirmation."
```

---

## Tips for Creating Great Forms

### Layout Best Practices

1. **Use Half Width for Related Fields**
   - First Name / Last Name
   - Email / Phone
   - City / State

2. **Use Third Width for Address Components**
   - City / State / ZIP
   - First / Middle / Last Name

3. **Keep Full Width for:**
   - Text areas (messages)
   - Long text fields (street address)
   - Select dropdowns (easier to read)

### Field Naming Conventions

Use camelCase for field names:

- ✅ `firstName`, `emailAddress`, `phoneNumber`
- ❌ `first name`, `Email Address`, `phone_number`

### Required Fields

Mark fields as required only when truly necessary:

- Always required: Name, Email, Message
- Sometimes required: Phone (for urgent inquiries)
- Rarely required: Company, Middle Name, Additional Info

### Placeholder Text

Use placeholders to show format examples:

- Phone: `(555) 123-4567`
- State: `CA`
- ZIP: `12345`
- Email: `your@email.com`

### Select Dropdowns

Always include a default "Select an option..." prompt to ensure users make an active choice.

---

## Responsive Behavior

### Desktop (≥768px)

- Half width fields appear side-by-side (2 columns)
- Third width fields appear side-by-side (3 columns)
- Full width fields span the entire width

### Mobile (<768px)

- All fields stack vertically
- Full width on mobile regardless of desktop setting
- Maintains proper spacing and readability

---

## Accessibility Features

All forms include:

- ✅ Proper label associations
- ✅ Required field indicators (\*)
- ✅ ARIA attributes for screen readers
- ✅ Keyboard navigation support
- ✅ Error message announcements
- ✅ Focus management
- ✅ High contrast error states
