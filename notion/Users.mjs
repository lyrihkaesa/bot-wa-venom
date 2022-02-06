import { Client, APIErrorCode } from "@notionhq/client";
import { NOTION_API_KEY, DB_USERS } from "../config.json";

// Initializing a client
const notion = new Client({
  auth: NOTION_API_KEY,
});

const listUsersResponse = await notion.users.list({});
// console.log(listUsersResponse);
const databaseUsers = DB_USERS;

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

export async function getUsers() {
  const qUsers = await notion.databases.query({ database_id: databaseUsers });
  let users = [];
  for (const element of qUsers.results) {
    let user = {
      name: "",
      no_whatsapp: "",
    };
    user.no_whatsapp = element.properties.no_whatsapp.phone_number;
    for (const eName of element.properties.name.title) {
      user.name = eName.plain_text;
    }
    users.push(user);
  }
  //   console.log(users);
  return users;
}

export async function addUsers(name, no_whatsapp) {
  const response = await notion.pages.create({
    parent: {
      database_id: databaseUsers,
    },
    icon: {
      type: "emoji",
      emoji: "👤",
    },
    properties: {
      name: {
        title: [
          {
            text: {
              content: `${name}`,
            },
          },
        ],
      },
      no_whatsapp: {
        phone_number: `${no_whatsapp}`,
      },
    },
  });
  console.log(response);
}
