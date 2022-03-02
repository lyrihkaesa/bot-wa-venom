import { config } from "../config.mjs";
import { getPagesAuto, KaesaNotion, CrudPages } from "./Notion.mjs";

const USERS = new KaesaNotion(config.NOTION_API_KEY, config.DB_USERS);
const qUser = await USERS.query();
// console.log(qUser);
// qUser.results.forEach(function (value) {
//   console.log(value.properties);
// });

// console.log(getPagesAuto(qUser));

// const uuu = getPagesAuto(qUser);
// // console.log(uuu);
// uuu.forEach(function (val, idx) {
//   console.log(val.no_whatsapp);
// });
// getPagesAuto(qUser);

const uptData = new CrudPages(USERS.notion, config.DB_USERS);

export async function checkUser(message) {
  let from = "";
  if (message.isGroupMsg) {
    from = message.author;
  } else {
    from = message.from;
  }
  const qUser2 = await USERS.query();
  let page = getPagesAuto(qUser2);
  let pt = false;
  page.forEach(function (val) {
    // console.log(val.no_whatsapp);
    if (val.no_whatsapp === from) {
      pt = true;
      // console.log(`This PT: ${pt}`);
    }
  });
  return pt;
}

// function getUser(no_whatsapp){
//   let aFilter = {
//     property: "no_whatsapp",
//     text: {
//       contains: no_whatsapp,
//     },
//   }
//   const queryUser = await user.query()
// }

// ===========================================
// ===========================================
// fungsi memisahkan no_whatsapp dengan @c.us
function formatPhoneNumber(no_whatsapp) {
  //Filter only numbers from the input
  let cleaned = ("" + no_whatsapp).replace(/\D/g, "");

  let match;
  //Check if the input is of correct
  if (cleaned.length === 11) {
    match = cleaned.match(/^(\d{2})(\d{3})(\d{4})(\d{2})$/);
  } else if (cleaned.length === 12) {
    match = cleaned.match(/^(\d{2})(\d{3})(\d{4})(\d{3})$/);
  } else if (cleaned.length === 13) {
    match = cleaned.match(/^(\d{2})(\d{3})(\d{4})(\d{4})$/);
  } else if (cleaned.length === 14) {
    match = cleaned.match(/^(\d{2})(\d{3})(\d{4})(\d{5})$/);
  }
  if (match) {
    //Remove the matched extension code
    //Change this to format for any country code.
    let intlCode = match[1] ? "+62 " : "";
    return [intlCode, match[2], "-", match[3], "-", match[4]].join("");
  }
  return null;
}

// fungsi untuk mengecek apakah user sudah terdaftar atau belum.
async function isRegistered(no_whatsapp = "") {
  const filter = {
    property: "no_whatsapp",
    text: {
      equals: no_whatsapp,
    },
  };
  const queryUsers = await USERS.query(filter);
  if (queryUsers.results[0]) {
    return true;
  } else {
    return false;
  }
}

// fungsi mendapatkan id user berdasarkan no_whatsapp
async function getPageId(no_whatsapp) {
  const filter = {
    property: "no_whatsapp",
    text: {
      equals: no_whatsapp,
    },
  };
  const queryUsers = await USERS.query(filter);
  if (queryUsers.results[0]) {
    return queryUsers.results[0].id;
  } else {
    return `ID user ${no_whatsapp} tidak ditemukan!`;
  }
}

// global variabel
const crudPages = new CrudPages(USERS.notion, config.DB_USERS);

// CRUD (CREATE, READ, UPDATE, DELETE)

// CREATE | fungsi untuk menambahkan user atau mendaftarkan user
async function addUserByNoWhatsapp(no_whatsapp) {
  if (await isRegistered(no_whatsapp)) {
    return false;
  } else {
    const { title, rich_text, select } = crudPages;
    const props = {};
    props["no_whatsapp"] = title(no_whatsapp);
    props["name_user"] = rich_text("Belum diisi");
    props["nim"] = rich_text("Belum diisi");
    props["college"] = rich_text("Belum diisi");
    props["fakultas"] = rich_text("Belum diisi");
    props["prodi"] = rich_text("Belum diisi");
    props["gender"] = select("Belum diisi");
    props["religion"] = select("Belum diisi");
    props["power_level"] = rich_text("1");
    crudPages.pageCreate("👤", props);
    return true;
  }
}

// READ | fungsi untuk mendapatkan/melihat data user
async function getUserByNoWhatsapp(no_whatsapp) {
  if (await isRegistered(no_whatsapp)) {
    const filter = {
      property: "no_whatsapp",
      text: {
        equals: no_whatsapp,
      },
    };
    const queryUsers = await USERS.query(filter);
    // console.log(queryUsers.results[0].properties.role);
    const user = getPagesAuto(queryUsers);
    return user[0];
  } else {
    return false;
  }
}

// UPDATE | fungsi untuk mengubah data user
function setProperties({ name_user, nim, gender, religion, college, fakultas, prodi }) {
  const result = {};
  result["name_user"] = crudPages.rich_text(name_user);
  result["nim"] = crudPages.rich_text(nim);
  result["gender"] = crudPages.select(gender);
  result["religion"] = crudPages.select(religion);
  result["college"] = crudPages.rich_text(college);
  result["fakultas"] = crudPages.rich_text(fakultas);
  result["prodi"] = crudPages.rich_text(prodi);
  return result;
}

function setPropertiesRelation(arrayPageId) {
  return crudPages.relation(arrayPageId, "matkul_id_04");
}

// const arrayPageId = ["aaaaaaaaaaaaaaaaaaaaaa", "bbbbbbbbbbbbbbbbbbbbbb", "cccccccccccccccccccccc"];

// const aaaaaa = setPropertiesRelation(arrayPageId);
// console.log(aaaaaa.matkul_id_04);
// console.log(updateProperties);

async function updateUserByNoWhatsapp(no_whatsapp, properties) {
  if (await isRegistered(no_whatsapp)) {
    const pageId = await getPageId(no_whatsapp);
    crudPages.pageUpdate(properties, pageId);
    return true;
  } else {
    return false;
  }
}

// DELETE | fungsi untuk menghapus user
async function deleteUserByNoWhatsapp(no_whatsapp) {
  if (await isRegistered(no_whatsapp)) {
    const currentDate = new Date();
    const resultProp = `${no_whatsapp}_DEL_${currentDate}`;
    const properties = {};
    properties["no_whatsapp"] = title(resultProp);
    const pageId = await getPageId(no_whatsapp);
    crudPages.pageUpdate(properties, pageId);
    return `User ${no_whatsapp} berhasil dihapus`;
  } else {
    return `User ${no_whatsapp} belum terdaftar`;
  }
}

// EXPORT
export {
  formatPhoneNumber,
  getPageId,
  isRegistered,
  addUserByNoWhatsapp,
  getUserByNoWhatsapp,
  updateUserByNoWhatsapp,
  deleteUserByNoWhatsapp,
  setProperties,
  setPropertiesRelation,
};
