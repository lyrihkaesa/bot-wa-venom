import { getKrsByPageId, getPageKrs04Id } from "../notion/KrsSemester04.mjs";
import { capitalizeFirstLetter } from "../notion/Notion.mjs";
import { getUserByNoWhatsapp, setProperties, updateUserByNoWhatsapp, formatPhoneNumber, setPropertiesRelation } from "../notion/Users.mjs";
import { ArrButton, Divider } from "../tools/ArrayHandler.mjs";
const divider = new Divider();

export const command = {
  name: "profile",
  desc: "profile, profil",
  async execute(client, message, lowerCaseArgs, args) {
    const user = await getUserByNoWhatsapp(message.sender.id);
    const { id, name_user, gender, religion, role, nim, college, fakultas, prodi, power_level, email_personal, email_edu, matkul_id_04 } = user;
    switch (lowerCaseArgs[1]) {
      case "set":
      case "edit":
        {
          if (args[5]) {
            const resultArray = message.body.split(args[1]);
            const replaceSlashN = resultArray[1].replace(/\n/g, ":");
            const splitTitikDua = replaceSlashN.split(":");
            const result = {};
            splitTitikDua.forEach(function (value, index) {
              if (index % 2 === 1) {
                result[value.toLowerCase()] = splitTitikDua[index + 1].trim();
              }
            });
            // console.log(result);
            const { nama, nim, gender, agama, kampus, fakultas, prodi } = result;
            const religion = agama;
            const name_user = nama;
            const college = kampus;
            const props = setProperties({ name_user, nim, gender, religion, college, fakultas, prodi });
            console.log(props);
            await updateUserByNoWhatsapp(message.sender.id, props);
            await client
              .sendButtons(
                message.from,
                `✅ Profile *${name_user}* sudah diperbarui`,
                new ArrButton(".Profile").getArrButton(),
                `☎ Nomor: ${formatPhoneNumber(message.sender.id)}\n💳 NIM: ${nim}`
              )
              .then((result) => {
                console.log("Result: ", result); //return object success
              })
              .catch((erro) => {
                console.error("Error when sending: ", erro); //return object error
              });
          } else {
            // const user = await getUserByNoWhatsapp(message.sender.id);
            // const { id, name_user, gender, religion, role, nim, college, fakultas, prodi, power_level, email_personal, email_edu } = user;
            let defaultString = `Kaesa profile set\n`;
            defaultString += `Nama: ${name_user}\n`;
            defaultString += `NIM: ${nim}\n`;
            defaultString += `Gender: ${gender.name}\n`;
            defaultString += `Agama: ${religion.name}\n`;
            defaultString += `Kampus: ${college}\n`;
            defaultString += `Fakultas: ${fakultas}\n`;
            defaultString += `Prodi: ${prodi}\n`;
            await client.sendText(message.from, `✂ Salin pesan *Kaesa profile set* dibawah ini ⤵, lalu *kirim ulang* ke *Chatbot* :`);
            await client.sendText(message.from, defaultString);
          }
        }
        break;

      case "krs":
        {
          let resA = "Perintah *input KRS*:\n";
          resA += "Kaesa profile krs add *Id_Matkul (KDMK)* _Id_Kelompok (KLPK)_\n\n";
          resA += "↘ *Misalnya:*\n";
          resA += "Kaesa profile krs add *A12.66404* _A12.6406_\n";
          switch (lowerCaseArgs[2]) {
            case "add":
            case "tambah":
              {
                if (!args[3] || !args[4]) {
                  let result = "";
                  result += "📩 *Perintah anda kurang:*\n";
                  result += divider.up;
                  if (!args[3]) {
                    result += `┃ - _Id_Matkul (KDMK)_\n┃ - _Id_Kelompok (KLPK)_.\n`;
                  } else if (!args[4]) {
                    result += `┃ - _Id_Kelompok (KLPK)_.\n`;
                  }
                  result += divider.down;
                  result += resA;
                  client.sendText(message.from, result);
                } else {
                  const resultArray = message.body.split(args[2]);
                  const resTrim = resultArray[1].trim();
                  const resSplit = resTrim.split(" ");
                  let arrayPageId = [];
                  let tempArrayPageId = [];
                  for (let index = 0; index < matkul_id_04.length; index++) {
                    const element = matkul_id_04[index];
                    arrayPageId.push(element.id);
                  }
                  let beginLengthArrayPageId = arrayPageId.length;
                  if (resSplit.length % 2 === 0) {
                    for (let index = 0; index < resSplit.length; index++) {
                      const obj = {};
                      obj.matkul_id = resSplit[index];

                      obj.kel_id = resSplit[index + 1];
                      if (index % 2 === 0) {
                        // console.log(`${matkul_id} ${kel_id}`);
                        const pageId = await getPageKrs04Id(obj.matkul_id, obj.kel_id);
                        if (arrayPageId.includes(pageId)) {
                          tempArrayPageId.push(obj);
                        } else {
                          arrayPageId.push(pageId);
                        }
                      }
                    }

                    console.log("tempArrayPageId :>> ", tempArrayPageId);
                    if (arrayPageId.length > beginLengthArrayPageId) {
                      const properties = setPropertiesRelation(arrayPageId);
                      // console.log(properties);
                      const response = await updateUserByNoWhatsapp(message.sender.id, properties).catch(function (err) {
                        console.log(err);
                      });
                      if (response) {
                        client.sendText(message.from, `Beberapa data ${resSplit} berhasil ditambahkan!`);
                      }
                    } else {
                      client.sendText(message.from, "Data yang anda masukan sama di database.");
                    }
                  } else {
                    client.sendText(message.from, "Maaf jumlah *Id_Kelompok* ganjil");
                  }
                }
              }
              break;

            default:
              {
                let result = `📚 *KRS Anda:*\n`;
                result += "╭ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n";
                result += `┃ Nama: ${name_user}\n`;
                result += `┃ NIM: ${nim}\n`;
                result += "╰ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n\n";

                result += "─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n";
                if (!matkul_id_04.length) {
                  result += "⚠🗃 \nAnda belum memasukan *KRS* ke *_Database_* _chatbot_!\n\n";
                  result += resA;
                } else {
                  // console.log(matkul_id_04);

                  for (let index = 0; index < matkul_id_04.length; index++) {
                    const element = matkul_id_04[index];
                    let page = await getKrsByPageId(element.id);
                    // console.log(page);
                    result += `${index + 1}. *${page.matkul_id}* - _${page.kel_id.name}_\n`;
                    result += `📙 ${capitalizeFirstLetter(page.matkul_name)}\n`;
                    result += `🔗 Link Group: \n${!!page.url ? page.url : "_kosong (empty)_"}\n`;
                    // result += `┃ Kelompok: \n┃┃ ${page.kel_id.name}\n`
                    if (index !== matkul_id_04.length - 1) {
                      result += "─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n";
                    }
                  }
                }

                result += "─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n";
                client.sendText(message.from, result);
              }
              break;
          }
        }
        break;
      default:
        {
          const user = await getUserByNoWhatsapp(message.sender.id);
          const { id, name_user, gender, religion, role, nim, college, fakultas, prodi, power_level, email_personal, email_edu } = user;
          let resultRole = "";
          role.forEach((value) => {
            resultRole += `${value.name}, `;
          });
          let result = `👤 *Profile Anda:*\n`;
          result += "╭ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n";
          result += `┃ Role: ${resultRole}\n`;
          result += `┃ Nama: ${name_user}\n`;
          result += `┃ NIM: ${nim}\n`;
          result += `┃ Gender: ${gender.name}\n`;
          result += `┃ Agama: ${religion.name}\n`;
          result += "╰ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n\n";
          result += `🏫 *Sekolah:*\n`;
          result += "╭ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n";
          result += `┃ *Prodi:*\n┃┃ ${prodi}\n`;
          result += `┃ *Fakultas:*\n┃┃ ${fakultas}\n`;
          result += `┃ *Kampus:*\n┃┃ ${college}\n`;
          result += "╰ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n";
          client.sendText(message.from, result);
        }
        break;
    }
  },
};
