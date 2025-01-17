const { google } = require('googleapis');
const config = require('../utils/config');
const logger = require('../utils/logger');
const { JSDOM } = require('jsdom');

async function fetchEmails() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const response = await gmail.users.messages.list({ userId: 'me', maxResults: 1 });
    const messages = response.data.messages || [];

    const emails = [];
    for (const message of messages) {
        const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
        const payload = email.data.payload;

        const headers = payload.headers.reduce((acc, header) => {
            acc[header.name.toLowerCase()] = header.value;
            return acc;
        }, {});

        // Function to recursively extract the body from payload parts
        const extractBody = (parts) => {
            for (const part of parts) {
                if (part.mimeType === 'text/plain' && part.body?.data) {
                    return Buffer.from(part.body.data, 'base64').toString('utf-8');
                } else if (part.mimeType === 'text/html' && part.body?.data) {
                    return Buffer.from(part.body.data, 'base64').toString('utf-8');
                } else if (part.parts) {
                    const body = extractBody(part.parts);
                    if (body) return body;
                }
            }
            return null;
        };

        // Extract the email body
        let body = '';
        if (payload.body?.data) {
            body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
        } else if (payload.parts) {
            body = extractBody(payload.parts) || '(No Body Content)';
        }

        // Parse HTML to plain text if needed
        let plainTextBody = body;
        if (body.startsWith('<')) {
            const dom = new JSDOM(body);
            plainTextBody = dom.window.document.body.textContent || '';
        }

        // Extract attachments
        const attachments = [];
        if (payload.parts) {
            for (const part of payload.parts) {
                if (part.filename && part.body?.attachmentId) {
                    const attachment = await gmail.users.messages.attachments.get({
                        userId: 'me',
                        messageId: message.id,
                        id: part.body.attachmentId,
                    });

                    attachments.push({
                        filename: part.filename,
                        mimeType: part.mimeType,
                        data: Buffer.from(attachment.data.data, 'base64'),
                    });
                }
            }
        }

        emails.push({
            subject: headers.subject || '(No Subject)',
            body: plainTextBody || '(No Body Content)',
            rawHtml: body, // Keep raw HTML if needed
            attachments,
        });
    }

    logger.info('Fetched emails successfully.');
    return emails;
}

module.exports = { fetchEmails };
