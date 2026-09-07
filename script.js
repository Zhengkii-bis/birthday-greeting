const input = document.getElementById("nameinput");
const button = document.getElementById("enterbutton");
const backButton = document.getElementById("backbutton");

const heroEl = document.getElementById("hero");
const resultEl = document.getElementById("result");

const photoEl = document.getElementById("photo");
const gifLeftEl = document.getElementById("gif-left");
const gifRightEl = document.getElementById("gif-right");
const gifTopEl = document.getElementById("gif-top")
const nameEl = document.getElementById("name");
const birthdayEl = document.getElementById("birthday");
const messageEl = document.getElementById("message");

button.addEventListener("click", searchbirthday);
backButton.addEventListener("click", resetSession);

// Turns a Date object into something readable, e.g. "September 7, 2026"
function formatToday(date) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
}

function showResultView() {
    heroEl.style.display = "none";
    resultEl.style.display = "block";
}

// Hides all the "celebration" elements (photo, gifs, message box)
function hideCelebrationElements() {
    photoEl.style.display = "none";
    gifLeftEl.style.display = "none";
    gifRightEl.style.display = "none";
    gifTopEl.style.display = "none";
    messageEl.style.display = "none";
}

// Shows all the "celebration" elements
function showCelebrationElements() {
    photoEl.style.display = "inline-block";
    gifLeftEl.style.display = "block";
    gifRightEl.style.display = "block";
    gifTopEl.style.display = "block";
    messageEl.style.display = "block";
}

function resetSession() {
    input.value = "";
    photoEl.src = "";
    nameEl.textContent = "";
    birthdayEl.textContent = "";
    messageEl.textContent = "";

    hideCelebrationElements();
    resultEl.style.display = "none";
    heroEl.style.display = "block";
    input.focus();
}

async function searchbirthday() {
    const name = input.value.trim();

    if (name === "") {
        hideCelebrationElements();
        nameEl.textContent = "Please type a name first.";
        birthdayEl.textContent = "";
        showResultView();
        return;
    }

    try {
        // 1. Load the JSON file
        const response = await fetch("birthdays.json");
        const people = await response.json();

        // 2. Find the matching person (case-insensitive)
        const person = people.find(
            (p) => p.fullname.toLowerCase() === name.toLowerCase()
        );

        // 3. Get today's date, both as MM-DD (for comparison) and readable format (for display)
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const todayMMDD = `${month}-${day}`;
        const todayReadable = formatToday(today);

        // 4. If no match found
        if (!person) {
            hideCelebrationElements();
            nameEl.textContent = "Name not found.";
            birthdayEl.textContent = `Please check the spelling and format (Ex: Jayson Simballa).`;
            showResultView();
            return;
        }

        // 5. Check if today is their birthday
        if (person.birthdate === todayMMDD) {
            // It IS their birthday: show name, photo, gifs, and the message
            nameEl.textContent = `${person.fullname}`;
            birthdayEl.textContent = `Today is ${todayReadable} — Happy Birthday!`;
            messageEl.textContent = person.message;
            photoEl.src = person.image;
            photoEl.alt = person.fullname;

            showCelebrationElements();
        } else {
            // NOT their birthday: minimal view, just a greeting
            hideCelebrationElements();
            nameEl.textContent = `Hello ${person.nickname}, today is not your birthday.`;
            birthdayEl.textContent = "";
        }

        showResultView();
    } catch (error) {
        console.error("Error loading birthdays.json:", error);
        hideCelebrationElements();
        nameEl.textContent = "Something went wrong loading the data.";
        birthdayEl.textContent = "";
        showResultView();
    }
}