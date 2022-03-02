export const command = {
  name: "ping",
  desc: "Apalah ini hanya deskripsi",
  execute(client, message) {
    client.sendText(message.from, "pong");
  },
};
