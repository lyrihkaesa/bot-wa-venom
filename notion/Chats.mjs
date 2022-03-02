import { config } from "../config.mjs";
import { KaesaNotion, getPagesAuto } from "./Notion.mjs";
import { getIdPagesUser } from "./Users.mjs";

const chat = new KaesaNotion(config.NOTION_API_KEY, config.DB_CHATS);
const qChat = await chat.query();
// console.log(qChat);
qChat.results.forEach(function (value) {
  // console.log(value);
  // console.log(value.properties.body.rich_text[0]?.text.content);
});

// const uuu = getPagesAuto(qChat);
// // console.log(uuu);
// uuu.forEach(function (val, idx) {
//   console.log(val.id);
// });

export async function entryToDbChat(id_chat, no_whatsapp, body, id_group) {
  const response = await chat.notion.pages.create({
    parent: {
      database_id: config.DB_CHATS,
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
              content: id_chat,
            },
          },
        ],
      },
      no_whatsapp: {
        rich_text: [
          {
            text: {
              content: no_whatsapp,
            },
          },
        ],
      },
      no_whatsapp_x: {
        relation: [
          {
            id: await getIdPagesUser(no_whatsapp),
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
      id_group: {
        rich_text: [
          {
            text: {
              content: id_group,
            },
          },
        ],
      },
    },
  });

  // console.log(response);
}
