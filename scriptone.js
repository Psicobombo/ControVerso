var activeMatch = false
var endedMatches = []
var selectedOpponent
var selectedWinner

// listen for load event in the window
window.addEventListener("load", function () {
    console.log("Page loaded");

    // do things after the DOM loads fully

    generateNewMatch()

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


function generateNewMatch() {

    //select random participants images from imagesURLs
    const randomImage1 = imagesURLs[Math.floor(Math.random() * imagesURLs.length)];
    const randomImage2 = imagesURLs[Math.floor(Math.random() * imagesURLs.length)];

    let newMatch = new Match([randomImage1, randomImage2])
    newMatch.display()
    resetModifiers()

}

async function toggleTwitchConnection() {

    let twitchConnectionButtonSpinner = document.getElementById("spinnerTwitchConnection")
    let twitchConnectionButtonText = document.getElementById("twitchButtonText")
    let twitchContainer = document.getElementById("twitch-container")
    let profileTwitchConnected = document.getElementById("twitchProfileConnected")
    let twitchOptionsPanel = document.getElementById("twitchOptions")

    if (!twitchConnection) {
        let twitchUsername = document.getElementById("twitchUsernameInput").value
        if (!twitchUsername) { return false }


        twitchConnectionButtonSpinner.style.display = "inline-block"


        twitchConnectionButtonText.textContent = "CONNECTING"

        profileImage = await getProfilePic(twitchUsername)
        if (!profileImage) { return false }

        ComfyJS.Init(twitchUsername)



        ComfyJS.onConnected = async (address, port, isFirstConnect) => {
            console.log("Connected to " + twitchUsername)

            twitchContainer.style.display = "flex"

            twitchConnection = true
            twitchConnectionButtonSpinner.style.display = "none"


            profileTwitchConnected.src = profileImage
            profileTwitchConnected.style.display = "block"
            twitchConnectionButtonText.textContent = "DISCONNECT"
            twitchOptionsPanel.style.display = "inline-block"

        }
    } else {
        if (!confirm("Disconnect from Twitch?")) { return false };
        ComfyJS.Disconnect();

        twitchContainer.style.display = "none"

        twitchConnection = false

        profileTwitchConnected.src = ""
        profileTwitchConnected.style.display = "none"


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

    titleDiv = document.getElementById("tournamentTitle")
    currentTitle = titleDiv.innerHTML
    let randomTitle = currentTitle

    while (randomTitle == currentTitle) {
        //select random title from list
        randomTitle = titles[Math.floor(Math.random() * titles.length)];
    }

    //change title div to random string
    titleDiv.innerHTML = randomTitle
}

function randomizeModifier(containerId) {

    //change title div to random string
    if (containerId == "left") {
        currentModifierDiv = document.getElementById("modifier-left")
    }
    else {
        currentModifierDiv = document.getElementById("modifier-right")
    }

    currentMod = currentModifierDiv.innerHTML
    let randomMod = currentMod

    while (randomMod == currentMod) {
        //select random modifier from list
        randomMod = modifiers[Math.floor(Math.random() * modifiers.length)];

    }

    currentModifierDiv.innerHTML = randomMod



}

function clearModifier(containerId) {

    //change title div to random string
    if (containerId == "left") {
        currentModifierDiv = document.getElementById("modifier-left")
    }
    else {
        currentModifierDiv = document.getElementById("modifier-right")
    }

    currentModifierDiv.innerHTML = "Inserisci modificatore..."
}

function resetModifiers() {

    leftModifierDiv = document.getElementById("modifier-left")
    rightModifierDiv = document.getElementById("modifier-right")

    leftModifierDiv.innerHTML = "Inserisci modificatore..."
    rightModifierDiv.innerHTML = "Inserisci modificatore..."


}



function randomizeOpponent(id) {


    if (id == "left") {
        opponentDiv = document.getElementById("vs-participant-left")

    } else {
        opponentDiv = document.getElementById("vs-participant-right")
    }

    currentOpponent = opponentDiv.src

    let randomOpponent = currentOpponent

    while (randomOpponent == currentOpponent) {
        //select random opponent from list
        randomOpponent = imagesURLs[Math.floor(Math.random() * imagesURLs.length)];

    }

    opponentDiv.src = randomOpponent
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

function toggleModifiersVisibility() {
    modifiersVisibility = !modifiersVisibility

    if (modifiersVisibility) {
        document.getElementById("modifier-container-left") .style.visibility = "visible"
        document.getElementById("modifier-container-right") .style.visibility = "visible"
    }else{
        document.getElementById("modifier-container-left") .style.visibility = "collapse"
        document.getElementById("modifier-container-right") .style.visibility = "collapse"
    }



}