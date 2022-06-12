// WORK IN PROGRESS CLASS, NOT CURRENTLY IN USE
class Card {
    constructor(character, HTMLid) {

        this.character = character
        this.HTMLid = HTMLid
        this.modifier
    }


    init() {

        let CSScardSelector = `#${this.HTMLid}`

        this.elements = {

            // initialize DOM variables
            clearModifierButton: document.querySelector(`${CSScardSelector} > .modifier-button.clear`),
            randomizeModifierButton: document.querySelector(`${CSScardSelector} > .modifier-button.randomize`),
            randomizeCharacterButton: document.querySelector(`${CSScardSelector} > .opponent-button.randomize`),
            customizeCharacterButton: document.querySelector(`${CSScardSelector} > .opponent-button.customize`),

            characterNameLabel: document.querySelector(`${CSScardSelector} > .opponent-label`),
            characterPicture: document.querySelector(`${CSScardSelector} > .modifier-img`),
            modifierTextarea: document.querySelector(`${CSScardSelector} > .modifier-textarea`)
        }

        // link elements to functions
        this.elements.clearModifierButton.onlick = this.clearModifier
        this.elements.randomizeModifierButton.onclick = this.randomizeModifier
        this.elements.randomizeCharacterButton.onclick = this.randomizeCharacter
        this.elements.customizeCharacterButton.onclick = this.customizeCharacter
    }

    /**
    * @param {Object} character
    */
    set setCharacter(character) {
        // update object properties
        this.character = character

        // update HTML elements
        this.elements.characterNameLabel.innerText = character.label
        this.elements.characterPicture.src = character.url
    }

    /**
     * @param {Object} modifier
     */
    set setModifier(modifier) {
        // update object properties
        this.modifier = modifier

        // update HTML elements
        this.elements.modifierTextarea.value = modifier?.label || ""
    }

    randomizeModifier() {
        let randomModifier

        do {
            randomModifier = getValidRandom(modifiers)

        } while (randomModifier.label === this.modifier.label);  // make sure random modifier is different than current modifier

        this.setModifier(randomModifier)
    }

    clearModifier() {
        this.setModifier({})
     }

    randomizeCharacter() {

        this.setCharacter(getValidRandom(characters))
        activeMatch.resetPoll()
        
     }

    customizeCharacter() { }

}