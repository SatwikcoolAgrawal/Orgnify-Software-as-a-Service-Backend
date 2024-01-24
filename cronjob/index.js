const cron=require('node-cron');
const nodemailer=require('nodemailer');
const {Subscription}= require('../models');

// Nodemailer setup (you may need to configure your email service)
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASS,
    },
});

async function updateSubcriptionAndSendMail(subscription) {
    try {
        // Update subscription status to "expired"
        await Subscription.findByIdAndUpdate(subscription._id, { status: 'expired' });

        // Prepare HTML body with subscription details
        const htmlBody = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #3498db;">Subscription Expired</h2>
        <p style="font-size: 16px;">Your subscription has expired. Please renew to continue enjoying our services.</p>

        <div style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0;"><strong>Subscription Details:</strong></p>
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 10px;"><strong>User:</strong> ${subscription.user.email}</li>
                <li style="margin-bottom: 10px;"><strong>Plan:</strong> ${subscription.plan.name}</li>
                <li style="margin-bottom: 10px;"><strong>Start Date:</strong> ${moment(subscription.startDate).format('YYYY-MM-DD')}</li>
                <li style="margin-bottom: 10px;"></strong>Expiry Date:</strong> ${moment(subscription.expiryDate).format('YYYY-MM-DD')}</li>
            </ul>
        </div>
        <p style="margin-top: 20px; color: #999; font-size: 12px;">If you have any questions, contact support at websitemailer002@gmail.com.</p>
    </div>
`;

        // Send email to the user with HTML body
        const mailOptions = {
            from: 'websitemailer002@gmail.com',
            to: subscription.user.email,
            subject: `Orignify: Subscription Expired - ${moment(subscription.expiryDate).format('YYYY-MM-DD')}`,
            html: htmlBody,
        };

        await transporter.sendMail(mailOptions);

        console.log(`Email sent to ${subscription.user.email}`);
    } catch (error) {
        console.error('Error updating subscription status and sending email:', error);
    }
}

const task=cron.schedule('0 0 * * *', async () => {
    try {
         // Calculate the range of expiry dates for today
         const startOfDay = moment().startOf('day'); // Start of the current day
         const endOfDay = moment().endOf('day'); // End of the current day
 
         // Find all active subscriptions that expire today and populate 'user' and 'plan' fields
         const subscriptionsToExpire = await Subscription.find({
             status: 'active',
             expiryDate: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
         }).populate('user plan');
 
         // Process each subscription in parallel
         await Promise.all(subscriptionsToExpire.map((subs)=>updateSubcriptionAndSendMail(subs)));

        console.log('Cron job executed successfully');
    } catch (error) {
        console.error('Error executing cron job:', error);
    }
});

module.exports=task;