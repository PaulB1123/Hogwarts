"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let readyStudents = allStudents;
let filteredArray;
let newArr = [];
let bloodItems = [];
let JsonDataForFilter;
let toggleButton = true;
let toggleButtonSmallFilter = true;
let prefectedStudents = [];
let squadedStudents = [];
let expelledStudents = [];

let isHacked = false;
let filter = "All houses";
let sortDirection = "asc";

const settings = {
  filterBy: "all",
  sortBy: "firstname",
  sortDir: "asc",
};

const popup = document.querySelector(".popup_container");
const popupDim = document.querySelector(".popup_dim");
const Student = {
  firstname: "",
  middlename: "",
  lastname: "",
  photo: "",
  house: "",
  gender: "",
  prefect: false,
  squad: false,
  expelled: false,
};

function start() {
  console.log("ready");
  document.getElementById("expelledStudentsForOne").addEventListener("click", showExpelledStudents);
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((th) => th.addEventListener("click", selectSort));
  getData();
}

async function getData() {
  const jsonDataList = await leadJSON();
  async function leadJSON() {
    const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    const jsonData = await response.json();
    return jsonData;
  }

  const jsonDataBlood = await BloodData();
  async function BloodData() {
    const responseBlood = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");
    const jsonDataBlood = await responseBlood.json();
    return jsonDataBlood;
  }

  prepareObjects(jsonDataList, jsonDataBlood);
}

function prepareObjects(jsonDataList, jsonDataBlood) {
  JsonDataForFilter = jsonDataList;
  const JsonBloodDataForFilter = jsonDataBlood;
  bloodItems = JsonBloodDataForFilter;
  console.log(bloodItems);
  allStudents = jsonDataList.map(prepareObject);
  blood(bloodItems);
  clicking();
  displayList(allStudents);
}

function clicking() {
  document.querySelector("#searchbar").addEventListener("input", searchFieldInput);
  document.querySelector("#searchbar_icon").addEventListener("click", hackTheSystem);
}

function prepareObject(jsonData, bloodItems) {
  const student = Object.create(Student);

  const cleaningText = jsonData.fullname.trimStart().trimEnd();
  const cleaningHouse = jsonData.house.trimStart().toLowerCase();
  const texts = cleaningText.toLowerCase().split(" ");
  const FirstName = texts[0];

  student.firstname = FirstName.charAt(0).toUpperCase() + FirstName.substring(1).toLowerCase();

  student.middlename = cleaningText.substring(cleaningText.indexOf(" ") + 1, cleaningText.lastIndexOf(" "));
  student.middlename = student.middlename.toLowerCase();
  student.middlename = student.middlename.charAt(0).toUpperCase() + student.middlename.substring(1).toLowerCase();
  // student.gender =

  // console.log(student.middlename);

  const LastName = cleaningText.substring(cleaningText.lastIndexOf(" "), cleaningText.lastIndexOf(""));
  student.lastname = LastName.charAt(1).toUpperCase() + LastName.substring(2).toLowerCase();
  student.house = cleaningHouse.charAt(0).toUpperCase() + cleaningHouse.substring(1).toLowerCase();
  student.gender = jsonData.gender.charAt(0).toUpperCase() + jsonData.gender.substring(1).toLowerCase();

  let patil = "patil_p.png";
  let fletchley = "finch-fletchley_j.png";

  let temp = "";
  let array = cleaningText.split(" ");
  let otherName;
  let exceptionMiddleName = '"ernie"';
  let nickName;
  let middleNameWithHyen;
  array.forEach(upperCase);

  function upperCase(word) {
    otherName = word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
    // console.log(otherName);
    temp = temp + " " + word;
  }
  //   console.log(temp);

  let array2 = temp.split("-");
  array2.slice(1).forEach(upperCase2);

  function upperCase2(word) {
    word = word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
    // console.log(array2);
    middleNameWithHyen = array2[1].charAt(0).toUpperCase() + array2[1].substring(2).toLowerCase();

    // console.log(middleNameWithHyen);
  }

  student.photo = student.lastname.toLowerCase() + "_" + student.firstname.charAt(0).toLowerCase() + ".png";
  if (student.photo === patil) {
    student.photo = student.lastname.toLowerCase() + "_" + student.firstname.toLowerCase() + ".png";
  } else if (student.photo === fletchley) {
    student.photo = array2[1].toLowerCase() + "_" + student.firstname.charAt(0).toLowerCase() + ".png";
  }

  if (student.middlename === exceptionMiddleName) {
    nickName = student.middlename;
    student.middlename = "";
    // student.middlename = nickName;
    console.log(nickName);
  }

  console.log(student);
  return student;
}

