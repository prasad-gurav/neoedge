'use strict';

const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter = null;

function getTransporter() {
  if (!env.smtp.host) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth:
        env.smtp.user && env.smtp.pass
          ? { user: env.smtp.user, pass: env.smtp.pass }
          : undefined,
    });
  }
  return transporter;
}

async function sendMail(params) {
  const tx = getTransporter();
  if (!tx) {
    if (env.nodeEnv !== 'production') {
      console.log('[email.service] (no SMTP) would send:', params.to, params.subject);
    }
    return { skipped: true };
  }
  await tx.sendMail({
    from: env.smtp.from,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
  });
  return { skipped: false };
}

async function sendWelcomeEmail(params) {
  return sendMail({
    to: params.to,
    subject: 'Welcome to Neoedge',
    text: `Hi ${params.fullName},\n\nYour account has been created.\n`,
    html: `<p>Hi ${params.fullName},</p><p>Your account has been created.</p>`,
  });
}

module.exports = {
  sendMail,
  sendWelcomeEmail,
};
