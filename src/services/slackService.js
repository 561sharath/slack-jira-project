const { WebClient } = require('@slack/web-api');
const config = require('../utils/config');
const logger = require('../utils/logger');

const slackClient = new WebClient(config.slack.token);

// Function to notify Slack with a Jira ticket URL
async function notifySlack(ticketUrl) {
    try {
        // Automatically posting to the channel
        const result = await slackClient.chat.postMessage({
            channel: config.slack.channel, // Channel name or ID
            text: `New Jira ticket created: ${ticketUrl}`,
        });

        logger.info(`Notification sent to Slack. Message ID: ${result.ts}`);
    } catch (error) {
        logger.error('Error sending notification to Slack:', error);
    }
}

module.exports = { notifySlack };
