import { config } from "../config.mjs";
import { getPagesAuto, KaesaNotion, CrudPages } from "./Notion.mjs";

const KRS_SEMESTER_04 = new KaesaNotion(config.NOTION_API_KEY, config.DB_KRS_SEMESTER_04);

// =============================
// =============================

// Apakah grupnya ada pada database?
async function isKrs04Avaible(matkul_id, kel_id) {
  const filter = {
    and: [
      {
        property: "matkul_id",
        text: {
          equals: matkul_id.toUpperCase(),
        },
      },
      {
        property: "kel_id",
        select: {
          equals: kel_id.toUpperCase(),
        },
      },
    ],
  };
  const queryKrs04s = await KRS_SEMESTER_04.query(filter);
  if (queryKrs04s.results[0]) {
    return true;
  } else {
    return false;
  }
}

// fungsi mendapatkan id page matkul berdasarkan matkul_id
async function getPageKrs04Id(matkul_id, kel_id) {
  const filter = {
    and: [
      {
        property: "matkul_id",
        text: {
          equals: matkul_id.toUpperCase(),
        },
      },
      {
        property: "kel_id",
        select: {
          equals: kel_id.toUpperCase(),
        },
      },
    ],
  };
  const queryKrs04s = await KRS_SEMESTER_04.query(filter);
  if (queryKrs04s.results[0]) {
    return queryKrs04s.results[0].id;
  } else {
    return `ID matkul ${matkul_id} dan kelompok ${kel_id} tidak ditemukan!`;
  }
}

// console.log(await getPageKrs04Id("a12.66201", "A12.6209"));

// global variabel
const CRUD_PAGES = new CrudPages(KRS_SEMESTER_04.notion, config.DB_KRS_SEMESTER_04);

// CRUD (CREATE, READ, UPDATE, DELETE)

// READ | fungsi untuk mendapatkan/melihat data grup
async function getKrs04ByMatkulAndKel(matkul_id, kel_id) {
  if (await isKrs04Avaible(matkul_id, kel_id)) {
    const filter = {
      and: [
        {
          property: "matkul_id",
          text: {
            equals: matkul_id.toUpperCase(),
          },
        },
        {
          property: "kel_id",
          select: {
            equals: kel_id.toUpperCase(),
          },
        },
      ],
    };
    const queryKrs04s = await KRS_SEMESTER_04.query(filter);
    // console.log(queryUsers.results[0].properties.role);
    const krs04 = getPagesAuto(queryKrs04s);
    return krs04[0];
  } else {
    return false;
  }
}
// console.log(await getKrs04ByMatkulAndKel("a12.66201", "A12.6209"));

async function getKrsByPageId(pageId) {
  return await CRUD_PAGES.pageRetrive(pageId);
}

// READ | mendapatkan matkul_id
async function getMatkulIdByName(matkul_name) {
  const input = matkul_name.toUpperCase();
  const filter = {
    or: [
      {
        property: "matkul_name",
        text: {
          contains: input,
        },
      },
      {
        property: "matkul_singkatan",
        text: {
          contains: input,
        },
      },
    ],
  };
  const sorts = [
    {
      property: "kel_id",
      direction: "ascending",
    },
  ];
  const queryKrs04s = await KRS_SEMESTER_04.query(filter, sorts);
  // console.log(queryUsers.results[0].properties.role);
  const krs04 = getPagesAuto(queryKrs04s);
  const results = [];
  const resultsName = [];
  krs04.forEach(function (value, index) {
    const pageKelIds = [];
    const data = {
      page_id: value.id,
      kel_id: value.kel_id.name,
      url: value.url,
    };

    if (resultsName.includes(value.matkul_name)) {
      const indexResName = resultsName.indexOf(value.matkul_name);
      results[indexResName].pageKelIds.push(data);
    } else {
      pageKelIds.push(data);
      const matkul = {
        name: value.matkul_name,
        id: value.matkul_id,
        pageKelIds: pageKelIds,
      };
      resultsName.push(value.matkul_name);
      results.push(matkul);
    }

    // console.log(value);
  });
  // console.log(results);
  // console.log(results[0].pageKelIds);
  // console.log(resultsName);
  return results;
}

// const abc = await getMatkulIdByName("mrp");
// console.log(abc);
// abc.forEach(function (value) {
//   console.log(`${value.matkul_id} : ${value.matkul_name}`);
// });

// UPDATE | fungsi untuk mengubah data grup
async function setUrlKrs04(matkul_id, kel_id, url) {
  console.log("matkul_id :>> ", matkul_id);
  console.log("kel_id :>> ", kel_id);
  console.log("url :>> ", url);
  if (await isKrs04Avaible(matkul_id, kel_id)) {
    const properties = {};
    properties["url"] = CRUD_PAGES.url(url);
    const pageId = await getPageKrs04Id(matkul_id, kel_id);
    CRUD_PAGES.pageUpdate(properties, pageId);
    return true;
  } else {
    return false;
  }
}

// console.log(await setUrlKrs04("a12.66201", "A12.6209", "lol"));

export { isKrs04Avaible, getPageKrs04Id, getKrsByPageId, getMatkulIdByName, setUrlKrs04 };
