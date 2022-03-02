import { config } from "../config.mjs";
import { getPagesAuto, KaesaNotion, CrudPages } from "./Notion.mjs";

const GROUPS = new KaesaNotion(config.NOTION_API_KEY, config.DB_GROUPS);

// =============================
// =============================

// Apakah grupnya ada pada database?
async function isGroupAvaible(id_group) {
  const filter = {
    property: "id_group",
    text: {
      equals: id_group,
    },
  };
  const queryGroups = await GROUPS.query(filter);
  if (queryGroups.results[0]) {
    return true;
  } else {
    return false;
  }
}

// fungsi mendapatkan id page group berdasarkan id_group
async function getPageGroupId(id_group) {
  const filter = {
    property: "id_group",
    text: {
      equals: id_group,
    },
  };
  const queryGroups = await GROUPS.query(filter);
  if (queryGroups.results[0]) {
    return queryGroups.results[0].id;
  } else {
    return `ID group ${id_group} tidak ditemukan!`;
  }
}

// global variabel
const CRUD_PAGES = new CrudPages(GROUPS.notion, config.DB_GROUPS);

// CRUD (CREATE, READ, UPDATE, DELETE)

// CREATE | fungsi untuk menambahkan grup
async function addGroupByIdGroup(id_group, { name, desc, owner }) {
  if (await isGroupAvaible(id_group)) {
    return false;
  } else {
    const { title, rich_text, select } = CRUD_PAGES;
    const props = {};
    props["id_group"] = title(id_group);
    props["name"] = rich_text(name);
    props["desc"] = rich_text(desc);
    props["no_whatsapp"] = select(owner);
    CRUD_PAGES.pageCreate("📦", props);
    return true;
  }
}

// READ | fungsi untuk mendapatkan/melihat data grup
async function getGroupByIdGroup(id_group) {
  if (await isGroupAvaible(id_group)) {
    const filter = {
      property: "no_whatsapp",
      text: {
        equals: id_group,
      },
    };
    const queryGroups = await GROUPS.query(filter);
    // console.log(queryUsers.results[0].properties.role);
    const user = getPagesAuto(queryGroups);
    return user[0];
  } else {
    return false;
  }
}

// UPDATE | fungsi untuk mengubah data grup
function setGroupProperties({ name, desc }) {
  const result = {};
  result["name"] = CRUD_PAGES.rich_text(name);
  result["desc"] = CRUD_PAGES.rich_text(desc);
  return result;
}

async function updateGroupByIdGroup(id_group, properties) {
  if (await isGroupAvaible(id_group)) {
    const pageId = await getPageGroupId(id_group);
    CRUD_PAGES.pageUpdate(properties, pageId);
  } else {
    return `Grup ${id_group} belum terdaftar`;
  }
}

// DELETE | fungsi untuk menghapus grup
async function deleteGroupByIdGroup(id_group) {
  if (await isGroupAvaible(id_group)) {
    const currentDate = new Date();
    const resultProp = `${id_group}_DEL_${currentDate}`;
    const properties = {};
    properties["id_group"] = title(resultProp);
    const pageId = await getPageGroupId(id_group);
    CRUD_PAGES.pageUpdate(properties, pageId);
    return `User ${id_group} berhasil dihapus`;
  } else {
    return `User ${id_group} belum terdaftar`;
  }
}

export { isGroupAvaible, getPageGroupId, addGroupByIdGroup, setGroupProperties, updateGroupByIdGroup, deleteGroupByIdGroup };
