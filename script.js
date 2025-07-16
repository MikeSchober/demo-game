'use strict';

//array of prize values
// let prizes = [1000000, 500000, 250000, 100000, 10000, 1000, 100, 5, 1];
let prizes = [1000000, 750000, 500000, 250000, 150000, 100000, 75000, 50000, 25000, 15000, 10000, 7500, 5000, 2500, 2000, 1500, 1000, 500, 100, 50, 25, 10, 5, 1];

//holds array to track remaining gameboard values
let prizesRemaining = [1000000, 750000, 500000, 250000, 150000, 100000, 75000, 50000, 25000, 15000, 10000, 7500, 5000, 2500, 2000, 1500, 1000, 500, 100, 50, 25, 10, 5, 1];

//holds value of current offer
let offerValue;

//array of offers made to user
let offers = [];


//holds number of boxes user needs to choose... initially three
let chooseNumber = 5;
const toChoose = document.getElementById('to-pick');
toChoose.innerText = `Choose: ${chooseNumber}`;

//holds boolean as to whether or not user has chosen their initial box
let initial = false;

//holds boolean as to whether or not final offer has been made
let finalOffer = false;

///////
//logic to grab all prize values and randomize them into a map by box id key
const allBoxes = document.getElementById("boxes").children;
let boxMap = new Map();

for (let a of allBoxes) {
    let n = Math.floor(Math.random() * prizes.length);

    const ident = a.id;
    boxMap.set(ident, prizes[n]);

    prizes.splice(n, 1);

};

//after all prize values assigned, prizes array re-populated for reference in other parts on the logic
// prizes = [1000000, 500000, 250000, 100000, 10000, 1000, 100, 5, 1];
prizes = [1000000, 750000, 500000, 250000, 150000, 100000, 75000, 50000, 25000, 15000, 10000, 7500, 5000, 2500, 2000, 1500, 1000, 500, 100, 50, 25, 10, 5, 1];
//end randomize logic
///////

///////
//logic to take user box guesses
// let guesses = [];

//modal that holds box reveal ui
const revealModal = document.getElementById('reveal-modal');

//div that holds user's chosen box (inital box)
const userBox = document.getElementById('guess-box');

//div that hold guessed boxes
const guessBoxes = document.getElementById('guesses');

//div that holds the guessed boxes, allows user to view the value of them
const revealBox = document.getElementById('reveal-box');

//div that holds the boxes that are available for guess on the gameboard
const boxSelection = document.getElementById("boxes");
boxSelection.addEventListener('click', (e) => {

    //logic for inital box choice
    if (e.target.tagName === 'DIV' && e.target.id != 'boxes' && (initial === false)) {

        userBox.append(e.target);
        initial = true;


    } else if (e.target.tagName === 'DIV' && e.target.id != 'boxes' && (chooseNumber > 0)) {

        //logic to all box choices subsequent to the initial choice
        //logic to take user guesses and add them to the guesses array, display them on ui, update number to choose

        //appends guess to ui
        // const newDiv = document.createElement('div');
        // newDiv.innerText = e.target.innerText;
        // newDiv.classList.add('box');

        // guessBoxes.append(newDiv);
        // revealBox.append(newDiv);

        guessBoxes.append(e.target);

        //adds guess id to guesses array
        // guesses.push(e.target.id);

        //updates choose number
        chooseNumber -= 1;
        toChoose.innerText = `Choose: ${(chooseNumber)}`

        //if choosenumber === 0, populate revealbox and show modal with revealBox
        //---find value by id clicked within guessBoxes
        if (chooseNumber === 0) {

            const n = guessBoxes.children.length;

            //populate revealbox
            for (let i = 0; i < n; i++) {
                revealBox.append(guessBoxes.children[0]);
            };

            //show modal and revealbox
            revealModal.classList.remove('inactive')
            revealBox.classList.remove('inactive');

        };

    };

})

///////

const trackingDisplay = document.getElementById('tracking');
const trackingValues = document.getElementById('tracking').children;

