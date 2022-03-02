import { config } from "../config.mjs";
import { ArrButton, list } from "./ArrayHandler.mjs";

export async function cmd(client, message, map, lowerCaseArgs, args) {
  switch (lowerCaseArgs[0]) {
    case "p":
    case "ping":
      {
        map.get("ping").execute(client, message);
      }
      break;

    case "info":
      {
        map.get("info").execute(client, message, args);
      }
      break;

    case "menu":
      {
        map.get("menu").execute(client, message, args);
      }
      break;

    case "profile":
    case "profil":
      {
        await map.get("profile").execute(client, message, lowerCaseArgs, args);
        await client.stopTyping(message.from);
      }
      break;

    case "group":
    case "grup":
      {
        if (message.isGroupMsg) {
          await map.get("group").execute(client, message, lowerCaseArgs, args);
        } else {
          await client.sendText(message.from, "⚠ Perintah ini hanya bisa digunakan pada *GRUP*!");
        }
        await client.stopTyping(message.from);
      }
      break;

    case "main":
      {
        client
          .sendListMenu(message.from, `📚 Daftar Menu ${config.VERSION}`, "dimana gak tahu", `Prefix: ${config.PREFIX}`, "Menu 📚", list)
          .then((result) => {
            console.log("Result: ", result); //return object success
          })
          .catch((erro) => {
            console.error("Error when sending: ", erro); //return object error
          });
      }
      break;

    case "krs":
      {
        await map.get("krs").execute(client, message, lowerCaseArgs, args);
        await client.stopTyping(message.from);
      }
      break;

    default:
      break;
  }
}
