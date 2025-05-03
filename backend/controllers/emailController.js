import nodemailer from 'nodemailer';

const subscribe = async (req, res) => {

    const { email } = req.body;

    if(!email){
        return res.status(400).json({ message: "Email is required!" });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false, 
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"SoleVibe" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Subscription Success",
            text: `Thanks for subscribing to SoleVibe! Stay tuned for updates.`,
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #e0e0e0;">
        <div style="text-align: center;">
            <h2 style="color: #4f46e5;">🎉 Subscription Confirmed!</h2>
            <p style="font-size: 16px; color: #333;">Hey there!</p>
            <p style="font-size: 16px; color: #333;">
                Thank you for subscribing to <strong>SoleVibe</strong> — your ultimate destination for stylish and performance-packed footwear.
            </p>
            <p style="font-size: 16px; color: #333;">
                As a subscriber, you're now eligible for:
            </p>
            <ul style="text-align: left; margin: 20px auto; max-width: 400px; padding-left: 20px; font-size: 15px; color: #333;">
                <li>🎁 Exclusive member-only discounts</li>
                <li>🎟️ A chance to win match passes and merchandise</li>
                <li>🚀 Early access to new drops and events</li>
            </ul>
            <p style="font-size: 16px; color: #333;">
                Stay tuned — exciting updates are coming your way!
            </p>
            <a href="https://yourwebsite.com" target="_blank" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #2E1E12; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Explore SoleVibe
            </a>
            <p style="font-size: 14px; color: #888; margin-top: 30px;">
                If you did not subscribe to this, please ignore this email.
            </p>
        </div>
    </div>
    `,
        }

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: 'Email sent successfully!' });

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
}

const orderSuccess = async (req, res) => {
    
}

export { subscribe };