const offerDisplay = document.getElementById('offer');

const offerModal = document.getElementById('offer-modal');
const offerChoice = document.getElementById('offer-choice');

///////
//logic for revealing values in revealBox and for showing offer and next round info
revealBox.addEventListener('click', (e) => {

    //boolean that tracks the status of boxes in revealbox
    let allRevealed = true;

    //logic to listen for user click on box div in revealbox and to display the corresponding value
    if (e.target.classList.contains('box')) {

        console.log(e.target.id);
        e.target.innerText = `$${boxMap.get(e.target.id)}`;
        e.target.classList.add('revealed');

        //updates tracking list styling to show guesses values
        //using index of prize value in prizes array to determine which index of the trackingValues NodeList we need to grayout for taken value
        trackingValues[prizes.indexOf(boxMap.get(e.target.id))].classList.add('gone');

        //updates array of values remaining on the gameboard
        prizesRemaining.splice(prizesRemaining.indexOf(boxMap.get(e.target.id)), 1);

        //checks for unrevealed boxes and sets allRevealed to false if there are any
        for (let r of revealBox.children) {
            (r.tagName === 'DIV' && !r.classList.contains('revealed')) && (allRevealed = false);
            // break;
        };

        //if allRevealed is true, creates/shows offer button
        if (allRevealed) {

            const newButton = document.createElement('button');
            newButton.innerText = 'Show offer!';
            newButton.id = 'show-offer';

            revealBox.append(newButton);

        };

    } else if ((e.target.tagName === 'BUTTON') && (e.target.id = 'show-offer')) {

        //show offer logic

        //hide modal and revealbox
        revealModal.classList.add('inactive')
        revealBox.classList.add('inactive');

        //logic to make offer and show next round guesses required
        //---10 second delay??? (add css animation???)

        offerValue = 10000;

        //creates and appends offer to ui
        const newDiv = document.createElement('div');
        newDiv.innerText = `CURRENT OFFER: $${offerValue}`;
        newDiv.id = 'current-offer';
        newDiv.classList.add('offer');

        //hides game title and displays offer
        document.getElementById('title').classList.add('inactive');
        offerDisplay.append(newDiv);


        //---update chooseNumber for next round if user doesnt take offer
        //---start with 25 boxes
        //---five guesses first round, then three guesses, then once at five left, one guess per round (7 total rounds pbl)
        (allBoxes.length > 5) ? chooseNumber = 3 : chooseNumber = 1;

        //---then display user choice for take/leave offer and number need to guess next round (offer-modal)
        const roundDiv = document.createElement('div');
        roundDiv.id = 'round-info';

        //once we get down to 2 boxes remaining, final offer made
        if (allBoxes.length > 1) {
            (allBoxes.length > 5) ? (roundDiv.innerText = `Next round: ${chooseNumber} choices.`) : (roundDiv.innerText = `Next round: ${chooseNumber} choice.`);
        } else {
            roundDiv.innerText = `THIS IS THE FINAL OFFER! ACCEPT OR TAKE YOUR BOX!`
        };

        offerChoice.querySelector('h2').insertAdjacentElement('afterend', roundDiv);

        offerChoice.classList.remove('inactive');
        offerModal.classList.remove('inactive');

    };

});


///////



///////
//logic to calulate offer value for display on the ui (based on values left)
//---several different calculation methods (randomized for variability???)
//-------could randomize by putting calculation logic in an array, choosing random index of array for use in calculation
//takes prizesRemaining array as arg
function calculateOffer(a) {

    const offerCalc = [(arr) => {

        //low value offer
        //median * 1.25

    },
    (arr) => {

        //medium value offer
        //avg minus median

    },
    (arr) => {

        //high value offer
        //avg + avg*0.2

    },
    (arr) => {

        //wildcard medium to high value offer
        //random value between index 2 and 5 (when a.length >=6)

    },
    ];

    //choose random index of offerCalc and pass-in a, giving us a random-value for each offer

    //return the offer value

};


