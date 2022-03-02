import { getMatkulIdByName, setUrlKrs04 } from "../notion/KrsSemester04.mjs";
import { capitalizeFirstLetter } from "../notion/Notion.mjs";
import { Divider } from "../tools/ArrayHandler.mjs";

export const command = {
  name: "krs",
  desc: "krs",
  async execute(client, message, lowerCaseArgs, args) {
    const divider = new Divider();
    switch (lowerCaseArgs[1]) {
      case "matkul":
        {
          const resultArray = message.body.split(args[1]);
          const resultTrim = resultArray[1].trim();
          const courses = await getMatkulIdByName(resultTrim);
          let answer = "";
          answer += `🔎 *Matkul:* ${resultTrim}\n`;
          if (!courses.length) {
            answer += divider.up;
            answer += "┃ 🚫 404 Not Found.\n";
            answer += "┃ 🚫 404 Tidak ditemukan.\n";
            answer += divider.down;
          } else {
            answer += `🔄 _About *${courses.length}* results_\n`;
            answer += divider.line;
            courses.forEach(function (value) {
              //   console.log(value);
              const kel_id = [];
              for (let index = 0; index < value.pageKelIds.length; index++) {
                const element = value.pageKelIds[index];
                kel_id.push(`┃┃ ${element.kel_id}\n${!!element.url ? `${element.url}` : "┃┃ 🚫 _Kosong (Empty)_"}`);
              }
              const str_kel_id = kel_id.join("\n");
              answer += `📙 *${capitalizeFirstLetter(value.name)}*\n`;
              answer += `┃ ${value.id}\n`;
              answer += `┃ _Id_Kelompok (KLPK) [${kel_id.length}]:_\n${str_kel_id}\n\n`;
              answer += `.krs link ${value.id}\n`;
              answer += divider.line;
            });
            // answer += divider.line
          }
          client.sendText(message.from, answer);
        }
        break;

      case "link":
      case "url":
      case "tautan":
        {
          let defaultAnswer = `Input Link Grup:\nKaesa krs link Id_Matkul Id_Kelompok Link_Grup\n\n`;
          defaultAnswer = `↘ *Misalnya:*\nKaesa krs link A12.66401 A12.6406 https://chat.whatsapp.com/xxxxxxxxxxxx`;
          let answer = "";
          if (!args[2]) {
            answer += `⚠ Warning 3:\n┃ Anda belum menginputkan *Id_Matkul & Id_Kelompok & Link_Grup*\n\n`;
            answer += defaultAnswer;
          } else if (!args[3]) {
            answer += `⚠ Warning 2:\n┃ Anda belum menginputkan *Id_Kelompok & Link_Grup*\n\n`;
            answer += defaultAnswer;
          } else if (!args[4]) {
            answer += `⚠ Warning 1:\n┃ Anda belum menginputkan *Link_Grup*\n\n`;
            answer += defaultAnswer;
          } else {
            const matkul_id = args[2];
            const kel_id = args[3];
            const url = args[4];
            const res = await setUrlKrs04(matkul_id, kel_id, url);
            if (res) {
              answer += `✅ Success:\n┃Link_Grup *berhasil* ditambahkan.`;
            } else {
              answer += `🚫 Failed:\n┃ Link_Grup *gagal* ditambahkan.\n┃ Coba ulangi lagi.`;
            }
          }
          client
            .sendText(message.from, answer)
            .then((result) => {})
            .catch((err) => {
              console.log("err :>> ", err);
            });
        }
        break;

      default:
        break;
    }
  },
};
