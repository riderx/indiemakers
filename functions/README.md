# Discord dev local

- create test firebase account
- create service account
- create test discord guild
- use ngrock `./ngrok http 4000` to connect your local env to discord intent url
- set your app_id, guid_id, and bot_token in .env file (use .env.template as template)
- deploy your discord command guild with `npm run discord_config`
- connect your discord bot to the intent with url `http://UUID.ngrok.io/api/bot` in bot setting (`INTERACTIONS ENDPOINT URL`)
- run your server with `npm run discord_local`
- test discord command /im
- then deploy and use the prod url `https://us-central1-indiemakerfr.cloudfunctions.net/bot`

# How it's working 

The current bot respond fast a loading message, and then take time to process ans send the final responde, it's allowed by discord to take up to 15min, instead of the 3 sec usual wait time.
## doc discord
https://discord.com/developers/docs/interactions/slash-commands#what-is-a-slash-command