///////

///////
//logic to restart/build game
//need to add playagin logic (display high score on ui as well... in offer box)
function buildGame() {

    //reset board (need to add js logic to clear any current boxes and build initial gameboard and tracking blocks)
    //reset tracking blocks (remove styling class)
    const boxIds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'];

    //clearing any boxes and tracking blocks on the board
    let n = trackingValues.length;

    for (let c = (n - 1); c >= 0; c--) {

        (allBoxes[c]) && (allBoxes[c].remove());
        (trackingValues[c]) && (trackingValues[c].remove());

    };

    //creating the boxes and tracking blocks
    for (let i = 0; i < boxIds.length; i++) {

        //creating boxes
        const boxDiv = document.createElement('div');
        boxDiv.innerText = `${i + 1}`;
        boxDiv.id = boxIds[i];
        boxDiv.classList.add('box');
        boxSelection.append(boxDiv);

        //creating tracking blocks
        const trackDiv = document.createElement('div');
        trackDiv.innerText = `${prizes[i]}`;
        trackingDisplay.append(trackDiv);

    };


    //reset chooseNumber and "to-pick" display
    chooseNumber = 5;
    toChoose.innerText = `Choose: ${chooseNumber}`;

    //reshuffle values
    boxMap = new Map();

    for (let a of allBoxes) {
        let n = Math.floor(Math.random() * prizes.length);

        const ident = a.id;
        boxMap.set(ident, prizes[n]);

        prizes.splice(n, 1);

    };
    //after all prize values assigned, prizes array re-populated for reference in other parts on the logic
    // prizes = [1000000, 500000, 250000, 100000, 10000, 1000, 100, 5, 1];
    prizes = [1000000, 750000, 500000, 250000, 150000, 100000, 75000, 50000, 25000, 15000, 10000, 7500, 5000, 2500, 2000, 1500, 1000, 500, 100, 50, 25, 10, 5, 1];

    //reset offer array and finaloffer boolean and initial boolean
    offers = [];
    finalOffer = false;
    initial = false;

    //hide gameover modals if displayed
    (gameoverDisplay.classList.contains('inactive')) || (gameoverDisplay.classList.add('inactive'));
    (gameoverModal.classList.contains('inactive')) || (gameoverModal.classList.add('inactive'));

    //clear contents of all modals
    let x = revealBox.children.length;
    for (let y = (x - 1); y >= 0; y--) {
        (revealBox.children[y].tagName === 'DIV' || revealBox.children[y].tagName === 'BUTTON') && (revealBox.children[y].remove());
    };

    //logic to remove round info from the offer modal
    (document.getElementById('round-info')) && (document.getElementById('round-info').remove());

    let gx = gameoverDisplay.children.length;
    for (let gy = (gx - 1); gy >= 0; gy--) {
        gameoverDisplay.children[gy].remove();
    };

    //bug here...
    //bc adding event listener within another event listener, need to remove the nested event listener to prevent it from adding each time game loads
    // gameoverDisplay.removeEventListener('div', 'click');

    //remove contents of offer and display game name
    (document.getElementById('current-offer')) && (document.getElementById('current-offer').remove());
    (document.getElementById('title').classList.contains('inactive')) && (document.getElementById('title').classList.remove('inactive'));

    //remove contents of userbox if any
    (userBox.children[0]) && (userBox.children[0].remove());

};



///////



///////

const gameoverModal = document.getElementById('gameover-modal');
const gameoverDisplay = document.getElementById('gameover');

