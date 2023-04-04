//////////////////////////
// --- analog clock --- //
//////////////////////////
let hour = document.getElementById("hour");
let minute = document.getElementById("minute");
let seconds = document.getElementById("seconds");

// set the clock every 1000ms -> 1second
let setClock = setInterval(() => {
	let dateNow = new Date(); // create a date obj

	let hr = dateNow.getHours(); // gets the hours. num between 0 -> 23
	let min = dateNow.getMinutes(); // gets the minutes. num between 0 -> 59
	let sec = dateNow.getSeconds(); // gets the seconds. num between 0 -> 59

	/*
	* 360 degrees in one rotation -> (360/12) -> 30 degrees in one hour
	* 6 degrees for each minutes -> (360/60)
	* same calc for seconds
	*/
	let calcHr = (hr * 30) + (min / 2);
	let calcMin = (min * 6) + (sec / 10);
	let calcSec = sec * 6;

	// use the deg values to rotate each hands
	hour.style.transform = `rotate(${calcHr}deg)`
	minute.style.transform = `rotate(${calcMin}deg)`
	seconds.style.transform = `rotate(${calcSec}deg)`
}, 1000);

/////////////////////////////////
// --- set title in motion --- //
/////////////////////////////////

// use an IIFE to automagically call
// our function as it is defined
(function moveTitle() {
	let title = document.getElementsByTagName("title")[0];
	let titleText = title.innerHTML;
	title.innerHTML = titleText.substring(titleText.length - 1) + titleText.substring(0, titleText.length - 1);
	setTimeout(() => {
		window.requestAnimationFrame(moveTitle);
	}, 500);
}
)();

/////////////////////////////////////////
// --- local storage & user inputs --- //
/////////////////////////////////////////

// pick some useful DOM elements
const greetings = document.getElementById("greetings");
const addUserName = document.getElementById("add-user");
const createUser = document.getElementById("create-user");

// display greetings in 21 languages -> pick one at random each time
const wordList = ["Bonjour, ", "Hola, ", "Zdravstvuyte, ", "Nǐn hǎo, ", "Salve, ",
	"Konnichiwa, ", "Guten Tag, ", "Olá, ", "Anyoung haseyo, ", "Asalaam alaikum, ",
	"Goddag, ", "Shikamoo, ", "Goedendag, ", "Yassas, ", "Dzień dobry, ", "Namaste, ", "Merhaba, ",
	"Shalom, ", "God dag, ", "Yo, "];

const rndWord = wordList[Math.floor(Math.random() * wordList.length)]
const msg = rndWord;

// use guest if no username
const gst = "guest";

// check for local storage values at start
if (greetings) {
	for (let [key, value] of Object.entries(localStorage)) {
		// is the value an empty string ? display guest : display username
		if (value === "") {
			greetings.innerText = `${msg} ${gst} !`;
		} else {
			greetings.innerText = `${msg}` + localStorage.getItem(`${key}`) + " !";
		}
	}
}

// add username value to both localStorage and DOM
// only if the id is available
if (createUser) {
	createUser.addEventListener("click", () => {
		const txtValue = addUserName.value;
		localStorage.setItem("username", `${txtValue}`);
		greetings.innerText = localStorage.getItem("username");
	});
}

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
		// check that the id is available
		if (document.getElementById(`${this.id}`) === null) {
			return;
		} else {
			this.plh += this.txt.charAt(this.typo);
			document.getElementById(`${this.id}`).setAttribute("placeholder", this.plh);
			this.typo++;
			// call the fn again at x spd
			setTimeout(() => {
				this.type();
			}, this.spd);
		}
	}
}

// Init three instances of our TypeWritter class :
// one for the username placeholder
// the second one for the add-note placeholder
// the third one for the get-notes placeholder
// all txts render at different speeds
const typeUsr = new TypeWritter(emptyTxt, txtUsr, idAddUsr, spdNote, typoUsr);
const typeSearch = new TypeWritter(emptyTxt, txtSearch, idSearchNotes, spdSearchNote, typoSearchNote);
const typeNote = new TypeWritter(emptyTxt, txtNote, idAddNote, spdUsr, typoNote);
typeNote.type();
typeUsr.type();
typeSearch.type();

