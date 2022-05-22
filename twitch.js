
const clinetId = ""
const clinetSecret = ""

var voteLeftCommand = "#1"      // defaults commands: #1 and #2
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

    // init DOM variables
    let twitchConnectionButtonText = document.getElementById("twitchButtonText")
    let twitchUsernameInput = document.getElementById("twitchUsernameInput")
    let twitchElements = document.getElementsByClassName('twitch');

    // if twitch is not connected => CONNECT
    if (!twitchConnection) {

        var twitchUsername = document.getElementById("twitchUsernameInput").value

        // if input username is null: set text box style as invalid and return
        if (!twitchUsername) {

            twitchUsernameInput.classList.add('is-invalid');
            return false
        }

        twitchConnectionButtonText.textContent = "CONNECTING"

        // connect to the specified user's chat
        ComfyJS.Init(twitchUsername)

        // when connected event
        ComfyJS.onConnected = async (address, port, isFirstConnect) => {

            twitchConnection = true

            console.log(`Connected to: ${twitchUsername}'s chat`)

            // set text box style to valid
            twitchUsernameInput.classList.add("is-valid")
            twitchUsernameInput.classList.remove('is-invalid');

            // actually show twitch-related html elements (= with twitch class)
            Array.from(twitchElements).forEach(element => {
                element.style.visibility = "visible";
            });

            twitchConnectionButtonText.textContent = "DISCONNECT"
        }

        // if twitch was already connected => disconnect
    } else {

        // generate confirm dialog: CONFIRM = true; CANCEL = false
        if (!confirm("Disconnect from Twitch?")) { return false };

        ComfyJS.Disconnect();

        twitchConnection = false


        // reset text box to default style
        twitchUsernameInput.classList.remove('is-invalid', 'is-valid')

        twitchConnectionButtonText.textContent = "CONNECT"

        // reset stopwatch and twitch poll
        sw.reset()

        Array.from(twitchElements).forEach(element => {
            element.style.visibility = "collapse";
        });
    }
}

ComfyJS.onError = async (error) => {

    //TODO: better twitch error handling
    console.log("errore grosso")
    alert(error);
}

ComfyJS.onChat = (user, message, flags, self, extra) => {

    if (self) { return };
    if (!pollActive) { return };

    // ignore users who already voted
    var userAlreadyVoted = activeMatch.voters.right.has(user) || activeMatch.voters.left.has(user)

    if (message.includes(voteLeftCommand) && !userAlreadyVoted) {
        activeMatch.voters.left.add(user)
        updateMatchLeftPercentage()
    }
    else if (message.includes(voteRightCommand) && !userAlreadyVoted) {
        activeMatch.voters.right.add(user)
        updateMatchLeftPercentage()
    }
    
};


// fires on chat messages starting with !
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

