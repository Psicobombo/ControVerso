
var clinetId
var clinetSecret

var voteLeftCommand = "#1"
var voteRightCommand = "#2"
var pollActive = false


function getTwitchAuthorization() {
    let url = `https://id.twitch.tv/oauth2/token?client_id=${clinetId}&client_secret=${clinetSecret}&grant_type=client_credentials`;

    return fetch(url, {
        method: "POST",
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        });
}


async function toggleTwitchConnection() {

    let twitchConnectionButtonText = document.getElementById("twitchButtonText")

    let twitchUsernameInput = document.getElementById("twitchUsernameInput")

    let twitchElements = document.getElementsByClassName('twitch');

    if (!twitchConnection) {
        let twitchUsername = document.getElementById("twitchUsernameInput").value
        if (!twitchUsername) {

            if (!twitchUsernameInput.classList.contains('is-invalid'))
                twitchUsernameInput.classList.add('is-invalid');

            return false
        }

        twitchConnectionButtonText.textContent = "CONNECTING"


        ComfyJS.Init(twitchUsername)

        ComfyJS.onConnected = async (address, port, isFirstConnect) => {

            twitchConnection = true

            console.log("Connected to " + twitchUsername)

            twitchUsernameInput.classList.add("is-valid")
            if (twitchUsernameInput.classList.contains('is-invalid'))
                twitchUsernameInput.classList.remove('is-invalid');

            for (let i = 0; i < twitchElements.length; i++) {
                twitchElements[i].style.visibility = "visible";
            }

            twitchConnectionButtonText.textContent = "DISCONNECT"


        }
    } else {
        if (!confirm("Disconnect from Twitch?")) { return false };
        ComfyJS.Disconnect();
        console.log("Disconnected from chat")

        document.getElementById("twitch-piechart-container").style.visibility = "collapse"

        twitchConnection = false

        if (twitchUsernameInput.classList.contains('is-invalid'))
            twitchUsernameInput.classList.remove('is-invalid');

        if (twitchUsernameInput.classList.contains('is-valid'))
            twitchUsernameInput.classList.remove('is-valid');


        twitchConnectionButtonText.textContent = "CONNECT"

        for (let i = 0; i < twitchElements.length; i++) {
            twitchElements[i].style.visibility = "collapse";
        }


    }
}



async function getProfilePic(username) {
    const endpoint = "https://api.twitch.tv/helix/users?login=" + username;

    let authorizationObject = await getTwitchAuthorization();
    let { access_token, expires_in, token_type } = authorizationObject;

    //token_type first letter must be uppercase    
    token_type =
        token_type.substring(0, 1).toUpperCase() +
        token_type.substring(1, token_type.length);

    let authorization = `${token_type} ${access_token}`;

    let headers = {
        authorization,
        "Client-Id": clinetId,
    };

    const response = await fetch(endpoint, { headers, });
    const json = await response.json();

    try {
        var imgURL = json["data"][0]["profile_image_url"]
    return imgURL;
    } catch (error) {
        return false
    }
    

}


ComfyJS.onChat = (user, message, flags, self, extra) => {

    if (self) { return };
    if (!pollActive) { return }

    if(activeMatch.voters.right.has(user) || activeMatch.voters.left.has(user)) { return }
    else{
        if (message.includes(voteLeftCommand)) {
            activeMatch.voters.left.add(user) 
            console.log(activeMatch.voters)}
        else if (message.includes(voteRightCommand)) {
            activeMatch.voters.right.add(user)
            console.log(activeMatch.voters)
        
        }

        updateMatchLeftPercentage()
        console.log(activeMatch.leftPercentage)
    }

};

ComfyJS.onCommand = async (user, command, message, flags, extra) => {
    if (twitchConnection) {

        if (command === "clear") {
        }
    }
}


async function getID(username) {
    const endpoint = "https://api.twitch.tv/helix/users?login=" + username;

    let authorizationObject = await getTwitchAuthorization();
    let { access_token, expires_in, token_type } = authorizationObject;

    //token_type first letter must be uppercase    
    token_type =
        token_type.substring(0, 1).toUpperCase() +
        token_type.substring(1, token_type.length);

    let authorization = `${token_type} ${access_token}`;

    let headers = {
        authorization,
        "Client-Id": clinetId,
    };

    const response = await fetch(endpoint, { headers, });
    const json = await response.json();
    try {
        var userID = json["data"][0]["id"]

    } catch (TypeError) {
        console.log("Failed to retrieve ID of " + username)
        refresh();

    }


    // console.log(userID)
    return userID;
}

function toggleTwitchPoll() {

    pollActive = !pollActive

    let pollToggleButton = document.getElementById("twitch-poll-toggle-button")

    if(pollActive) {
        pollToggleButton.innerHTML = "STOP POLL"




    }else{
        pollToggleButton.innerHTML = "START POLL"
    }




}
