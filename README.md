Setup DISCORD-CRM-BOILER

1. Set the environment variables for LOCAL DEV

DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
DISCORD_BOT_SECRET=""
NODE_ENV="development" <-- tells the app to use 'http://' and tells discord connect to redirect to 'http://localhost:3000/...'


2. Set the environment variables for PROD

DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
DISCORD_BOT_SECRET=""
PROD_URI="https://your-production-url.com" <-- discord connect redirectss to 'http://your-production-url/...'

/!\ Add the PROD callback URI to Discord connect config
--> it's here: https://discord.com/developers/applications/1174752417791889448/oauth2/general
--> the callback URI is: PROD_URI/login/discord/callback