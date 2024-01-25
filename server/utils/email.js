const nodeMailer = require('nodemailer');

const sendEmail = async (to, subject,text) => {
    
    const transport= nodeMailer.createTransport({
        service: 'SendinBlue',
        auth: {
          user: process.env.SENDINBLUE_USERNAME,
          pass: process.env.SENDINBLUE_PASSWORD
        }
      });

    
      const mailOptions = {
        from: 'nikhil.p.trials@gmail.com',
        to,
        subject,
        text,
      };
    
      try {
        const info = await transport.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
      } catch (error) {
        console.error('Error sending email:', error);
      }
};

module.exports = sendEmail;