'use strict';

const nodemailer = require('nodemailer');
const config = require('../config');
const Logger = require('../Logger');
const log = new Logger('NodeMailer');

// ####################################################
// EMAIL CONFIG
// ####################################################

const emailConfig = config.integrations?.email || {};
const EMAIL_ALERT = emailConfig.alert || false;
const EMAIL_HOST = emailConfig.host || false;
const EMAIL_PORT = emailConfig.port || false;
const EMAIL_USERNAME = emailConfig.username || false;
const EMAIL_PASSWORD = emailConfig.password || false;
const EMAIL_SEND_TO = emailConfig.sendTo || false;

if (EMAIL_ALERT && EMAIL_HOST && EMAIL_PORT && EMAIL_USERNAME && EMAIL_PASSWORD && EMAIL_SEND_TO) {
    log.info('Email', {
        alert: EMAIL_ALERT,
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        username: EMAIL_USERNAME,
        password: EMAIL_PASSWORD,
    });
}

const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
    },
});

async function sendEmailVerification(email, token) {
    const verifyLink = `${config?.server?.hostUrl}/verify-email?email=${email}&token=${token}`;

    const subject = 'Please Confirm Your Email Address';
    const body = 
    `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - Collab</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Segoe UI, Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e0e0e0;border-radius:8px;padding:32px;">
                        <tr>
                            <td style="padding-bottom:24px;">
                                <h2 style="margin:0;color:#333333;font-weight:600;font-size:22px;">Email Verification Required</h2>
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size:15px;color:#555555;line-height:1.6;padding-bottom:24px;">
                                Dear User,<br><br>
                                We received a request to create an account with your email address on <strong>Collab</strong>. To complete the registration process, please verify your email by clicking the button below.
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align:center;padding-bottom:32px;">
                                <a href="${verifyLink}" style="background-color:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;font-size:15px;border-radius:4px;display:inline-block;">
                                    Verify Email
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size:14px;color:#777777;line-height:1.5;padding-bottom:24px;">
                                This verification link will expire in <strong>24 hours</strong>. If you did not initiate this request, no further action is required and you may safely ignore this message.
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size:14px;color:#999999;border-top:1px solid #e0e0e0;padding-top:24px;">
                                Regards,<br>
                                <strong>Collab Support Team</strong><br>
                                <span style="font-size:13px;color:#aaaaaa;">This is an automated message. Please do not reply.</span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    try {
        return await transport
            .sendMail({
                from: `"Collab Support Team" <${EMAIL_USERNAME}>`,
                to: email,
                subject,
                html: body,
            });
    } catch (err) {
        return log.error('sendEmailVerification Error', err);
    }
}

// ####################################################
// EMAIL SEND ALERTS AND NOTIFICATIONS
// ####################################################

function sendEmailAlert(event, data) {
    if (!EMAIL_ALERT || !EMAIL_HOST || !EMAIL_PORT || !EMAIL_USERNAME || !EMAIL_PASSWORD || !EMAIL_SEND_TO) return;

    log.info('sendEMailAlert', {
        event: event,
        data: data,
    });

    let subject = false;
    let body = false;

    switch (event) {
        case 'join':
            subject = getJoinRoomSubject(data);
            body = getJoinRoomBody(data);
            break;
        // ...
        default:
            break;
    }

    if (subject && body) sendEmail(subject, body);
}

function sendEmail(subject, body) {
    transport
        .sendMail({
            from: EMAIL_USERNAME,
            to: EMAIL_SEND_TO,
            subject: subject,
            html: body,
        })
        .catch((err) => log.error(err));
}

// ####################################################
// EMAIL TEMPLATES
// ####################################################

function getJoinRoomSubject(data) {
    const { room_id } = data;
    return `Collab - New user Join to Room ${room_id}`;
}
function getJoinRoomBody(data) {
    const { peer_name, room_id, domain, os, browser } = data;

    const currentDataTime = getCurrentDataTime();

    const localDomains = ['localhost', '127.0.0.1'];

    const currentDomain = localDomains.some((localDomain) => domain.includes(localDomain))
        ? `${domain}:${config.server.listen.port}`
        : domain;

    const room_join = `https://${currentDomain}/join/`;

    return `
        <h1>New user join</h1>
        <style>
            table {
                font-family: arial, sans-serif;
                border-collapse: collapse;
                width: 100%;
            }
            td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
            }
            tr:nth-child(even) {
                background-color: #dddddd;
            }
        </style>
        <table>
            <tr>
                <td>User</td>
                <td>${peer_name}</td>
            </tr>
            <tr>
                <td>Os</td>
                <td>${os}</td>
            </tr>
            <tr>
                <td>Browser</td>
                <td>${browser}</td>
            </tr>
            <tr>
                <td>Room</td>
                <td>${room_join}${room_id}</td>
            </tr>
            <tr>
                <td>Date, Time</td>
                <td>${currentDataTime}</td>
            </tr>
        </table>
    `;
}

// ####################################################
// UTILITY
// ####################################################

function getCurrentDataTime() {
    const currentTime = new Date().toLocaleString('en-US', log.tzOptions);
    const milliseconds = String(new Date().getMilliseconds()).padStart(3, '0');
    return `${currentTime}:${milliseconds}`;
}

async function sendUserMessageToAdmin(userEmail, userName, userMessage) {
    const subject = `Collab Contact Message - ${userName}`;

    const body = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8" />
    <title>New Contact Message - Collab</title>
    </head>
    <body style="background-color: #f9fafb; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 24px; color: #1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 0 8px rgba(0,0,0,0.05); padding: 24px;">
        <tr>
        <td>
            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #2563eb; border-bottom: 4px solid #3b82f6; padding-bottom: 8px;">
            New Contact Message
            </h2>
            <p style="font-size: 15px; color: #374151; margin-bottom: 24px;">
            You have received a new message via the <strong>Collab</strong> contact form:
            </p>
            <table role="presentation" width="100%" style="font-size: 15px; color: #374151; border-collapse: collapse;">
            <tr>
                <td style="font-weight: 600; padding: 6px 8px; vertical-align: top; width: 120px;">Name:</td>
                <td style="padding: 6px 8px;">${userName}</td>
            </tr>
            <tr>
                <td style="font-weight: 600; padding: 6px 8px; vertical-align: top;">Email:</td>
                <td style="padding: 6px 8px;">${userEmail}</td>
            </tr>
            <tr>
                <td style="font-weight: 600; padding: 6px 8px; vertical-align: top;">Message:</td>
                <td style="padding: 6px 8px; white-space: pre-wrap;">${userMessage}</td>
            </tr>
            <tr>
                <td style="font-weight: 600; padding: 6px 8px; vertical-align: top;">Sent At:</td>
                <td style="padding: 6px 8px;">${getCurrentDataTime()}</td>
            </tr>
            </table>
            <p style="font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 32px; text-align: center;">
            This message was sent via the Collab platform. Please respond directly to the user's email if needed.
            </p>
        </td>
        </tr>
    </table>
    </body>
    </html>
    `;

    return transport.sendMail({
        from: `"${userEmail}" <${EMAIL_USERNAME}>`, // display name = user email
        to: EMAIL_SEND_TO,                          // send to your own admin/support email
        subject,
        html: body,
    }).catch((err) => log.error('sendUserMessageToAdmin Error', err));
}

module.exports = {
    sendEmailAlert,
    sendEmailVerification,
    sendUserMessageToAdmin,
};
