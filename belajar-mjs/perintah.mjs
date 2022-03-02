let profileKaesa = {
  name: "Kaesa lyrih",
  no_whatsapp: "628123456789@c.us",
};

const PREFIX = [".", "/", "Ksa ", "KSA ", "ksa ", "Kaesa ", "kaesa ", ". "];

let perintah = "kaesa profile set name | Kukuh Setya Arumansyah";

let args1;
let args2;

PREFIX.forEach((prefix) => {
  if (perintah.startsWith(prefix)) {
    // memisahkan menjadi array pemisahnya "spasi".
    args1 = perintah.substring(prefix.length).split(" | ");
  }
});

console.log(args1[1].split(" "));


case "contact":
        case "kontak":
          {
            const contacts = await client.getAllContacts();
            const contact = await client.getContact("6282226660205@c.us");
            console.log(contact);
          }
          break;
        case "chat1":
          {
            const chats = await client.getAllChats();
            // console.log("chats :>> ", chats);
            chats.forEach((element) => {
              if (element.isGroup) {
                console.log("isGroup :>> ", element);
              }
              // console.log("element :>> ", element);
              // console.log("element :>> ", element.id);
            });
          }
          break;
        case "chat2":
          {
            const chatContacts = await client.getAllChatsContacts();
            // console.log("chatContacts :>> ", chatContacts);
            chatContacts.forEach((element) => {
              console.log("element :>> ", element.name);
              console.log("element :>> ", element.id);
            });
          }
          break;
        case "chat3":
          {
            const transmission = await client.getAllChatsTransmission();
            console.log("transmission :>> ", transmission);
          }
          break;
        case "chat4":
          {
            const allChatsNewMsg = await client.getAllChatsNewMsg();
            // console.log("allChatsNewMsg :>> ", allChatsNewMsg);
            allChatsNewMsg.forEach(function (value) {
              console.log(value.lastRecivedKey);
              console.log(value.contact.id);
              console.log(value.presence);
            });
          }
          break;
        case "chat5":
          {
            const allChatsWithMessages = await client.getAllChatsWithMessages();
            // console.log("allChatsWithMessages :>> ", allChatsWithMessages);
            allChatsWithMessages.forEach(function (value) {
              console.log(value.msgs);
            });
          }
          break;