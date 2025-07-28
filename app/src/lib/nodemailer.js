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

function sendEmailVerification(email, token) {
    const verifyLink = `${config?.server?.hostUrl}/verify-email?email=${email}&token=${token}`;

    const subject = 'Verify your email';
    const body = 
    `
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Collab Account</title>
        <style type="text/css">
            @media screen and (max-width: 600px) {
                .main-container {
                    width: 100% !important;
                    padding: 24px !important;
                }
                .content-card {
                    padding: 24px !important;
                }
                .heading {
                    font-size: 24px !important;
                }
            }
        </style>
    </head>
    <body style="margin:0;padding:0;background-color:#f9fafb;font-family:Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center" style="padding:40px 10px;">
                    <table class="main-container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:12px;padding:48px;box-shadow:0 10px 25px rgba(0,0,0,0.05);">
                        <tr>
                            <td align="center" style="padding-bottom:32px;">
                                <h1 class="heading" style="font-size:30px;font-weight:800;margin:0;color:#111827;line-height:1.25;">
                                    <span style="color:#2563eb;">Verify</span> your email address
                                </h1>
                            </td>
                        </tr>
                        <tr>
                            <td class="content-card" style="background-color:#f8fafc;border-radius:12px;padding:32px;margin-bottom:40px;border:1px solid #e2e8f0;">
                                <p style="font-size:18px;color:#4b5563;text-align:center;margin:0 0 24px 0;line-height:1.5;">
                                    Thanks for signing up for <strong style="color:#111827;">Collab</strong>! Please confirm your email to activate your account.
                                </p>
                                <div style="text-align:center;">
                                    <a href="${verifyLink}" style="display:inline-block;background-color:#2563eb;color:#ffffff;padding:12px 32px;font-size:16px;font-weight:600;border-radius:12px;text-decoration:none;">
                                        Verify Email Address
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding-bottom:16px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td align="center" style="padding-bottom:15px;">
                                <p style="font-size:16px;color:#6b7280;text-align:center;margin:0;font-style:italic;">
                                    "No downloads. No delays. Just click and connect."
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding-bottom:32px;">
                                <div style="background-color:#fef2f2;color:#dc2626;padding:8px 16px;border-radius:50px;font-size:14px;display:inline-block;">
                                    <span style="width:12px;height:12px;background-color:#dc2626;border-radius:50%;margin-right:8px;display:inline-block;vertical-align:middle;"></span>
                                    <span style="vertical-align:middle;">Link expires in 24 hours</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="border-top:1px solid #e5e7eb;padding-top:32px;">
                                <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0;">
                                    If you didn't request this email, you can safely ignore it.<br>
                                    <span style="color:#2563eb;font-weight:600;">Collab Team</span>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    return transport
        .sendMail({
            from: EMAIL_USERNAME,
            to: email,
            subject,
            html: body,
        })
        .catch((err) => log.error('sendEmailVerification Error', err));
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

module.exports = {
    sendEmailAlert,
    sendEmailVerification,
};
