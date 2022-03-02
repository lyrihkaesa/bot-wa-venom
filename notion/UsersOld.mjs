import { Client, APIErrorCode } from "@notionhq/client";
import { config } from "../config.mjs";

// Initializing a client
const notion = new Client({
  auth: config.NOTION_API_KEY,
});

export const Users = {
  async get(no_whatsapp) {
    try {
      const myPage = await notion.databases.query({
        database_id: config.DB_USERS,
        filter: {
          or: [
            {
              property: "no_whatsapp",
              text: {
                contains: no_whatsapp,
              },
            },
          ],
        },
      });

      const res = myPage.results[0];
      if (res != undefined) {
        let profile = {};
        let properties = {};
        profile.id = res.id;
        profile.created_time = res.created_time;
        profile.last_edited_time = res.last_edited_time;
        profile.emoji = res.icon.emoji;

        for (const key in res.properties) {
          if (Object.hasOwnProperty.call(res.properties, key)) {
            const element = res.properties[key];
            if (element.type === "select") {
              properties[`${key}`] = element.select.name;
            }
            if (element.type === "rich_text") {
              properties[`${key}`] = element.rich_text[0].text.content;
            }
            if (element.type === "email") {
              properties[`${key}`] = element.email;
            }
            if (element.type === "relation") {
              properties[`${key}`] = element.relation;
            }
            if (element.type === "date") {
              properties[`${key}`] = element.date;
            }
            if (element.type === "title") {
              properties[`${key}`] = element.title[0].text.content;
            }
          }
        }

        profile.properties = properties;
        return profile;
      } else {
        return 0;
      }
    } catch (error) {
      if (error.code === APIErrorCode.ObjectNotFound) {
        //
        // For example: handle by asking the user to select a different database
        //
      } else {
        // Other error handling code
        console.error(error);
      }
    }
  },
};

const dapatUser = await Users.get("6282226660201");
console.log(dapatUser);

//   const response = await notion.databases.retrieve({ database_id: databaseUsers });
//   console.log(response);

// export async function getUsers() {
//   const qUsers = await notion.databases.query({ database_id: databaseUsers });
//   let users = [];
//   for (const element of qUsers.results) {
//     let user = {
//       name: "",
//       no_whatsapp: "",
//     };
//     user.no_whatsapp = element.properties.no_whatsapp.phone_number;
//     for (const eName of element.properties.name.title) {
//       user.name = eName.plain_text;
//     }
//     users.push(user);
//   }
//   //   console.log(users);
//   return users;
// }

// export async function addUsers(name, no_whatsapp) {
//   const response = await notion.pages.create({
//     parent: {
//       database_id: databaseUsers,
//     },
//     icon: {
//       type: "emoji",
//       emoji: "👤",
//     },
//     properties: {
//       name: {
//         title: [
//           {
//             text: {
//               content: `${name}`,
//             },
//           },
//         ],
//       },
//       no_whatsapp: {
//         phone_number: `${no_whatsapp}`,
//       },
//     },
//   });
//   console.log(response);
// }
