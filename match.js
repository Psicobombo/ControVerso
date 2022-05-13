class Match {
    constructor(char1, char2, title = {"label": "OVERTHINK"}) {      //title is optional parameter, if not passed (eg in startup) dafaults to game name
        this.leftOpponent = char1
        this.rightOpponent = char2
        this.title = title
        this.leftPercentage = 0.5
        this.voters = {
            left: new Set(),
            right: new Set()
        }

        this.display()
    }


    display() {

        activeMatch = this

        //set title
        //TODO: update this.title when user types in title div!!!

        let titleDiv = document.getElementById("tournamentTitle")
        titleDiv.innerHTML = this.title.label

        // set left card image
        let leftImage = document.getElementById("vs-participant-left")
        leftImage.src = this.leftOpponent.url
        // set left card label
        document.getElementById("opponent-label-left").innerText = this.leftOpponent.label

        // set right card image
        let rightParticipant = document.getElementById("vs-participant-right")
        rightParticipant.src = this.rightOpponent.url

        // set right card label
        document.getElementById("opponent-label-right").innerText = this.rightOpponent.label
    }

}