/**
 * Modern email templates for contact form submissions
 */

export const getUserConfirmationEmail = (params: { name: string; message: string }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f0f2f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
            <!-- Logo Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #004AAD 0%, #002B6B 50%, #001C40 100%); padding: 50px 40px; text-align: center;">
                <img src="https://future-franchise-owners.vercel.app/images/ffo-logo.png" alt="Future Franchise Owners" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
                <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Thank You!</h1>
                <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.95); font-size: 18px;">We've received your message</p>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 50px 40px;">
                <p style="margin: 0 0 24px 0; color: #1a1a1a; font-size: 18px; line-height: 1.7;">
                  Hi <strong style="color: #004AAD;">${params.name || 'there'}</strong>,
                </p>
                <p style="margin: 0 0 32px 0; color: #4a5568; font-size: 16px; line-height: 1.7;">
                  Thank you for reaching out to <strong>Future Franchise Owners</strong>. We've received your inquiry and our team will get back to you within 24 hours.
                </p>
                
                ${
                  params.message
                    ? `
                  <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-left: 5px solid #004AAD; padding: 24px; margin: 32px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,74,173,0.08);">
                    <p style="margin: 0 0 12px 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Your Message</p>
                    <p style="margin: 0; color: #1e293b; font-size: 16px; line-height: 1.7; white-space: pre-wrap;">${params.message}</p>
                  </div>
                `
                    : ''
                }
                
                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 32px 0; border-radius: 8px;">
                  <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.6;">
                    <strong>💡 Quick Tip:</strong> Check your spam folder if you don't see our response in your inbox.
                  </p>
                </div>
                
                <p style="margin: 32px 0 0 0; color: #4a5568; font-size: 16px; line-height: 1.7;">
                  Have urgent questions? Feel free to reply to this email or call us directly.
                </p>
                
                <div style="margin-top: 48px; padding-top: 32px; border-top: 2px solid #e2e8f0;">
                  <p style="margin: 0 0 8px 0; color: #64748b; font-size: 16px;">Best regards,</p>
                  <p style="margin: 0; color: #004AAD; font-size: 18px; font-weight: 700;">Future Franchise Owners Team</p>
                  <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px; font-style: italic;">Your Partner in Franchise Success</p>
                </div>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                  <strong>Future Franchise Owners</strong><br/>
                  Helping entrepreneurs find their perfect franchise opportunity
                </p>
                <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                  This is an automated confirmation email.<br/>
                  © ${new Date().getFullYear()} Future Franchise Owners. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
