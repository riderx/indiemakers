import requests


# url = "https://discord.com/api/v8/applications/<my_application_id>/commands"
app_id = "836720524352421919"
guild_id = "781848762057228289"
url = f"https://discord.com/api/v8/applications/{app_id}/guilds/{guild_id}/commands"
# Connect im bot to im guild
# https://discord.com/api/oauth2/authorize?client_id=836720524352421919&permissions=8&scope=applications.commands%20bot
json = {
    "name": "im",
    "description": "Le bot qui nous pousse an faire mieux dans nos projets!",
    "options": [
        {
            "name": "karma",
            "description": "Echange du karma avec un autre membre du discord",
            "type": 2,
            "options": [
                {
                    "name": "donner",
                    "description": "Donner du karma",
                    "type": 1,
                    "options": [
                        {
                            "name": "user",
                            "description": "Le maker a cibler",
                            "type": 6,
                            "required": True
                        }
                    ]
                },
                {
                    "name": "enlever",
                    "description": "Enlever du karma",
                    "type": 1,
                    "options": [
                        {
                            "name": "user",
                            "description": "Le maker a cibler",
                            "type": 6,
                            "required": True
                        }
                    ]
                },
                {
                    "name": "stats",
                    "description": "Voir le karma d'un maker",
                    "type": 1,
                    "options": [
                        {
                            "name": "user",
                            "description": "Le maker a cibler",
                            "type": 6,
                            "required": True
                        }
                    ]
                },
                {
                    "name": "classement",
                    "description": "Le classement des makers par karma",
                    "type": 1,
                }
            ]
        },
    ]
}

# For authorization, you can use either your bot token
headers = {
    "Authorization": "Bot ODM2NzIwNTI0MzUyNDIxOTE5.YIiGtg.8BkrHNpsQU0nvcqv-e228grwNy4"
}

# # or a client credentials token for your app with the applications.commands.update scope
# headers = {
#     "Authorization": "Bearer IQBahdk7wW2IzSv40BvfbSjletCO41pI"
# }

r = requests.post(url, headers=headers, json=json)

print(r.json())
