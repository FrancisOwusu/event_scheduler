const express = require("express");
const dotenv = require("dotenv");
const { google } = require('googleapis');
dotenv.config();

const app = express();

const port = process.env.PORT || 9000;
 
app.get("/", (req, res) => {
  res.send("Hello World");
});

//define scope of access for the Google Calender API
const scopes = ['https://www.googleapis.com/auth/calendar'];

//OAuth 2 configuration
const oauth2Client = new google.auth.OAuth2
(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

app.get('/auth',(req,res)=>{
  const url = oauth2Client.generateAuthUrl
  ({
      access_type: 'offline',
      scope: scopes
  });
  res.redirect(url);
  }
);

app.get("/auth/redirect", async (req, res) => {

  const {tokens} = await oauth2Client.getToken(req.query.code);
  oauth2Client.setCredentials(tokens);
  res.send('Authentication successful! Please return to the console.');
  }

);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});