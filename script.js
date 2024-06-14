const size_X = 20;
const size_Y = 20;
const number_mine = 40;
const $ = (n) => document.querySelector(n);
const offsetMap = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
let map = [];
let default_mines = { isMineGenarated: false, x: -1, y: -1 }; 

function init() {
  const container = $(".container");
  container.style.gridTemplateColumns = `repeat(${size_X}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${size_Y}, 1fr)`;

  map = [];
  for (let y = 0; y < size_Y; y++) {
    map.push([]);
    for (let x = 0; x < size_X; x++) {
      let div = document.createElement("div");
      div.className = "field hide";
      div.setAttribute("x", x);
      div.setAttribute("y", y);

      div.addEventListener("click", (e) => {
        const x = parseInt(e.target.getAttribute("x"));
        const y = parseInt(e.target.getAttribute("y"));
        showField(x, y);
      });

      div.addEventListener(
        "contextmenu",
        (e) => {
          e.preventDefault();
          let field = map[e.target.getAttribute("y")][e.target.getAttribute("x")];
          if( field.show)
            return false
          field.marked = !field.marked;
          if (field.marked) {
            e.target.classList.add("flag");
          } else {
            e.target.classList.remove("flag");
          }
          return false;
        },
        false
      );

      map[y].push({
        mine: false,
        marked: false,
        show: false,
        closer_mine: 0,
        field: div,
      });

      container.appendChild(div);
    }
  }
}

function showAllMines() {
  map.forEach((y) => {
    y.forEach((e) => {
      if (e.mine && !e.marked) {
        e.field.classList.remove("hide");
        e.field.classList.add("mine");
      }
    });
  });
}

function showField(x, y) {
  const field = map[y][x];
  //console.log(x, y, field);

  if(!default_mines.isMineGenarated) {
    default_mines.isMineGenarated = true;
    default_mines.x = x;
    default_mines.y = y;

    initMine();
  }
  if (field.marked) {
    return;
  }
  if (field.mine) {
    showAllMines();
    return false;
  } else if (field.closer_mine == 0) {
    field.show = true;
    field.field.classList.remove("hide");

    offsetMap.forEach((off) => {
      const chech_Y = y + off[0];
      const chech_X = x + off[1];

      if (
        chech_X >= 0 &&
        chech_Y >= 0 &&
        chech_X < size_X &&
        chech_Y < size_Y
      ) {
        const local_field = map[chech_Y][chech_X];
        if (local_field.closer_mine == 0 && !local_field.show)
          showField(chech_X, chech_Y);
        else {
          local_field.field.classList.remove("hide");
          //local_field.show = true;
          local_field.field.classList.add("mine" + local_field.closer_mine);
        }
      }
    });
  } else {
    field.show = true;
    field.field.classList.remove("hide");
    field.field.classList.add("mine" + field.closer_mine);
  }
}

function initMine() {
  if (size_X * size_Y < number_mine)
    throw new Error("The number of mines is too high.");
  let count_mine = number_mine;
  let field_ignored = [[default_mines.y, default_mines.x]];

  offsetMap.forEach((off) => {
    const chech_Y = default_mines.y + off[0];
    const chech_X = default_mines.x + off[1];
    field_ignored.push([chech_Y, chech_X]);
  });

  while (count_mine > 0) {
    const x = Math.floor(Math.random() * size_X);
    const y = Math.floor(Math.random() * size_Y);

    //console.log(field_ignored.filter(e=>e==[y,x]));
    if (!map[y][x].mine && field_ignored.filter(e=>(e[0] == y && e[1] == x)).length == 0) {
      map[y][x].mine = true;
      count_mine--;
      initNumberOfMines(x, y);
    }
  }
}

function initNumberOfMines(x, y) {
  offsetMap.forEach((off) => {
    const chech_Y = y + off[0];
    const chech_X = x + off[1];

    if (chech_X >= 0 && chech_Y >= 0 && chech_X < size_X && chech_Y < size_Y) {
      map[chech_Y][chech_X].closer_mine++;
    }
  });
}

function ShowMap() {
  map.forEach((row) => {
    row.forEach((field) => {
      let div = field.field;
      if (field.mine || field.closer_mine > 0) {
        div.classList.remove("hide");
        if (field.mine) {
          div.classList.add("mine");
        } else {
          div.classList.add("mine" + field.closer_mine);
        }
      }
    });
  });
}

init();

//initMine();

//ShowMap();
