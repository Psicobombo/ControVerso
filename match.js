class Match {
    constructor(opponentsImagesArray) {
        this.id = endedMatches.length + 1
        this.leftOpponent = opponentsImagesArray[0]
        this.rightOpponent = opponentsImagesArray[1]
        this.winner = null
        this.loser = null
        this.votesPercentage = 50
        this.voters = {
            left: [],
            right: []
        }
    }


    display() {
        activeMatch = this
        let leftParticipant = document.getElementById("vs-participant-left")
        leftParticipant.src = this.leftOpponent

        let rightParticipant = document.getElementById("vs-participant-right")
        rightParticipant.src = this.rightOpponent

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