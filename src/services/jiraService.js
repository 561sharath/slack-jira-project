const JiraClient = require('jira-client');
const config = require('../utils/config');
const logger = require('../utils/logger');

const jira = new JiraClient({
    protocol: 'https',
    host: config.jira.host,
    username: config.jira.user,
    password: config.jira.apiToken,
    apiVersion: '2',
    strictSSL: true,
});

async function createJiraTicket(subject, body, attachments = []) {
    logger.info(`Creating Jira ticket with subject: ${subject}`);
    // logger.info(decodeURIComponent(body));
    const issue = await jira.addNewIssue({
        fields: {
            project: { key: config.jira.projectKey },
            summary: subject,
            description: body,
            issuetype: { name: 'Bug' },
        },
    });

    logger.info(`Created Jira ticket: ${issue.key}`);
    return `https://${config.jira.host}/browse/${issue.key}`;
}

module.exports = { createJiraTicket };
