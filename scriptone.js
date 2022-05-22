var activeMatch = false
var endedMatches = []
var selectedOpponent
var twitchSafeMode = false
var twitchConnection = false

// listen for load event in the window
window.addEventListener("load", function () {

    // initialize stopwatch
    sw.init()

    // not passing title parameter => title defaults to "OVERTHINK"
    new Match(
        {
            character1: getValidRandom(characters),
            character2: getValidRandom(characters)
        })

});


function newRandomMatch() {

    new Match({
        character1: getValidRandom(characters),
        character2: getValidRandom(characters),
        title: getValidRandom(titles)
    })

    resetModifiers()
}

function randomizeTitle() {

    let titleElement = document.getElementById("title")

    currentTitle = titleElement.value

    let randomTitle

    do {
        randomTitle = getValidRandom(titles)

    } while (randomTitle.label === currentTitle);  // make sure random title is different than current title

    activeMatch.title = randomTitle
    titleElement.value = randomTitle.label
}

function randomizeModifier(id) {

    modifierElement = id == "left" ? document.getElementById("modifier-left") : document.getElementById("modifier-right")

    currentModifier = modifierElement.value

    let randomModifier

    do {
        randomModifier = getValidRandom(modifiers)

    } while (randomModifier.label === currentModifier);  // make sure random modifier is different than current modifier

    modifierElement.value = randomModifier.label
}

function clearModifier(id) {

    modifierElement = id == "left" ? document.getElementById("modifier-left") : document.getElementById("modifier-right")
    modifierElement.value = ""
}

function resetModifiers() {

    clearModifier("left")
    clearModifier("right")
}

function randomizeOpponent(id) {

    updateMatchData()

    if (id === "left") {
        activeMatch.leftOpponent = getValidRandom(characters)

    } else {
        activeMatch.rightOpponent = getValidRandom(characters)
    }

    activeMatch.display()
    activeMatch.resetPoll()
}

function customizeOpponent() {

    inputURL = document.getElementById("opponentUrlInput").value

    if (selectedOpponent == "left") {
        document.getElementById("vs-participant-left").src = inputURL
    } else {
        document.getElementById("vs-participant-right").src = inputURL
    }
}

function getValidRandom(array) {

    // returns random element from parsed array && checks if element is twitch safe

    do {
        randomElement = array[Math.floor(Math.random() * array.length)]
    } while (twitchSafeMode && !randomElement.isTwitchSafe);   //if twitchSafeMode is enabled make sure element is twitch friendly 

    return randomElement;
}

function updateTwitchSafeMode() {

    twitchSafeMode = document.getElementById("twitchSafeMode-checkbox").checked;

    console.log("Twitch Safe Mode: " + twitchSafeMode)

}

function updateMatchLeftPercentage() {

    // Calculate left percentage as: leftVotes/TotalVotes & update match object
    activeMatch.leftPercentage = activeMatch.voters.left.size / (activeMatch.voters.left.size + activeMatch.voters.right.size)
    updatePieChart()
}

function updatePieChart() {

    // update piechart by updating css root variable --leftPercentage
    let r = document.querySelector(':root');
    r.style.setProperty('--leftPercentage', activeMatch.leftPercentage);

    //update percentages labels
    document.getElementById("twitch-left-percentage").innerText = `${Math.round((activeMatch.leftPercentage * 100))}%`
    document.getElementById("twitch-right-percentage").innerText = `${100 - (activeMatch.leftPercentage * 100)}%`

}


function owerwritePieChart(percentage) {

    //debug function to overwrite poll percentage

    // update piechart by updating css root variable --leftPercentage
    let r = document.querySelector(':root');
    r.style.setProperty('--leftPercentage', percentage);

    //update percentages labels
    document.getElementById("twitch-left-percentage").innerText = `${Math.round((percentage * 100))}%`
    document.getElementById("twitch-right-percentage").innerText = `${100 - (percentage * 100)}%`

}

function updateMatchData() {

    // push user-made changes to the activeMatch object

    // update title
    let titleDiv = document.getElementById("title")
    activeMatch.title = { "label": titleDiv.innerText, "isTwitchSafe": true, "category": "" }

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
}

function updateCustomColors() {

    let customLeftColor = document.getElementById("color-picker-left").value
    let customRightColor = document.getElementById("color-picker-right").value

    let r = document.querySelector(':root');
    r.style.setProperty('--left-primary', customLeftColor);
    r.style.setProperty('--right-primary', customRightColor);

}

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
