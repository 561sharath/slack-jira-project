const { fetchEmails } = require('./services/gmailService');
const { createJiraTicket } = require('./services/jiraService');
// const { notifySlack } = require('./services/slackService');
const logger = require('./utils/logger');

async function main() {
    try {
        const emails = await fetchEmails();
        for (const email of emails) {
            const ticketUrl = await createJiraTicket(email.subject, email.body, email.attachments);
            logger.info(ticketUrl);
            // await notifySlack(ticketUrl);
        }
    } catch (error) {
        logger.error(`Error: ${error}`);
    }
}

main();