function blood(bloodItems) {
  const pure = bloodItems.pure;
  const half = bloodItems.half;

  allStudents.forEach((student) => {
    console.log(bloodItems);
    if (half.includes(student.lastname)) {
      student.blood = "half";
    } else if (pure.includes(student.lastname)) {
      student.blood = "pure";
    } else {
      student.blood = "muggle";
    }
    student.bloodStatus = student.blood.charAt(0).toUpperCase() + student.blood.substring(1).toLowerCase();
  });
}

//this is the filtering option //

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  // filteredList = allStudents;

  let filterOnHouse = "house";
  // let filterOnGender = "gender";

  if (settings.filterBy === "all") {
    filteredList = allStudents;
    // console.log(allStudents);
  } else if (settings.filterBy === "Gryffindor") {
    filteredList = allStudents.filter(isStudentsHouse);
  } else if (settings.filterBy === "Slytherin") {
    filteredList = allStudents.filter(isStudentsHouse);
  } else if (settings.filterBy === "Hufflepuff") {
    filteredList = allStudents.filter(isStudentsHouse);
  } else if (settings.filterBy === "Ravenclaw") {
    filteredList = allStudents.filter(isStudentsHouse);
  } else if (settings.filterBy === "Boy") {
    filteredList = allStudents.filter(isStudentsGender);
  } else if (settings.filterBy === "Girl") {
    filteredList = allStudents.filter(isStudentsGender);
  }

  function isStudentsHouse(student) {
    if (student[filterOnHouse] === settings.filterBy) {
      return true;
    } else {
      return false;
    }
  }

  displayList(filteredList);
  return filteredList;
}

