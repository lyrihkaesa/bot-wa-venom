export class ArrButton {
  constructor(...arr) {
    this.arr = arr;
  }

  getArrButton() {
    const button = [];
    this.arr.forEach(function (value, index) {
      // console.log(`${index} : ${value}`);
      let btn = {
        buttonText: {
          displayText: `${value}`,
        },
      };
      button.push(btn);
    });
    return button;
  }
}

export class ArrList {
  constructor(...arr) {
    this.arr = arr;
  }

  getArrList() {
    const list = [];
    this.arr.forEach(function (value, index) {
      // console.log(`${index} : ${value}`);
      let ls = {
        listText: {
          displayText: `${value}`,
        },
      };
      list.push(ls);
    });
    return list;
  }
}

export const list = [
  {
    title: "👤 Profile",
    rows: [
      {
        title: "Kaesa user ",
        description: "Mengubah profile Anda",
      },
      {
        title: "Profile ke-2",
        description: "Deskripsi ke-2",
      },
      {
        title: "Profile ke-3",
        description: "Deskripsi ke-3",
      },
      {
        title: "Profile ke-4",
        description: "Deskripsi ke-4",
      },
      {
        title: "Profile ke-5",
        description: "Deskripsi ke-5",
      },
      {
        title: "Profile ke-6",
        description: "Deskripsi ke-6",
      },
      {
        title: "Profile ke-7",
        description: "Deskripsi ke-7",
      },
      {
        title: "Profile ke-8",
        description: "Deskripsi ke-8",
      },
      {
        title: "Profile ke-9",
        description: "Deskripsi ke-9",
      },
      {
        title: "Profile ke-10",
        description: "Deskripsi ke-10",
      },
    ],
  },
  {
    title: "🤝 Kelompok",
    rows: [
      {
        title: "Kaesa buat kelompok",
        description: "Membuat kelompok dalam grup.",
      },
      {
        title: "Kaesa masuk kelompok",
        description: "Masuk ke kelompok dalam grup",
      },
    ],
  },
  {
    title: "🤝 List ke-3",
    rows: [
      {
        title: "Kaesa ke-1",
        description: "Kaesa ke-1",
      },
      {
        title: "Kaesa ke-2",
        description: "Kaesa ke-2",
      },
      {
        title: "Kaesa ke-3",
        description: "Kaesa ke-3",
      },
    ],
  },
  {
    title: "🤝 List ke-4",
    rows: [
      {
        title: "Kaesa ke-1",
        description: "Kaesa ke-1",
      },
      {
        title: "Kaesa ke-2",
        description: "Kaesa ke-2",
      },
      {
        title: "Kaesa ke-3",
        description: "Kaesa ke-3",
      },
    ],
  },
  {
    title: "🤝 List ke-5",
    rows: [
      {
        title: "Kaesa ke-1",
        description: "Kaesa ke-1",
      },
      {
        title: "Kaesa ke-2",
        description: "Kaesa ke-2",
      },
      {
        title: "Kaesa ke-3",
        description: "Kaesa ke-3",
      },
    ],
  },
  {
    title: "🤝 List ke-6",
    rows: [
      {
        title: "Kaesa ke-1",
        description: "Kaesa ke-1",
      },
      {
        title: "Kaesa ke-2",
        description: "Kaesa ke-2",
      },
      {
        title: "Kaesa ke-3",
        description: "Kaesa ke-3",
      },
    ],
  },
  {
    title: "🤝 List ke-7",
    rows: [
      {
        title: "Kaesa ke-1",
        description: "Kaesa ke-1",
      },
      {
        title: "Kaesa ke-2",
        description: "Kaesa ke-2",
      },
      {
        title: "Kaesa ke-3",
        description: "Kaesa ke-3",
      },
    ],
  },
  {
    title: "🤝 List ke-8",
    rows: [
      {
        title: "Kaesa ke-1",
        description: "Kaesa ke-1",
      },
      {
        title: "Kaesa ke-2",
        description: "Kaesa ke-2",
      },
      {
        title: "Kaesa ke-3",
        description: "Kaesa ke-3",
      },
    ],
  },
  {
    title: "🤝 List ke-9",
    rows: [
      {
        title: "Kaesa ke-1",
        description: "Kaesa ke-1",
      },
      {
        title: "Kaesa ke-2",
        description: "Kaesa ke-2",
      },
      {
        title: "Kaesa ke-3",
        description: "Kaesa ke-3",
      },
    ],
  },
  {
    title: "🤝 List ke-10",
    rows: [
      {
        title: "Kaesa ke-1",
        description: "Kaesa ke-1",
      },
      {
        title: "Kaesa ke-2",
        description: "Kaesa ke-2",
      },
      {
        title: "Kaesa ke-3",
        description: "Kaesa ke-3",
      },
    ],
  },
];

export class Divider {
  constructor() {
    this.up = "╭ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n";
    this.middle = "┃ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n";
    this.down = "╰ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n\n";
    this.line = "─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n";
  }
}
