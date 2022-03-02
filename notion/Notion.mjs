import { Client, APIErrorCode } from "@notionhq/client";
// import { config } from "../config.mjs";

// const notion = new Client({ auth: process.env.NOTION_API_KEY });

export function capitalizeFirstLetter(str) {
  // const str = 'i have learned something new today';

  //split the above string into an array of strings
  //whenever a blank space is encountered
  str = str.toLowerCase();

  const arr = str.split(" ");

  //loop through each element of the array and capitalize the first letter.

  for (var i = 0; i < arr.length; i++) {
    switch (arr[i]) {
      case "dan":
        break;
      case "ii":
        arr[i] = arr[i].toUpperCase();
        break;

      default:
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        break;
    }
  }

  //Join all the elements of the array back into a string
  //using a blankspace as a separator
  const str2 = arr.join(" ");
  // console.log(str2);
  return str2;

  //Outptut: I Have Learned Something New Today
}

export class KaesaNotion {
  constructor(NOTION_API_KEY, DB_NOTION) {
    this.NOTION_API_KEY = NOTION_API_KEY;
    this.DB_NOTION = DB_NOTION;
    this.notion = new Client({
      auth: this.NOTION_API_KEY,
    });
  }

  async query(
    qFilter = {
      property: "no_whatsapp",
      text: {
        contains: "",
      },
    },
    qSorts = [
      {
        property: "create_time",
        direction: "descending",
      },
    ]
  ) {
    try {
      const myPage = await this.notion.databases.query({
        database_id: this.DB_NOTION,
        filter: qFilter,
        sorts: qSorts,
      });
      return myPage;
    } catch (error) {
      if (error.code === APIErrorCode.ObjectNotFound) {
        //
        // For example: handle by asking the user to select a different database
        //
      } else {
        // Other error handling code
        console.error(error);
      }
    }
  }

  async dbRetrieve() {
    return await this.notion.databases.retrieve({ database_id: this.DB_NOTION });
  }

  async userList() {
    const response = await this.notion.users.list();
    console.log(response);
  }
}

function loopValueProperties(val_id, valueProps, pages = []) {
  let page = {};
  page.id = val_id;
  for (const key in valueProps) {
    if (Object.hasOwnProperty.call(valueProps, key)) {
      const element = valueProps[key];
      // console.log(`${element.type} : ${key}`);
      if (element.type === "created_time") {
        page[key] = element.created_time;
      }
      if (element.type === "rich_text") {
        page[key] = element.rich_text[0]?.text.content;
      }
      if (element.type === "relation") {
        page[key] = element.relation;
      }
      if (element.type === "rollup") {
        page[key] = element.rollup.array[0];
      }
      if (element.type === "email") {
        page[key] = element.email;
      }
      if (element.type === "url") {
        page[key] = element.url;
      }
      if (element.type === "select") {
        page[key] = element.select;
      }
      if (element.type === "date") {
        page[key] = element.date;
      }
      if (element.type === "multi_select") {
        page[key] = element.multi_select;
      }
      if (element.type === "title") {
        page[key] = element.title[0]?.text.content;
      }
    }
  }
  pages.push(page);
}

export function getPagesAuto(itemQuery) {
  let pages = [];
  itemQuery.results.forEach(function (value) {
    loopValueProperties(value.id, value.properties, pages);
  });
  return pages;
}

export class CrudPages {
  constructor(notion, databaseId) {
    this.notion = notion;
    this.databaseId = databaseId;
  }

  async pageUpdate(properties, pageId) {
    const response = await this.notion.pages.update({
      page_id: pageId,
      properties: properties,
    });
    // console.log(response);
    console.log(properties);
  }

  async pageCreate(emoji, properties, databaseId = this.databaseId) {
    const response = await this.notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      icon: {
        type: "emoji",
        emoji: emoji,
      },
      properties: properties,
    });
    // console.log(response);
  }

  async pageRetrive(pageId) {
    let pages = [];
    const response = await this.notion.pages.retrieve({ page_id: pageId });
    loopValueProperties(response.id, response.properties, pages);
    // console.log(response);
    return pages[0];
  }

  title(val, key) {
    let data = {};
    let subData = {
      title: [
        {
          text: {
            content: val,
          },
        },
      ],
    };
    data[key] = subData;
    if (key === undefined) {
      return subData;
    } else {
      return data;
    }
  }

  rich_text(val, key) {
    let data = {};
    let subData = {
      rich_text: [
        {
          text: {
            content: val,
          },
        },
      ],
    };
    data[key] = subData;
    if (key === undefined) {
      return subData;
    } else {
      return data;
    }
  }

  email(val, key) {
    let data = {};
    let subData = {
      email: val,
    };
    data[key] = subData;
    if (key === undefined) {
      return subData;
    } else {
      return data;
    }
  }

  select(val, key) {
    let data = {};
    let subData = {
      select: {
        name: val,
      },
    };
    data[key] = subData;
    if (key === undefined) {
      return subData;
    } else {
      return data;
    }
  }

  url(val, key) {
    let data = {};
    let subData = {
      url: val,
    };
    data[key] = subData;
    if (key === undefined) {
      return subData;
    } else {
      return data;
    }
  }

  date(val, key) {
    let data = {};
    let subData = {
      date: {
        start: val,
      },
    };
    data[key] = subData;
    if (key === undefined) {
      return subData;
    } else {
      return data;
    }
  }

  relation(arrayPageId = [], key) {
    let relations = [];
    arrayPageId.forEach(function (value) {
      let subestData = {
        id: value,
      };
      relations.push(subestData);
    });
    let data = {};
    let subData = {
      relation: relations,
    };
    data[key] = subData;
    if (key === undefined) {
      return subData;
    } else {
      return data;
    }
  }
}
