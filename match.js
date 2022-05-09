class Match {
    constructor(char1, char2, title = {"label": "OVERTHINK"}) {      //title is optional parameter, if not passed (eg in startup) dafaults to game name
        this.id = endedMatches.length + 1 
        this.leftOpponent = char1
        this.rightOpponent = char2
        this.title = title
        this.winner = null
        this.loser = null
        this.votesPercentage = 50
        this.voters = {
            left: [],
            right: []
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
        document.getElementById("opponent-label-left").innerHTML = this.leftOpponent.label

        // set right card image
        let rightParticipant = document.getElementById("vs-participant-right")
        rightParticipant.src = this.rightOpponent.url

        // set right card label
        document.getElementById("opponent-label-right").innerHTML = this.rightOpponent.label
    }

    end(winner) {

        this.isEnded = true


        switch (winner) {
            case "left":
                this.winner = this.leftOpponent
                this.loser = this.rightOpponent
                break;

            case "right":
                this.winner = this.rightOpponent
                this.loser = this.leftOpponent
                break;
            case "draw":
                this.winner = "draw"
                this.loser = "draw"
        }

        console.log("Risultato match:" + winner)


        endedMatches.push(this)
    }




}