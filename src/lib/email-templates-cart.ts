/**
 * HTML Email Templates for Cart Requests
 */

export function generateAdminEmailHTML(data: {
  name: string
  email: string
  phone: string
  message?: string
  franchises: Array<{
    name: string
    category: string
    cashRequired: string
  }>
}): string {
  const franchiseRows = data.franchises
    .map(
      (f, index) => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
        <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">${index + 1}. ${f.name}</div>
        <div style="font-size: 14px; color: #6b7280;">Category: ${f.category}</div>
        <div style="font-size: 14px; color: #004AAD; font-weight: 500;">Investment: ${f.cashRequired}</div>
      </td>
    </tr>
  `,
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Franchise Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #004AAD 0%, #003A8C 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">🎯 New Franchise Request</h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">Someone is interested in your franchises!</p>
            </td>
          </tr>

          <!-- Contact Info -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 18px; font-weight: 600;">Contact Information</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 10px 0;">
                    <strong style="color: #374151;">Name:</strong>
                    <span style="color: #111827; margin-left: 10px;">${data.name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <strong style="color: #374151;">Email:</strong>
                    <a href="mailto:${data.email}" style="color: #004AAD; margin-left: 10px; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <strong style="color: #374151;">Phone:</strong>
                    <a href="tel:${data.phone}" style="color: #004AAD; margin-left: 10px; text-decoration: none;">${data.phone}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Franchises -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-weight: 600;">Requested Franchises (${data.franchises.length})</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                ${franchiseRows}
              </table>
            </td>
          </tr>

          ${
            data.message
              ? `
          <!-- Message -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-weight: 600;">Message</h2>
              <div style="background-color: #f9fafb; border-left: 4px solid #004AAD; padding: 15px; border-radius: 4px;">
                <p style="margin: 0; color: #374151; line-height: 1.6;">${data.message}</p>
              </div>
            </td>
          </tr>
          `
              : ''
          }

          <!-- Action Buttons -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px;">
                    <a href="mailto:${data.email}" style="display: inline-block; background-color: #004AAD; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                      📧 Reply to ${data.name}
                    </a>
                  </td>
                  <td align="center" style="padding: 10px;">
                    <a href="tel:${data.phone}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                      📞 Call ${data.name}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Request submitted on ${new Date().toLocaleString()}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export function generateUserConfirmationHTML(data: {
  name: string
  franchises: Array<{
    name: string
    category: string
    cashRequired: string
  }>
}): string {
  const franchiseRows = data.franchises
    .map(
      (f, index) => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
        <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">${index + 1}. ${f.name}</div>
        <div style="font-size: 14px; color: #6b7280;">Category: ${f.category}</div>
        <div style="font-size: 14px; color: #004AAD; font-weight: 500;">Investment: ${f.cashRequired}</div>
      </td>
    </tr>
  `,
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Franchise Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">✅ Request Confirmed!</h1>
              <p style="margin: 10px 0 0 0; color: #d1fae5; font-size: 14px;">We've received your franchise information request</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; color: #111827; font-size: 16px; line-height: 1.6;">
                Hi <strong>${data.name}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 15px; line-height: 1.6;">
                Thank you for your interest in our franchise opportunities! We've received your request for information about the following franchises:
              </p>
            </td>
          </tr>

          <!-- Franchises -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                ${franchiseRows}
              </table>
            </td>
          </tr>

          <!-- What's Next -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #eff6ff; border-left: 4px solid #004AAD; padding: 20px; border-radius: 4px;">
                <h3 style="margin: 0 0 15px 0; color: #004AAD; font-size: 16px; font-weight: 600;">📋 What's Next?</h3>
                <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
                  <li>Our team will review your request</li>
                  <li>You'll receive detailed information about each franchise within <strong>24-48 hours</strong></li>
                  <li>A franchise consultant may reach out to discuss your interests</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Contact Info -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; text-align: center;">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px; font-weight: 600;">Questions?</h3>
                <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">
                  If you have any questions in the meantime, feel free to reach out:
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding: 5px;">
                      <a href="mailto:info@yourcompany.com" style="color: #004AAD; text-decoration: none; font-size: 14px;">
                        📧 info@yourcompany.com
                      </a>
                    </td>
                    <td align="center" style="padding: 5px;">
                      <a href="tel:+15551234567" style="color: #004AAD; text-decoration: none; font-size: 14px;">
                        📞 (555) 123-4567
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">
                We're excited to help you find the perfect franchise opportunity!
              </p>
              <p style="margin: 15px 0 0 0; color: #374151; font-size: 15px;">
                Best regards,<br>
                <strong>The Franchise Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Request submitted on ${new Date().toLocaleString()}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
