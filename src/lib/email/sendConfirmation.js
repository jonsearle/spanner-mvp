export async function sendConfirmationEmail(date) {
  console.log('Sending confirmation email for date:', date);
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'test@resend.dev',
      to: 'jon.searle@gmail.com',
      subject: `New Booking Received`,
      html: `<p>New booking received for <b>${date}</b></p>`
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error('Failed to send confirmation email: ' + error);
  }
} 