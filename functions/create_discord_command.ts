import axios from "axios";
import * as dotenv from "dotenv";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

dotenv.config();

const url = `https://discord.com/api/v8/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`
// Connect im bot to im guild
// https://discord.com/api/oauth2/authorize?client_id=836720524352421919&permissions=8&scope=applications.commands%20bot
const projetHashtag =   {
  "name": "hashtag",
  "description": "Le hashtag de ton projet (nom sans espaces)",
  "type": 3,
  "required": true
};
const taskAdd =   {
  "name": "ajouter",
  "description": "ajouter une tache a un projet",
  "type": 1,
  "options": [
    projetHashtag,
    {
      "name": "titre",
      "description": "titre de la tache",
      "type": 3,
      "required": true,
    }
  ]
};
const taskEdit =   {
  "name": "modifier",
  "description": "Modifier une tache d'un projet",
  "type": 1,
  "options": [
    projetHashtag,
    {
      "name": "id",
      "description": "id de la tache",
      "type": 3,
      "required": true,
    },
    {
      "name": "titre",
      "description": "titre de la tache",
      "type": 3,
      "required": true,
    }
  ]
};
const taskDelete = {
  "name": "supprimer",
  "description": "Supprimer une tache d'un projet",
  "type": 1,
  "options": [
    projetHashtag,
    {
      "name": "id",
      "description": "id de la tache",
      "type": 3,
      "required": true,
    }
  ]
};
const taskList =   {
  "name": "liste",
  "description": "Voir toute la liste des taches d'un projet",
  "type": 1,
  "options": [projetHashtag]
};
const makerOption = {
  "name": "user",
  "description": "Le maker désiré",
  "type": 6,
  "required": true
}
const makerOptionalOption = {
  "name": "user",
  "description": "Le maker désiré",
  "type": 6,
  "required": false
}
const projetOptions = [
  projetHashtag,
  {
    "name": "name",
    "description": "Le nom de ton projet",
    "type": 3,
  },
  {
    "name": "pitch",
    "description": "une descrition courte de ton projet",
    "type": 3,
  },
  {
    "name": "website",
    "description": "le site de ton projet",
    "type": 3,
  },
  {
    "name": "emoji",
    "description": "l'émoji qui correspond le plus a ton projet",
    "type": 3,
  },
  {
    "name": "categories",
    "description": "les categorie de ton projet (SAAS, podcast, etc)",
    "type": 3,
  },
  {
    "name": "logo",
    "description": "l'url vers le logo de ton projet",
    "type": 3,
  }
]
const jsonData = {
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
                    "options": [makerOption]
                },
                {
                    "name": "enlever",
                    "description": "Enlever du karma",
                    "type": 1,
                    "options": [makerOption]
                },
                {
                    "name": "stats",
                    "description": "Voir le karma d'un maker",
                    "type": 1,
                    "options": [makerOption]
                },
                {
                    "name": "classement",
                    "description": "Le classement des makers par karma",
                    "type": 1,
                }
            ]
        },
        {
          "name": "projet",
          "description": "Construit en public des super projets!",
          "type": 2,
          "options": [
              {
                  "name": "creer",
                  "description": "Cree ton projet",
                  "type": 1,
                  "options": projetOptions
              },
              {
                  "name": "modifier",
                  "description": "Modifie un de tes projets",
                  "type": 1,
                  "options": projetOptions
              },
              {
                "name": "supprimer",
                "description": "Supprimer un de tes projets",
                "type": 1,
                "options": [projetHashtag]
              },
              {
                  "name": "liste",
                  "description": "Voir la liste de tes projets",
                  "type": 1,
                  "options": [makerOptionalOption]
              },
              {
                  "name": "voir",
                  "description": "Voir un seul projet",
                  "type": 1,
                  "options": [projetHashtag]
              }
          ]
      },
      {
        "name": "tache",
        "description": "gere les tache d'un projet",
        "type": 2,
        "options": [
          taskAdd,
          taskList,
          taskEdit,
          taskDelete,
        ]
    },
    ]
}

//  For authorization, you can use either your bot token
const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN}`
}

axios.post(url, jsonData, {headers}).then((data) => {
  console.log('result', data.statusText);
}).catch((err) => {
  console.error(err.response);
  console.error(JSON.stringify(err.response.data.errors.options));
  console.error(err.response.statusText);
});
