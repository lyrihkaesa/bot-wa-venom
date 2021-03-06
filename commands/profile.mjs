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
                `ā Profile *${name_user}* sudah diperbarui`,
                new ArrButton(".Profile").getArrButton(),
                `ā Nomor: ${formatPhoneNumber(message.sender.id)}\nš³ NIM: ${nim}`
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
            await client.sendText(message.from, `ā Salin pesan *Kaesa profile set* dibawah ini ā¤µ, lalu *kirim ulang* ke *Chatbot* :`);
            await client.sendText(message.from, defaultString);
          }
        }
        break;

      case "krs":
        {
          let resA = "Perintah *input KRS*:\n";
          resA += "Kaesa profile krs add *Id_Matkul (KDMK)* _Id_Kelompok (KLPK)_\n\n";
          resA += "ā *Misalnya:*\n";
          resA += "Kaesa profile krs add *A12.66404* _A12.6406_\n";
          switch (lowerCaseArgs[2]) {
            case "add":
            case "tambah":
              {
                if (!args[3] || !args[4]) {
                  let result = "";
                  result += "š© *Perintah anda kurang:*\n";
                  result += divider.up;
                  if (!args[3]) {
                    result += `ā - _Id_Matkul (KDMK)_\nā - _Id_Kelompok (KLPK)_.\n`;
                  } else if (!args[4]) {
                    result += `ā - _Id_Kelompok (KLPK)_.\n`;
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
                let result = `š *KRS Anda:*\n`;
                result += "ā­ ā ā ā ā ā ā ā ā ā ā ā ā ā ā ā\n";
                result += `ā Nama: ${name_user}\n`;
                result += `ā NIM: ${nim}\n`;
                result += "ā° ā ā ā ā ā ā ā ā ā ā ā ā ā ā ā\n\n";

                result += "ā ā ā ā ā ā ā ā ā ā ā ā ā ā ā ā\n";
                if (!matkul_id_04.length) {
                  result += "ā š \nAnda belum memasukan *KRS* ke *_Database_* _chatbot_!\n\n";
                  result += resA;
                } else {
                  // console.log(matkul_id_04);

                  for (let index = 0; index < matkul_id_04.length; index++) {
                    const element = matkul_id_04[index];
                    let page = await getKrsByPageId(element.id);
                    // console.log(page);
                    result += `${index + 1}. *${page.matkul_id}* - _${page.kel_id.name}_\n`;
                    result += `š ${capitalizeFirstLetter(page.matkul_name)}\n`;
                    result += `š Link Group: \n${!!page.url ? page.url : "_kosong (empty)_"}\n`;
                    // result += `ā Kelompok: \nāā ${page.kel_id.name}\n`
                    if (index !== matkul_id_04.length - 1) {
                      result += "ā ā ā ā ā ā ā ā ā ā ā ā ā ā ā\n";
                    }
                  }
                }

                result += "ā ā ā ā ā ā ā ā ā ā ā ā ā ā ā ā\n";
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
          let result = `š¤ *Profile Anda:*\n`;
          result += "ā­ ā ā ā ā ā ā ā ā ā ā ā ā ā ā ā\n";
          result += `ā Role: ${resultRole}\n`;
          result += `ā Nama: ${name_user}\n`;
          result += `ā NIM: ${nim}\n`;
          result += `ā Gender: ${gender.name}\n`;
          result += `ā Agama: ${religion.name}\n`;
          result += "ā° ā ā ā ā ā ā ā ā ā ā ā ā ā ā ā\n\n";
          result += `š« *Sekolah:*\n`;
          result += "ā­ ā ā ā ā ā ā ā ā ā ā ā ā ā ā ā\n";
          result += `ā *Prodi:*\nāā ${prodi}\n`;
          result += `ā *Fakultas:*\nāā ${fakultas}\n`;
          result += `ā *Kampus:*\nāā ${college}\n`;
          result += "ā° ā ā ā ā ā ā ā ā ā ā ā ā ā ā ā\n";
          client.sendText(message.from, result);
        }
        break;
    }
  },
};
