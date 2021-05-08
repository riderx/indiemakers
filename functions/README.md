# Discord dev local

- create test firebase account
- create service account
- create test discord guild
- use ngrock `./ngrok http 4000` to connect your local env to discord intent url
- set your app_id, guid_id, and bot token in create_commands.py
- deploy your discord command guild with `python3 create_commands.py`
- connect your discord bot to the intent with url `http://UUID.ngrok.io/discord_interaction` in bot setting
- run your server with `npm run discord_local.ts`
- test discord command /im
- then deploy and use the prod `https://us-central1-indiemakerfr.cloudfunctions.net/discord_interaction`

## doc discord
https://discord.com/developers/docs/interactions/slash-commands#what-is-a-slash-command
