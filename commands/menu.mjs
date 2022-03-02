import { config } from "../config.mjs";

export const command = {
  name: "menu",
  desc: "Apalah ini hanya deskripsi info",
  execute(client, message, args) {
    if (args[1]) {
      if (args[1] === "bot") {
        client.sendText(message.from, "Kaesa BOT v0.0.1");
      } else if (args[1] === "user") {
        console.log(message);
      }
    } else {
      client.sendText(message.from, `*Kaesa BOT ${config.VERSION}*`);
    }
  },
};
