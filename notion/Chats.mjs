import { Client, APIErrorCode } from "@notionhq/client";
import { NOTION_API_KEY, DB_CHATS } from "../config.json";

// Initializing a client
const notion = new Client({
  auth: NOTION_API_KEY,
});

const databaseChats = DB_CHATS;

// try {
//   const myPage = await notion.databases.query({
//     database_id: databaseId,
//   });
//   console.log(myPage);
// } catch (error) {
//   if (error.code === APIErrorCode.ObjectNotFound) {
//     //
//     // For example: handle by asking the user to select a different database
//     //
//   } else {
//     // Other error handling code
//     console.error(error);
//   }
// }

//   const response = await notion.databases.retrieve({ database_id: databaseUsers });
//   console.log(response);

export async function getChats() {
  const qChats = await notion.databases.query({ database_id: databaseChats });
  let chat = {};
  for (const element of qChats.results) {
    chat.id_chat = element.properties.id_chat.title[0].text.content;
    chat.no_whatsapp = element.properties.no_whatsapp.phone_number;
    chat.name = element.properties.name.rich_text[0].text.content;
    chat.body = element.properties.body.rich_text[0].text.content;
  }
  return chat;
}

getChats();

export async function addChat(id_chat, name, no_whatsapp, body) {
  const response = await notion.pages.create({
    parent: {
      database_id: databaseChats,
    },
    icon: {
      type: "emoji",
      emoji: "💬",
    },
    properties: {
      id_chat: {
        title: [
          {
            text: {
              content: `${id_chat}`,
            },
          },
        ],
      },
      no_whatsapp: {
        phone_number: `${no_whatsapp}`,
      },
      name: {
        rich_text: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
      body: {
        rich_text: [
          {
            text: {
              content: body,
            },
          },
        ],
      },
    },
  });
  console.log(response);
}