//here starts the sorting function//
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //find old sortBy element
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  console.log(oldElement);
  oldElement.classList.remove("sortby");

  //indicate active sort
  event.target.classList.add("sortby");

  //toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  console.log(`user selected: ${sortBy} and ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  console.log(settings.sortBy);
  settings.sortDir = sortDir;
  console.log(settings.sortBy);
  buildList();
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  // closure
  function sortByProperty(a, b) {
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

//here ends the sorting function//

//here starts the serach button//

function searchFieldInput(event) {
  // write to the list with only those elemnts in the allAnimals array that has properties containing the search frase

  const input = event.target.value;

  const searchStudents = allStudents.filter((student) => {
    const fullStudentName = `${student.firstname} ${student.middlename} ${student.nickname} ${student.lastname}${student.house}`;
    // console.log(fullStudentName);
    if (fullStudentName.toLowerCase().includes(input.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  });

  displayList(searchStudents);
}

//here ends the serach button//

function displayList(students) {
  // clear the list
  // console.log(students);
  document.querySelector(".bodyOfThePage #list tbody").innerHTML = "";
  document.querySelector("h3").textContent = `The list has ${students.length} students`;
  if (students.length === 1) {
    document.querySelector("h3").textContent = `The list has 1 student`;
  }

  if (students.length === 0) {
    document.querySelector("h3").textContent = `The list is empty`;
  }
  console.log("this is for one element");
  students.forEach(displayStudent);
  console.log(readyStudents);
}

function displayStudent(student) {
  // console.log(student);

  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector("[data-field=firstName]").textContent = student.firstname;
  clone.querySelector("[data-field=middle-name]").textContent = student.middlename;
  clone.querySelector("[data-field=last-name]").textContent = student.lastname;
  clone.querySelector("[data-field=photo] img").src = `images/${student.photo}`;
  // clone.querySelector(".list_prefect").textContent = student.isPrefect ? '<img src="svg/prefect_icon.svg" class="icon"> Prefect' : "";
  clone.querySelector("[data-field=house]").textContent = student.house;

  // clone.querySelector("#list tbody").addEventListener("click", prePopUP);
  // console.log("template#student th");

  // function prePopUP() {
  //   document.querySelector(".overlay").classList.add("darken");
  //   // document.querySelector("#hackTheSystem").classList.add("hidden");

  //   PopUp(student);
  // }

  document.querySelector("tbody").appendChild(clone);
  document.querySelector("tbody").lastElementChild.addEventListener("click", openPopup);

  function openPopup() {
    console.log("this is working");
    popup.querySelector(".is_expelled").style.display = "none";
    popup.querySelector(".expel").setAttribute("data-student-name", student.firstName);
    popup.querySelector("h2").innerHTML = `${student.firstname} ${student.lastname}`;
    popup.querySelector(".student_image").src = `images/${student.photo}`;
    popup.querySelector(".popup_first_name .popup_info_content").innerHTML = student.firstname;
    popup.querySelector(".popup_middle_name .popup_info_content").innerHTML = student.middlename;
    console.log(popup);

    if (!student.middlename) {
      popup.querySelector(".popup_middle_name").classList.add("hidden");
    } else {
      popup.querySelector(".popup_middle_name").classList.remove("hidden");
    }

    if (!student.nickname) {
      popup.querySelector(".popup_nick_name").classList.add("hidden");
    } else {
      popup.querySelector(".popup_nick_name").classList.remove("hidden");
    }

    popup.querySelector(".popup_nick_name .popup_info_content").innerHTML = student.nickname;
    popup.querySelector(".popup_last_name .popup_info_content").innerHTML = student.lastname;
    popup.querySelector(".popup_blood_status .popup_info_content").innerHTML = student.bloodStatus;
    popup.querySelector(".popup_gender .popup_info_content").innerHTML = student.gender;
    popup.querySelector(".popup_prefect").innerHTML = student.isPrefect ? '<img src="svg/prefect_icon.svg" class="icon"> Prefect' : "";
    // popup.querySelector(".popup_inq_squad").innerHTML = student.isInqSquadMember ? '<img src="elements/inq_icon.svg" class="icon"> Inq. Squad member' : "";
    popup.querySelector(".popup").style.backgroundColor = `var(--${student.house}-main-color)`;
    console.log("until here is working");

    popup.style.display = "block";
    document.querySelector("body").style.overflow = "hidden";

    popupDim.addEventListener("click", closePopup);
    document.querySelector(".close").addEventListener("click", closePopup);

    //expell function starts

    if (student.expelled === false) {
      popup.querySelector(".modalLeftBottom p:nth-of-type(2)").textContent = `Is expelled: No`;
      popup.querySelector(".modalLeftBottom p:nth-of-type(4)").textContent = "Inquisitorial squad member: No";
      popup.querySelector(".modalLeftBottom p:nth-of-type(3)").textContent = "Has prefect: No";

      popup.querySelector("#expelButton").addEventListener("click", expelClicked);
      popup.querySelector("#makeSquad").addEventListener("click", Squad);

      function expelClicked() {
        this.removeEventListener("click", expelClicked);
        expelStudent(student);
      }
    } else {
      popup.querySelector("#expelledRed").className = "expelledRed";
      popup.querySelector(".modalLeftBottom p:nth-of-type(2)").textContent = `Is expelled: Yes`;
      popup.querySelector(".modalLeftBottom p:nth-of-type(4)").textContent = "Inquisitorial squad member: No";
      popup.querySelector(".modalLeftBottom p:nth-of-type(3)").textContent = "Has prefect: No";
    }
  }

  function expelStudent(student) {
    if (student.firstname === "Hacker") {
      alertFromHacker();
      document.querySelector("#hackedModal p").textContent = "Hacker can't be expelled";
    } else {
      student.expelled = true;

      const indexStudent = allStudents.findIndex((obj) => obj.firstname === student.firstname);
      allStudents.splice(indexStudent, 1);

      if (student.prefect === true) {
        student.prefect = false;

        const indexStudent2 = prefectedStudents.findIndex((obj) => obj.firstname === student.firstname);
        prefectedStudents.splice(indexStudent2, 1);
      }

      if (student.squad === true) {
        student.squad = false;

        const indexStudent3 = squadedStudents.findIndex((obj) => obj.firstname === student.firstname);
        squadedStudents.splice(indexStudent3, 1);
      }

      expelledStudents.push(student);

      buildList();
      displayStudent(student);
    }
  }

  // Squad starts
  function Squad() {
    if (student.squad === true) {
      popup.querySelector("#makeSquad").textContent = "Remove from squad";
      popup.querySelector(".modalLeftBottom p:nth-of-type(4)").textContent = "Inquisitorial squad member: Yes";
      squadStudent();
    } else if (student.squad === false) {
      popup.querySelector("#makeSquad").textContent = "Add to squad";
      popup.querySelector(".modalLeftBottom p:nth-of-type(4)").textContent = "Inquisitorial squad member: No";
      squadStudent();
    }

    function squadStudent() {
      tryMakeSquad(student);
      console.log(student);
    }

    function tryMakeSquad(student) {
      console.log(student.house);
      console.log(student.blood);
      if (student.house === "Slytherin" || student.blood === "pure") {
        makeSquad(student);
      } else {
        dontMakeSquad();
      }
    }

    function makeSquad(student) {
      if (student.squad === false) {
        student.squad = true;
        squadedStudents.push(student);
      } else {
        student.squad = false;
        const indexStudent = squadedStudents.findIndex((obj) => obj.firstname === student.firstname);
        squadedStudents.splice(indexStudent, 1);
      }

      buildList();
      // showModal(student);
    }

    function dontMakeSquad() {
      alert();
      document.querySelector("#alertModal p:nth-of-type(2)").textContent = "You can only add students with pure blood or from Slytherin house to Inquisitorial Squad";
    }

    function alert() {
      document.querySelector("#alertModal").classList.remove("hidden");
      document.querySelector(".overlay").classList.add("zIndex");

      document.querySelector("#alertModal p").addEventListener("click", (e) => {
        document.querySelector("#alertModal").classList.add("hidden");
        document.querySelector(".overlay").classList.remove("zIndex");
      });
    }
  }

  // Show expelled students
}

function showExpelledStudents() {
  // document.querySelector("#filter").textContent = "Filter ";

  // document.querySelector("input").value = "";
  console.log("this is showing");
  readyStudents = expelledStudents;
  displayListExpelled(readyStudents);
}

function displayListExpelled() {
  document.querySelector("tbody").innerHTML = "";
  console.log("work man, work, ");
  displayStudentExpelled(readyStudents);
}

function closePopup() {
  popup.style.display = "none";
  document.body.style.overflow = "visible";
}

function displayStudentExpelled(readyStudents, student) {
  // console.log(student);
  console.log("this is the one that I need to make it work");
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector("[data-field=firstName]").textContent = student.firstname;
  clone.querySelector("[data-field=middle-name]").textContent = student.middlename;
  clone.querySelector("[data-field=last-name]").textContent = student.lastname;
  clone.querySelector("[data-field=photo] img").src = `images/${student.photo}`;
  clone.querySelector("[data-field=house]").textContent = student.house;

  document.querySelector("tbody").appendChild(clone);
}

//----Hacking

function hackTheSystem() {
  console.log("hackTheSystem");
  if (isHacked) {
    console.log("The system is hacked");
  } else {
    isHacked = true;
    ruinBlood();
    const mySelf = createMyself();
    allStudents.push(mySelf);
    buildList();
    // console.log(allStudents);
  }
}

function createMyself() {
  const mySelf = Object.create(allStudents);
  mySelf.firstname = "Paul";
  mySelf.lastname = "Balta";
  mySelf.middlename = "";
  mySelf.nickname = "";
  mySelf.gender = "boy";
  mySelf.photo = "";
  mySelf.house = "Hufflepuff";
  mySelf.blood = "Pure";
  mySelf.hacker = true;
  // console.log(mySelf);

  return mySelf;
}

function ruinBlood() {
  allStudents.forEach((student) => {
    const randomNum = Math.floor(Math.random() * 3);
    const randomArr = ["muggle", "half", "pure"];
    console.log(student.bloodStatus);
    if (student.bloodStatus === "Half" || student.bloodStatus === "Muggle") {
      student.bloodStatus = "pure";
    } else if (student.blood === "Pure") {
      student.bloodStatus = randomArr[randomNum];
    }
  });
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  displayList(sortedList);
  // displayList(currentList);
  document.querySelector("h3").textContent = `The list has ${currentList.length} students`;
}
