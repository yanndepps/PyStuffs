/////////////////////////////////////////
// --- local storage & user inputs --- //
/////////////////////////////////////////
// pick some DOM elements
const greetings = document.getElementById("greetings");
const addUserName = document.getElementById("add-user");
const createUser = document.getElementById("create-user");

// display greetings in 21 languages -> pick one at random each time
const wordList = ["Bonjour, ", "Hola, ", "Zdravstvuyte ", "Nǐn hǎo, ", "Salve, ",
  "Konnichiwa, ", "Guten Tag, ", "Olá, ", "Anyoung haseyo, ", "Asalaam alaikum, ",
  "Goddag, ", "Shikamoo, ", "Goedendag, ", "Yassas, ", "Dzień dobry, ", "Namaste, ", "Merhaba, ",
  "Shalom, ", "God dag, ", "Yo, "];

const rndWord = wordList[Math.floor(Math.random() * wordList.length)]
const msg = rndWord;

// use guest if no username
const gst = "guest";


// check for local storage values at start
for (let [key, value] of Object.entries(localStorage)) {
  // is the value an empty string ? display guest : display username
  if (value == "") {
    greetings.innerText = `${msg} ${gst} !`;
  } else {
    greetings.innerText = `${msg}` + localStorage.getItem(`${key}`) + " !";
  }
}

// add username value to both localStorage and DOM
createUser.addEventListener("click", () => {
  const txtValue = addUserName.value;
  localStorage.setItem("username", `${txtValue}`);
  greetings.innerText = localStorage.getItem("username");
});


////////////////////////////////////////
////// --- typewritter effect --- //////
////////////////////////////////////////
const emptyTxt = "";
const idAddUsr = "add-user";
const idAddNote = "add-notes";
const idSearchNotes = "get-notes";
const txtUsr = "enter a user name ...";
const txtNote = "write a new note ...";
const txtSearch = "search your notes ...";
const spdUsr = 90;
const spdNote = spdUsr * 0.25;
const spdSearchNote = spdUsr * 0.5;
const typoUsr = 0;
const typoNote = 0;
const typoSearchNote = 0;

/*
* Class declaration for the type writter effect, with following params:
*
* plh -> placeholder value in the DOM 
* txt -> a string of txt to display 
* id -> which id to grab from DOM
* spd -> how fast do we display out txt 
* typo -> init at 0 and increment 
*
*/

class TypeWritter {
  constructor(plh, txt, id, spd, typo) {
    this.plh = plh;
    this.txt = txt;
    this.id = id;
    this.spd = spd;
    this.typo = typo;
  }

  type() {
    // display our placeholder txt one char at a time
    this.plh += this.txt.charAt(this.typo);
    document.getElementById(`${this.id}`).setAttribute("placeholder", this.plh);
    this.typo++;

    // call the fn again at x spd
    setTimeout(() => {
      this.type();
    }, this.spd);
  }
}

// Init three instances of our TypeWritter class :
// one for the username placeholder
// the second one for the add-note placeholder
// the third one for the get-notes placeholder
// all txts rendered at different speeds
const typeNote = new TypeWritter(emptyTxt, txtNote, idAddNote, spdUsr, typoNote);
const typeUsr = new TypeWritter(emptyTxt, txtUsr, idAddUsr, spdNote, typoUsr);
const typeSearch = new TypeWritter(emptyTxt, txtSearch, idSearchNotes, spdSearchNote, typoSearchNote);

typeNote.type();
typeUsr.type();
typeSearch.type();
