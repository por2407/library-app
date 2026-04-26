const nodemailer = require('nodemailer');
const { connectRabbitMQ } = require('../config/rabbitmq');
const { cfg } = require('../config/env');

const transporter = nodemailer.createTransport({
    host: cfg.email.host,
    port: cfg.email.port,
    auth: {
        user: cfg.email.user,
        pass: cfg.email.pass,
    },
});

async function startEmailWorker() {
    try {
        const { channel } = await connectRabbitMQ();
        const queue = 'email_notifications';

        await channel.assertQueue(queue, { durable: true });
        channel.prefetch(1);

        console.log(`Email Worker started, waiting for messages in ${queue}...`);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                console.log(`[EmailWorker] Received task for: ${data.email}`);

                try {
                    const info = await sendBorrowSuccessEmail(data);
                    console.log(`[EmailWorker] Email sent successfully: ${info.messageId}`);
                    channel.ack(msg);
                } catch (err) {
                    console.error('[EmailWorker] Error sending email:', err.message);
                    // If it's a connection error, we might want to requeue
                    // For now, let's requeue to try again
                    channel.nack(msg, false, true);
                }
            }
        });
    } catch (err) {
        console.error('Email Worker failed to start', err);
    }
}

async function sendBorrowSuccessEmail(data) {
    const { email, userName, bookTitle, dueDate } = data;

    const mailOptions = {
        from: cfg.email.from,
        to: email,
        subject: '📚 ยืมหนังสือสำเร็จ!',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #2c3e50;">สวัสดีคุณ ${userName}</h2>
                <p>คุณได้ทำการยืมหนังสือ <strong>"${bookTitle}"</strong> เรียบร้อยแล้ว</p>
                <p style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid #3498db;">
                    📅 <strong>กำหนดส่งคืน:</strong> ${new Date(dueDate).toLocaleDateString('th-TH')}
                </p>
                <p>กรุณาส่งคืนตามกำหนดเพื่อหลีกเลี่ยงค่าปรับ</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #7f8c8d;">นี่คือการแจ้งเตือนอัตโนมัติ กรุณาอย่าตอบกลับอีเมลนี้</p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { startEmailWorker };
