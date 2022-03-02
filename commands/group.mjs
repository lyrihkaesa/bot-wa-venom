import { addGroupByIdGroup } from "../notion/Groups.mjs";
import { formatPhoneNumber, getUserByNoWhatsapp, isRegistered } from "../notion/Users.mjs";

export const command = {
  name: "group",
  desc: "group, grup",
  async execute(client, message, lowerCaseArgs, args) {
    switch (lowerCaseArgs[1]) {
      case "members":
      case "anggota":
        {
          const membersIds = await client.getGroupMembersIds(message.from);
          let group_serialized = [];
          let groupMembers = [];
          let groupMessage = `👥 *Anggota Grup:*\n`;
          groupMessage += "╭ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n";
          membersIds.forEach(function (value, index) {
            if (index !== membersIds.length - 1) {
              groupMembers.push(value.user);
              groupMessage += `┃ ${index + 1}. @${value.user}\n`;
              group_serialized.push(value._serialized);
            }
          });
          groupMessage += "╰ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n";

          //   get data user
          const groupMemberDatas = [];
          switch (lowerCaseArgs[2]) {
            case "name":
            case "nama":
              {
                for (let index = 0; index < group_serialized.length; index++) {
                  const element = group_serialized[index];
                  const userObjek = {};
                  const user = await getUserByNoWhatsapp(element);

                  if (user) {
                    userObjek.name_user = user.name_user;
                  } else {
                    userObjek.name_user = "🚫 Belum terdaftar.";
                  }
                  userObjek.no_whatsapp = element;
                  groupMemberDatas.push(userObjek);
                }
              }
              break;

            default:
              break;
          }

          switch (lowerCaseArgs[2]) {
            case "tag":
            case "tagged":
            case "mention":
            case "mentioned":
              await client.sendMentioned(message.from, groupMessage, groupMembers);
              break;
            case "name":
            case "nama":
              groupMessage = `👥 *Anggota Grup:*\n`;
              groupMessage += "╭ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n";
              for (let index = 0; index < groupMemberDatas.length; index++) {
                const element = groupMemberDatas[index];
                groupMessage += `┃ ${index + 1}. ${element.name_user}\n`;
                groupMessage += `┃┃ ☎: ${formatPhoneNumber(element.no_whatsapp)}\n`;
                if (index !== groupMemberDatas.length - 1) {
                  groupMessage += "┃─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n";
                }
              }
              groupMessage += "╰ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n";
              await client.sendText(message.from, groupMessage);
              break;
            default:
              await client.sendText(message.from, groupMessage);
              break;
          }
        }

        break;

      case "sinkron":
        {
          const chats = await client.getAllChats();
          // console.log("chats :>> ", chats);
          chats.forEach((element) => {
            if (element.isGroup) {
              // console.log("isGroup :>> ", element);
              console.info(element.id._serialized);
              console.info(element.name);
              console.info(element.groupMetadata.desc);
              console.info(element.groupMetadata.owner?._serialized);
              // if (!!element.groupMemberDatas) {
              //   console.info(element.groupMetadata.owner._serialized);
              // } else {
              //   console.info("owner tidak ada");
              // }
            }
            // console.log("element :>> ", element);
            // console.log("element :>> ", element.id);
          });
        }
        break;

      default:
        break;
    }
  },
};
