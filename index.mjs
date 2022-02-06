import { create, Whatsapp } from "venom-bot";
import { addUsers, getUsers } from "./notion/Users.mjs";

create({
  session: "k-sama", //name of session
  // multidevice: false, // for version not multidevice use false.(default: true)
})
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  let parentMessage = "";
  client.onMessage((message) => {
    console.log(message);
    let arrayMessage = message.body.split(" | ");
    if (message.body === "Hi") {
      console.log(message);
      console.info("----------------------------");
      // console.log(message.chatId);
      // console.log(message.groupMetadata.id);
      async function a() {
        let contoh = await client.getGroupMembers(message.chatId);
        console.log(contoh);
        client.sendText(message.from, `${contoh}`);
      }
      a();
      client
        .sendText(message.from, "Welcome Venom 🕷")
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    } else if (message.body === "list" && message.isGroupMsg === false) {
      const list = [
        {
          title: "Pasta",
          rows: [
            {
              title: "Ravioli Lasagna",
              description: "Made with layers of frozen cheese",
            },
          ],
        },
        {
          title: "Dessert",
          rows: [
            {
              title: "Owh Udah too",
              description: "Sweets pecan baklava rolls",
            },
            {
              title: "Lemon Meringue Pie",
              description: "Pastry filled with lemonand meringue.",
            },
          ],
        },
      ];

      client
        .sendListMenu(message.from, "Title", "subTitle", "Description", "menu", list)
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    } else if (message.body === "list users") {
      client.startTyping(`${message.from}`);
      let users = getUsers();
      users
        .then((value) => {
          let jawaban = "*Daftar Pengguna*\n===============\n\n";
          let i = 1;
          for (const element of value) {
            jawaban += `*No:* ${i} \n`;
            jawaban += `*Nama:* ${element.name} \n`;
            jawaban += `*No_WA:* _${element.no_whatsapp}_ \n`;
            jawaban += `__________\n\n`;
            i++;
          }
          jawaban += `\nBy: Chatbot Kaesa`;
          client.sendText(message.from, jawaban);
        })
        .catch((err) => console.log(err));
      client.stopTyping(`${message.from}`);
    } else if (arrayMessage[0] === "add users") {
      client.startTyping(`${message.from}`);
      if (arrayMessage[1] === undefined) return;
      else {
        addUsers(arrayMessage[1], arrayMessage[2]);
        client.sendText(
          message.from,
          `✅ Pengguna dengan *Nama:* ${arrayMessage[1]}, dan *No_WA:* ${arrayMessage[2]} sukses ditambahkan.`
        );
      }
      client.stopTyping(`${message.from}`);
    } else if (arrayMessage[0] === "g user" && message.isGroupMsg) {
      client.startTyping(`${message.from}`);
      (async () => {
        let res = await client.getGroupMembers(`${message.from}`);
        let jawaban = "*Daftar Anggota Grup*\n===============\n";
        let i = 1;
        for (const user of res) {
          jawaban += `*No:* ${i} \n`;
          jawaban += `*Nama:* ${user.name} \n`;
          jawaban += `*No_WA:* _${user.id.user}_ \n`;
          jawaban += `__________\n\n`;
          i++;
        }
        jawaban += `\nBy: Chatbot Kaesa`;
        client.sendText(message.from, jawaban);
        client.stopTyping(`${message.from}`);
      })();
    } else if (arrayMessage[0] === "tambah user") {
      console.log(message);
      parentMessage = arrayMessage[0];
      console.log(parentMessage);
      // console.log(message);
      client.reply(message.from, "Masukan nama:", message.id);
    } else if (parentMessage === "tambah user") {
      if (message.body != "Ya") {
        const buttons = [
          {
            buttonText: {
              displayText: "Ya",
            },
          },
          {
            buttonText: {
              displayText: "Tidak",
            },
          },
        ];
        client
          .sendButtons(message.from, `👤 Nama: ${message.body}`, buttons, "Apakah setuju dengan nama diatas?")
          .then((result) => {
            console.log("Result: ", result); //return object success
          })
          .catch((erro) => {
            console.error("Error when sending: ", erro); //return object error
          });
      }
      if (message.body === "Ya") {
        client.sendText(message.from, "✔ User berhasil ditambahkan");
        parentMessage = "";
      }
    }
  });
}