//logic to wait for click on box to display box value, then calculate the score (offer value - box value) and add play again button
gameoverDisplay.addEventListener('click', (e) => {

    if (e.target.classList.contains('box')) {

        //show box value
        console.log(e.target.id);
        e.target.innerText = `$${boxMap.get(e.target.id)}`;
        e.target.classList.add('revealed');

        //calculate score (if offer taken... offer - box value) (if box taken... box value - offer) and add to the modal
        let score;
        finalOffer ? (score = (boxMap.get(e.target.id)) - (offerValue)) : (score = (offerValue) - (boxMap.get(e.target.id)));

        const scoreDiv = document.createElement('div');
        scoreDiv.innerText = `FINAL SCORE: $${score}`;
        scoreDiv.id = 'score-div';
        gameoverDisplay.append(scoreDiv);

        //display play again button
        const newButton = document.createElement('button');
        newButton.innerText = 'Play again!';
        newButton.id = 'play-again';
        gameoverDisplay.append(newButton);

    } else if ((e.target.tagName === 'BUTTON') && (e.target.id = 'play-again')) {

        buildGame();

    }
})

//logic for accept and decline offer
offerChoice.addEventListener('click', (e) => {

    if (e.target.id === "decline" && !finalOffer) {

        //logic for decline offer and not final offer (go to next round)

        //backwards interation to clear all divs and the button from revealbox
        const n = revealBox.children.length;
        for (let r = (n - 1); r >= 0; r--) {
            (revealBox.children[r].tagName === 'DIV' || revealBox.children[r].tagName === 'BUTTON') && (revealBox.children[r].remove());
            // break;
        };

        //logic to clear the offer from the ui
        document.getElementById('current-offer').remove();
        document.getElementById('title').classList.remove('inactive');

        //logic to remove round info from the offer modal
        document.getElementById('round-info').remove();

        //logic to update chooseNumber in the ui
        toChoose.innerText = `Choose: ${chooseNumber}`;

        offerChoice.classList.add('inactive');
        offerModal.classList.add('inactive');

        //final offer logic
        (allBoxes.length === 2) && (finalOffer = true);


    } else if ((e.target.id === "decline" && finalOffer) || (e.target.id === "accept")) {

        //gameover logic

        const divTitle = document.createElement('h2');
        (e.target.id === "decline" && finalOffer) ? (divTitle.innerText = `Taking the box!`) : (divTitle.innerText = `Offer accepted!`);
        gameoverDisplay.append(divTitle);

        const inst = document.createElement('div');
        inst.innerText = `Click box to view its value!`;
        gameoverDisplay.append(inst);

        //appending user-box to modal
        gameoverDisplay.append(userBox.children[0]);

        offerChoice.classList.add('inactive');
        offerModal.classList.add('inactive');

        //logic for accept offer

        //logic to wait for click on box to display box value, then calculate the score (offer value - box value) and add play again button
        // gameoverDisplay.addEventListener('click', (e) => {

        //     if (e.target.classList.contains('box')) {

        //         //show box value
        //         console.log(e.target.id);
        //         e.target.innerText = `$${boxMap.get(e.target.id)}`;
        //         e.target.classList.add('revealed');

        //         //calculate score (if offer taken... offer - box value) (if box taken... box value - offer) and add to the modal
        //         let score;
        //         finalOffer ? (score = (boxMap.get(e.target.id)) - (offerValue)) : (score = (offerValue) - (boxMap.get(e.target.id)));

        //         const scoreDiv = document.createElement('div');
        //         scoreDiv.innerText = `FINAL SCORE: $${score}`;
        //         scoreDiv.id = 'score-div';
        //         gameoverDisplay.append(scoreDiv);

        //         //display play again button
        //         const newButton = document.createElement('button');
        //         newButton.innerText = 'Play again!';
        //         newButton.id = 'play-again';
        //         gameoverDisplay.append(newButton);

        //     } else if ((e.target.tagName === 'BUTTON') && (e.target.id = 'play-again')) {

        //         buildGame();

        //     }
        // })

        gameoverDisplay.classList.remove('inactive');
        gameoverModal.classList.remove('inactive');


    };

});

//added logic to check for two boxes remaining... final offer at two boxes left.
//if user declines that offer, they automatically open their box and take its value
//(score then is box value - highest offer)

//also need to add array of offer values



///////


