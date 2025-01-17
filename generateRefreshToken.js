const { google } = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// Generate the URL for authorization
const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
});

console.log('Authorize this app by visiting this URL:', url);

// After authorization, use the authorization code to get a refresh token
const getRefreshToken = async (authCode) => {
    try {
        const { tokens } = await oauth2Client.getToken(authCode);
        console.log('Your refresh token is:', tokens.refresh_token);
    } catch (error) {
        console.error('Error retrieving refresh token:', error);
    }
};

// Uncomment this line and replace 'authorization-code' with the code from the URL
 getRefreshToken('4/0AanRRrtS5CQSFHuf1arpYjGOODAnBL07_r23LKsu54AFEWYk-rAbeSolbUc0SQ1xPaD8ow');
