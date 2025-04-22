const nodemailer = require('nodemailer');

async function main() {
  // Create a test account
  const testAccount = await nodemailer.createTestAccount();

  console.log('Test account created:', testAccount);

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Send a test email
  const info = await transporter.sendMail({
    from: '"Test Sender" <test@example.com>',
    to: 'recipient@example.com',
    subject: 'Test Email',
    text: 'This is a test email from nodemailer',
    html: '<p>This is a test email from nodemailer</p>',
  });

  console.log('Message sent:', info.messageId);
  console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
}

main().catch(console.error); 