require('dotenv').config();

module.exports = {
    gmail: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
    jira: {
        host: process.env.JIRA_HOST,
        user: process.env.JIRA_USER,
        apiToken: process.env.JIRA_API_TOKEN,
        projectKey: process.env.JIRA_PROJECT_KEY,
    },
    slack: {
        token: process.env.SLACK_TOKEN,
        channel: process.env.SLACK_CHANNEL,
    },
};
