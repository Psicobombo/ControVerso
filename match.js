class Match {
    constructor({character1, character2, title = { "label": "OVERTHINK" }}) {      //title is optional parameter, if not passed (eg in startup) dafaults to game name
        this.leftOpponent = character1
        this.rightOpponent = character2
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

        let titleDiv = document.getElementById("title")
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

        updatePieChart()

    }

    resetPoll() {

        this.leftPercentage = 0.5
        this.voters.left.clear()
        this.voters.right.clear()

        updatePieChart()
    }

}