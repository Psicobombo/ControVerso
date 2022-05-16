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

    sw.init()

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

        // And swap it with the current element
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

function newRandomMatch() {

    new Match(getRandom("character"), getRandom("character"), getRandom("title"))
    resetModifiers()

}


function randomizeTitle() {

    updateMatchData()

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

    leftModifierDiv.value = ""
    rightModifierDiv.value = ""
}



function randomizeOpponent(id) {

    updateMatchData()

    if (id == "left") {
        activeMatch.leftOpponent = getRandom("character")

    } else {
        activeMatch.rightOpponent = getRandom("character")
    }

    activeMatch.display()
}


function customizeOpponent() {

    inputURL = document.getElementById("opponentUrlInput").value

    console.log(inputURL)
    console.log(selectedOpponent)

    if (selectedOpponent == "left") {
        document.getElementById("vs-participant-left").src = inputURL
    } else {
        document.getElementById("vs-participant-right").src = inputURL
    }
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


function updateMatchLeftPercentage() {

    // Calculate left percentage as: leftVotes/TotalVotes
    let calculatedLeftPerc = activeMatch.voters.left.size / (activeMatch.voters.left.size + activeMatch.voters.right.size)

    // Update match object
    activeMatch.leftPercentage = calculatedLeftPerc

    updatePieChart()
}

function updatePieChart() {

    // update piechart by updating root variable --leftPercentage
    let r = document.querySelector(':root');
    r.style.setProperty('--leftPercentage', activeMatch.leftPercentage);

}


function updateMatchData() {

    // push user-made changes to the activeMatch object

    // update title
    let titleDiv = document.getElementById("title")
    activeMatch.title = {"label" : titleDiv.innerHTML, "twitchSafe" : true, "category" : ""}

    // update left card image
    let leftImage = document.getElementById("vs-participant-left")
    activeMatch.leftOpponent.url = leftImage.src

    // update left card label
    activeMatch.leftOpponent.label = document.getElementById("opponent-label-left").innerText

     // update right card image
     let rightImage = document.getElementById("vs-participant-right")
     activeMatch.rightOpponent.url = rightImage.src

    // update right card label
    activeMatch.rightOpponent.label = document.getElementById("opponent-label-right").innerText
    console.log(activeMatch)
}
