const axios = require('axios');
require("dotenv").config();

const serviceId = process.env.serviceId;
const templateId = process.env.templateId;
const userId = process.env.userId;

class EmailServices {
    static async sendEmail(email, fullName, mySubject, myMessage, fromName) {
        const url = 'https://api.emailjs.com/api/v1.0/email/send';

        try {
            const response = await axios.post(url, {
                service_id: "service_j379os2",
                template_id: "template_jkstci6",
                user_id: "DyZx31Hl-iDUNnVhT",
                template_params: {
                    to_email: email,
                    from_name: fromName,
                    to_name: fullName,
                    reply_to: 'buabassahlawson@gmail.com',
                    subject: mySubject,
                    message: myMessage,
                },
            }, {
                headers: {
                    'origin': 'https://maifriend-server.onrender.com/',
                    'Content-Type': 'application/json',
                },
            });

            console.log('Email sent successfully:', response.data);
            return ("Email sent successfully to " + email); // Return true indicating success
        } catch (error) {
            console.error('Failed to send email:', error);
            return false; // Return false indicating failure
        }
    }
}
module.exports = EmailServices;