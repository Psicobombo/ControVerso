var activeMatch = false
var endedMatches = []
var selectedOpponent
var selectedWinner
var twitchSafeMode
var twitchConnection = false

// listen for load event in the window
window.addEventListener("load", function () {
    console.log("Page loaded");

    // do things after the DOM loads fully

    new Match(getRandom("character"), getRandom("character"))

});



function shuffle(array) {

    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle

    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

function updateProgressBar() {
    activeMatch.votesPercentage //TO DO

}


function chooseWinner(clickedImage) {

    if (clickedImage.id.includes("left")) {

        activeMatch.end("left")
    } else { activeMatch.end("right") }
}


function newRandomMatch() {

    new Match(getRandom("character"), getRandom("character"), getRandom("title"))
    resetModifiers()

}

async function toggleTwitchConnection() {

    let twitchConnectionButtonSpinner = document.getElementById("spinnerTwitchConnection")
    let twitchConnectionButtonText = document.getElementById("twitchButtonText")
    let twitchContainer = document.getElementById("twitch-container")
    let twitchOptionsPanel = document.getElementById("twitchOptions")
    let twitchUsernameInput = document.getElementById("twitchUsernameInput")

    if (!twitchConnection) {
        let twitchUsername = document.getElementById("twitchUsernameInput").value
        if (!twitchUsername) {

            if (!twitchUsernameInput.classList.contains('is-invalid'))
                twitchUsernameInput.classList.add('is-invalid');

            return false
        }


        twitchConnectionButtonSpinner.style.display = "inline-block"


        twitchConnectionButtonText.textContent = "CONNECTING"

        ComfyJS.Init(twitchUsername)



        ComfyJS.onConnected = async (address, port, isFirstConnect) => {
            console.log("Connected to " + twitchUsername)

            twitchUsernameInput.classList.add("is-valid")
            if (twitchUsernameInput.classList.contains('is-invalid'))
                twitchUsernameInput.classList.remove('is-invalid');


            twitchContainer.style.display = "flex"

            twitchConnection = true
            twitchConnectionButtonSpinner.style.display = "none"


            twitchConnectionButtonText.textContent = "DISCONNECT"
            twitchOptionsPanel.style.display = "inline-block"

        }
    } else {
        if (!confirm("Disconnect from Twitch?")) { return false };
        ComfyJS.Disconnect();
        console.log("Disconnected from chat")

        twitchContainer.style.display = "none"

        twitchConnection = false

        if (twitchUsernameInput.classList.contains('is-invalid'))
            twitchUsernameInput.classList.remove('is-invalid');

        if (twitchUsernameInput.classList.contains('is-valid'))
            twitchUsernameInput.classList.remove('is-valid');


        twitchConnectionButtonText.textContent = "CONNECT"
        twitchOptionsPanel.style.display = "none"
    }
}



async function addPastMatch(match) {

    let rankingList = document.getElementById("ranking-list")
    let newListItem = document.createElement('li')
    newListItem.setAttribute('class', 'ranking-listitem')
    let newDiv = document.createElement('div')
    newDiv.setAttribute('class', 'ranking-participant')
    let loserImage = document.createElement("img")
    loserImage.setAttribute('src', match.loser.img)
    loserImage.setAttribute('class', 'past-loser-image')
    let winnerImage = document.createElement('img')
    winnerImage.setAttribute('src', match.winner.img)
    winnerImage.setAttribute('class', 'past-winner-image')

    if (match.opponents.left == match.winner) {
        newDiv.appendChild(winnerImage)
        newDiv.appendChild(loserImage)
    } else {
        newDiv.appendChild(loserImage)
        newDiv.appendChild(winnerImage)
    }

    newListItem.appendChild(newDiv)
    rankingList.appendChild(newListItem)





}

function randomizeTitle() {

    currentTitle = activeMatch.title

    let randomTitle = currentTitle

    while (randomTitle == currentTitle) {
        //select random title from list
        randomTitle = getRandom("title")
    }

    activeMatch.title = randomTitle
    //refresh page
    activeMatch.display()
}

function randomizeModifier(id) {

    //change title div to random string
    if (id == "left") {
        modifierDiv = document.getElementById("modifier-left")
    }
    else {
        modifierDiv = document.getElementById("modifier-right")
    }

    modifierDiv.value = getRandom("modifier").label
}

function clearModifier(containerId) {

    
    if (containerId == "left") {
        currentModifierDiv = document.getElementById("modifier-left")
    }
    else {
        currentModifierDiv = document.getElementById("modifier-right")
    }

    currentModifierDiv.value = ""
}

function resetModifiers() {

    leftModifierDiv = document.getElementById("modifier-left")
    rightModifierDiv = document.getElementById("modifier-right")

    leftModifierDiv.value= ""
    rightModifierDiv.value = ""
}



function randomizeOpponent(id) {

    if (id == "left") {
        activeMatch.leftOpponent = getRandom("character")

    } else {
        activeMatch.rightOpponent = getRandom("character")
    }

    activeMatch.display()
}


function customizeOpponent(clickedDiv) {

    inputURL = document.getElementById("opponentUrlInput").value

    console.log(inputURL)

    if (selectedOpponent = "left") {
        document.getElementById("vs-participant-left").src = inputURL
    } else {
        document.getElementById("vs-participant-right").src = inputURL
    }
}

function setSelectedOpponent(clickedDiv) {

    if ("left" in clickedDiv.classList) {
        selectedOpponent = "left"
    } else {
        selectedOpponent = "right"
    }
}


function selectWinner(side) {

    if (selectedWinner != side) {
        selectedWinner = side
        resetTeamSelection()
        document.getElementById("teamSelection-button-" + side).classList.add("selected")
        document.getElementById(side + "Selection-icon").innerHTML = "star"
        document.getElementById("winnerConfirmation-button").style.visibility = "visible"
        console.log("selectedWinner settato su: " + side)
    } else {
        selectedWinner = null
        document.getElementById("winnerConfirmation-button").style.visibility = "hidden"
        resetTeamSelection()
        console.log("selectedWinner annullato")
    }

}

function resetTeamSelection() {

    document.getElementById("leftSelection-icon").innerHTML = "star_outline"
    document.getElementById("drawSelection-icon").innerHTML = "star_outline"
    document.getElementById("rightSelection-icon").innerHTML = "star_outline"

    document.getElementById("teamSelection-button-left").className = "teamSelection-button"
    document.getElementById("teamSelection-button-draw").className = "teamSelection-button"
    document.getElementById("teamSelection-button-right").className = "teamSelection-button"



}

function getRandom(element) {

    let randomElement


    do {
        switch (element) {
            case "character":

                //select random opponent from list
                randomElement = characters[Math.floor(Math.random() * characters.length)];

                break;
            case "modifier":

                //select random opponent from list
                randomElement = modifiers[Math.floor(Math.random() * modifiers.length)];

                break;
            case "title":

                //select random opponent from list
                randomElement = titles[Math.floor(Math.random() * titles.length)];
                console.log("Random title: " + randomElement)

                break;
            default:
                return false;
                break;

        }

    } while (twitchSafeMode && !randomElement.twitchSafe);

    return randomElement;


}







function updateTwitchSafeMode() {

    twitchSafeMode = document.getElementById("twitchSafeMode-checkbox").checked;

    console.log("Twitch Safe Mode: " + twitchSafeMode)




}