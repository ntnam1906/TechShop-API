const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
dotenv.config()

const defaultMailOptions = {
    from: process.env.SEND_VERIFY_EMAIL_ADDRESS,
    subject: 'Verify your account',
};

const createTransporter = async () => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.SEND_VERIFY_EMAIL_ADDRESS,
            pass: process.env.SEND_VERIFY_EMAIL_PASSWORD,
        },
    });

    return transporter;
};

const sendActivationEmail = async (
    to = process.env.SEND_VERIFY_EMAIL_ADDRESS,
    token = 'xxxx'
) => {
    try {
        const transporter = await createTransporter();
        const text = `Your confirmation token: ${token}`;
        const mailOptions = {
            ...defaultMailOptions,
            to,
            text,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('got error when sending email', error);
        throw error;
    }
};

module.exports = {
    sendActivationEmail,
};
