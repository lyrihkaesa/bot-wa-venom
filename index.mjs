import { create } from "venom-bot";
import { config } from "./config.mjs";
import { ArrButton } from "./tools/ArrayHandler.mjs";
import { addUserByNoWhatsapp, formatPhoneNumber, isRegistered } from "./notion/Users.mjs";
import { cmd } from "./tools/CommandHandlers.mjs";
import { readdirSync } from "fs";

const files = readdirSync("./commands").filter((file) => file.endsWith(".mjs"));
const map = new Map();

for (const file of files) {
  const { command } = await import(`./commands/${file}`);
  map.set(command.name, command);
}

create({
  session: "k-sama", //name of session
  // multidevice: false, // for version not multidevice use false.(default: true)
})
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

export const queueArr = {};

function start(client) {
  client.onMessage((message) => {
    // pengecekan prefix
    let args = [];
    let lowerCaseArgs = [];
    const replaceArgs = message.body.replace(/\n/g, " ");
    let msgBodyLower = replaceArgs.toLowerCase();
    config.PREFIX.forEach((prefix) => {
      if (msgBodyLower.startsWith(prefix)) {
        // memisahkan menjadi array pemisahnya "spasi".
        args = replaceArgs.substring(prefix.length).split(" ");
        lowerCaseArgs = msgBodyLower.substring(prefix.length).split(" ");
      }
    });

    console.info(args);
    console.info(lowerCaseArgs);
    console.log(`Apakah ada tidak sesuai? ${!args[0]}`);
    if (!args[0]) return;
    if (message.isMedia) return console.info("ini media");

    console.info("hallo world");
    // console.log(args);
    // console.log(message.id);
    // console.log(message.from);
    // console.log(message.to);
    // console.log(message.author);
    // console.log(message.body);
    // console.log(message.isGroupMsg);

    const NO_WHATSAPP = message.sender.id;
    (async () => {
      // perintah daftar
      client.startTyping(message.from);
      switch (lowerCaseArgs[0]) {
        case "daftar":
        case "register":
        case "signup": {
          const register = await addUserByNoWhatsapp(NO_WHATSAPP);
          if (register) {
            client
              .sendButtons(
                message.from,
                `✅ Pengguna berhasil *ditambahkan*.`,
                new ArrButton(".Profile set").getArrButton(),
                `☎ Nomor: ${formatPhoneNumber(NO_WHATSAPP)}`
              )
              .then((result) => {
                console.log("Result: ", result); //return object success
              })
              .catch((erro) => {
                console.error("Error when sending: ", erro); //return object error
              });
          } else {
            client
              .sendButtons(
                message.from,
                `📝 Pengguna sudah *terdaftar*.`,
                new ArrButton(".Profile", ".Profile set").getArrButton(),
                `☎ Nomor: ${formatPhoneNumber(NO_WHATSAPP)}`
              )
              .then((result) => {
                console.log("Result: ", result); //return object success
              })
              .catch((erro) => {
                console.error("Error when sending: ", erro); //return object error
              });
          }

          await client.stopTyping(message.from);
          return;
        }

        default:
          break;
      }
      // perintah lanjutan
      if (await isRegistered(NO_WHATSAPP)) {
        // if (message.isGroupMsg) {
        //   await entryToDbChat(message.id, message.author, message.body, message.from);
        // } else {
        //   await entryToDbChat(message.id, message.from, message.body, "");
        // }

        await cmd(client, message, map, lowerCaseArgs, args);
      } else {
        client
          .sendButtons(
            message.from,
            `Anda belum *terdaftar*!.`,
            new ArrButton(".Daftar 📥").getArrButton(),
            `☎ Nomor: ${formatPhoneNumber(NO_WHATSAPP)}`
          )
          .then((result) => {
            console.log("Result: ", result); //return object success
          })
          .catch((erro) => {
            console.error("Error when sending: ", erro); //return object error
          });
      }
      await client.stopTyping(message.from);
    })();
  });
}
