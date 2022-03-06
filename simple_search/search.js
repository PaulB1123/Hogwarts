"use strict";

const allAnimals = [
  {
    name: "Mia",
    age: 9,
    desc: "Black",
    type: "cat",
  },
  {
    name: "Mandu",
    age: 9,
    desc: "Amazing",
    type: "cat",
  },
  {
    name: "Leeloo",
    age: 1,
    desc: "Growing",
    type: "dog",
  },
  {
    name: "Toothless",
    age: 14,
    desc: "Trained",
    type: "dragon",
  },
  {
    name: "ScoobyDoo",
    age: 58,
    desc: "Wondering",
    type: "dog",
  },
  {
    name: "Horsey",
    age: 10,
    desc: "Horsing",
    type: "horse",
  },
];
init();
function init() {
  buildList();
  // add eventlistener to searchfield
  document.querySelector("#search").addEventListener("input", searchFieldInput);
}

function searchFieldInput(evt) {
  // write to the list with only those elemnts in the allAnimals array that has properties containing the search frase
  displayList(
    allAnimals.filter((elm) => {
      // comparing in uppercase so that m is the same as M
      return elm.name.toUpperCase().includes(evt.target.value.toUpperCase()) || elm.desc.toUpperCase().includes(evt.target.value.toUpperCase()) || elm.type.toUpperCase().includes(evt.target.value.toUpperCase());
    })
  );
}
function buildList() {
  displayList(allAnimals);
}
function displayList(animals) {
  document.querySelector("#list tbody").innerHTML = "";

  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  const clone = document.querySelector("template#animal").content.cloneNode(true);

  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;
  document.querySelector("#list tbody").appendChild(clone);
}
