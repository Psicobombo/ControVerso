
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
