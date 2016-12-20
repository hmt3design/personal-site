/**
 * Created by Harry on 12/9/16.
 */
$(document).ready(function(){
    "use strict";
    //Global variables
    var simonArray = [];
    var squares = $('.square');
    var counter = 0;
    var enableClicks = false;
    var gameRound = 0;

    //Create click function for buttons
    var userTurn = function () {
      enableClicks = true;
    };

    var playAudio = function (audioClass) {
        document.getElementById(audioClass + "Audio").play();
    };

    // user turn
    $(".square").click(function(){
        var squareClicked = this;
        var associatedAudio = $(this).attr("id");

        if (enableClicks) {
            animate(squareClicked);
            playAudio(associatedAudio);

            if(squareClicked === simonArray[counter]) {
                counter += 1;
                if (counter === simonArray.length) {
                    // reset counter
                    counter = 0;
                    // success
                    generateSimonsChoice();
                    setTimeout(function () {
                        simonTurn(simonArray);
                    }, 1000);
                }
            } else {  // game over - reset all values and restart
                alert("Sorry, you entered the wrong sequence. Game over. Want to try again?");
                    simonArray = [];
                    counter = 0;
                    gameRound = 0;
                    $("#start").prop("disabled", false);
                    $("#counter").text("ROUND: " + gameRound);
            }
        }
    });

    // Generate animation for Simon's turn
    var animate = function (square) {
        $(square).addClass("active");
        setTimeout(function () {
            $(square).removeClass("active")
        }, 250);
    };

    //adds Simon's squares to array
    var generateSimonsChoice = function () {
        simonArray.push(squares[Math.floor(Math.random()*4)]);
    };

    //Start button
    $("#start").click(function () {
        generateSimonsChoice();
        simonTurn(simonArray);
        $("#start").prop("disabled", true);
    });


    //Simon's turn, which feeds into the user's turn
    //"square" passes the div id to the animate function, so the colors don't have to be specifically identified
    var simonTurn = function (simonArray) {
        var timer = 500;
        simonArray.forEach(function(square, i) {
            setTimeout(function () {
                animate(square);
            }, timer * i);
            // console.log(square);
        });
        userTurn();
        gameRound += 1;
            $('#counter').text("ROUND: " + gameRound);
            // console.log(gameRound);
    };

});