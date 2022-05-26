
var twitch = {
    // PROPERTIES
    isConnected: false, // status of twitch connection
    connectedTo: null, // channel of connected chat
    pollIsActive: false,
    credentials: {
        clientId: "",
        secret: ""
    },
    commands: {
        voteLeft: "#1", // default commands: #1 and #2
        voteRight: "#2"
    },


    init: () => {
        // GET HTML ELEMENTS
        twitch.elements = document.getElementsByClassName('twitch');

        twitch.connectionButton = document.getElementById("twitch-connection-button");
        twitch.usernameInput = document.getElementById("twitchUsernameInput");

        twitch.voteLeftInput = document.getElementById("voteLeftCommand-input")
        twitch.voteRightInput = document.getElementById("voteRightCommand-input")

        twitch.voteLeftLabel = document.getElementById("twitch-voteLeft-label")
        twitch.voteRightLabel = document.getElementById("twitch-voteRight-label")

        // LINK ELEMENTS TO FUNCTIONS
        twitch.connectionButton.onclick = twitch.connect;
        twitch.voteLeftInput.onchange = twitch.voteRightInput.onchange = twitch.updateVoteCommands
    },

    connect: () => {

        let username = twitch.usernameInput.value

        // if input username is null: set text box style as invalid and return
        if (!username) {
            twitch.usernameInput.classList.add('is-invalid');
            return false
        }

        twitch.connectionButton.innerText = "CONNECTING"

        // connect to the specified user's chat
        ComfyJS.Init(username)

        // when connected event
        ComfyJS.onConnected = async (address, port, isFirstConnect) => {

            twitch.isConnected = true
            twitch.connectedTo = username

            console.log(`Connected to: ${username}'s chat`)

            // set text box style to valid
            twitch.usernameInput.classList.add("is-valid")
            twitch.usernameInput.classList.remove('is-invalid');

            // actually show twitch-related html elements (= with twitch class)
            Array.from(twitch.elements).forEach(element => {
                element.classList.remove("hidden")
            });

            twitch.connectionButton.onclick = twitch.disconnect;
            twitch.connectionButton.innerText = "DISCONNECT"
        }
    },

    disconnect: () => {

        // generate confirm dialog: CONFIRM = true; CANCEL = false
        if (!confirm("Disconnect from Twitch?")) { return false };

        ComfyJS.Disconnect();

        console.log(`Disconnected from twitch chat`)

        twitch.isConnected = false
        twitch.connectedTo = null

        // reset text box to default style
        twitch.usernameInput.classList.remove('is-invalid', 'is-valid')

        // reset percentage, clear voters, update piechart and reset timer
        activeMatch.resetPoll()

        // hide twitch related HTML elements
        Array.from(twitch.elements).forEach(element => {
            element.classList.add("hidden")
        });

        twitch.connectionButton.onclick = twitch.connect;
        twitch.connectionButton.innerText = "CONNECT"
    },

    updateVoteCommands: () => {

        // update twitch object
        twitch.commands = {
            voteLeft: twitch.voteLeftInput.value,
            voteRight: twitch.voteRightInput.value
        }

        // update displayed commands labels
        twitch.voteLeftLabel.innerText = twitch.commands.voteLeft
        twitch.voteRightLabel.innerText = twitch.commands.voteRight
    }
}

ComfyJS.onError = (error) => {

    //TODO: better twitch error handling

    // NOT WORKING?
    alert(error);
}

ComfyJS.onChat = (user, message, flags, self, extra) => {

    if (self) { return };
    if (!twitch.pollIsActive) { return };

    // ignore users who already voted
    var userAlreadyVoted = activeMatch.voters.right.has(user) || activeMatch.voters.left.has(user)

    if (message.includes(twitch.commands.voteLeft) && !userAlreadyVoted) {
        activeMatch.voters.left.add(user)
        updateMatchLeftPercentage()
    }
    else if (message.includes(twitch.commands.voteRight) && !userAlreadyVoted) {
        activeMatch.voters.right.add(user)
        updateMatchLeftPercentage()
    }
};


// fires on chat messages starting with !
ComfyJS.onCommand = async (user, command, message, flags, extra) => {

    if (command === "clear") {
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
    return userID;
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
        console.log(error)
        return false
    }


}

async function getTwitchAuthorization() {
    let url = `https://id.twitch.tv/oauth2/token?client_id=${clinetId}&client_secret=${clinetSecret}&grant_type=client_credentials`;

    const res = await fetch(url, {
        method: "POST",
    });
    const data = await res.json();
    return data;
}

