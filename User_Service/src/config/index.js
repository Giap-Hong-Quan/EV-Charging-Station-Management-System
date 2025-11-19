const oauth_google = {
  client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
  client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
  endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI || "",
  scopes:
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
};

module.exports = oauth_google;
