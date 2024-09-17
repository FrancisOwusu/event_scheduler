const express = require("express");
const dotenv = require("dotenv");
const { google } = require("googleapis");
const {v4:uuidv4} = require("uuid");
dotenv.config();

const app = express();

const port = process.env.PORT || 9000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

//define scope of access for the Google Calender API
const scopes = ["https://www.googleapis.com/auth/calendar"];

//OAuth 2 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

app.get("/auth", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.redirect(url);
});

app.get("/auth/redirect", async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code);
  oauth2Client.setCredentials(tokens);
  res.send("Authentication successful! Please return to the console.");
});

const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client,
});

const event = {
  summary: "Tech Talk with Arindam",
  location: "Google Meet",

  description: "Demo event for Arindam's Blog Post.",
  start: {
    dateTime: "2024-03-14T19:30:00+05:30",
    timeZone: "Asia/Kolkata",
  },
  end: {
    dateTime: "2024-03-14T20:30:00+05:30",
    timeZone: "Asia/Kolkata",
  },
  colorId: 1,
  conferenceData: {
    createRequest: {
      requestId: uuidv4()
    },
  },

  attendees: [{ email: "osei1257@gmail.com" }],
};
app.get("/create-event", async (req, res) => {
  try {
    const result = await calendar.events.insert({
      calendarId: "primary",
      auth: oauth2Client,
      conferenceDataVersion: 1,
      sendUpdates: "all",
      resource: event,
    });

    res.send({
      status: 200,
      message: "Event created",
      link: result.data.hangoutLink,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
