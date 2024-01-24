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
        user: 'websitemailer002@gmail.com',
        pass: 'rnwj mkmb lwdk aney',
    },
});

async function updateSubcriptionAndSendMail(subscription) {
    try {
        // Update subscription status to "expired"
        await Subscription.findByIdAndUpdate(subscription._id, { status: 'expired' });

        // Prepare HTML body with subscription details
        const htmlBody = `
            <p>Your subscription has expired. Please renew to continue enjoying our services.</p>
            <p><strong>Subscription Details:</strong></p>
            <ul>
                <li>User: ${subscription.user.email}</li>
                <li>Plan: ${subscription.plan.name}</li>
                <li>Start Date: ${moment(subscription.startDate).format('YYYY-MM-DD')}</li>
                <li>Expiry Date: ${moment(subscription.expiryDate).format('YYYY-MM-DD')}</li>
            </ul>
        `;

        // Send email to the user with HTML body
        const mailOptions = {
            from: 'websitemailer002@gmail.com',
            to: subscription.user.email,
            subject: 'Subscription Expired',
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
        // Find all active subscriptions that expire today

        // Calculate the range of expiry dates for today
        const startOfDay = moment().startOf('day'); // Start of the current day
        const endOfDay = moment().endOf('day'); // End of the current day

        // Find all active subscriptions with expiry dates in the range of start to end of today
        const subscriptionsToExpire = await Subscription.find({
            status: 'active',
            expiryDate: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
        }).populate('user').populate('plan');

        // Process each subscription
        for (const subscription of subscriptionsToExpire) {
            await  updateSubcriptionAndSendMail(subscription);
        }

        console.log('Cron job executed successfully');
    } catch (error) {
        console.error('Error executing cron job:', error);
    }
});

module.exports=task;