/**
 * Created by Harry on 11/16/16.
 */
"use strict";

(function () {
    var leftOperand = document.getElementById("left_Operand");
    var centerOperator = document.getElementById("center_Operator");
    var rightOperand = document.getElementById("right_Operand");
    var total = document.getElementById("answer")

    var btnPressed = function () {
        // check for clear function
        if (this.value == "C") {
            leftOperand.value = "";
            centerOperator.value = "";
            rightOperand.value = "";
            total.value = "";
            // check for equals sign press
        } else if (this.value == "=") {
            switch(centerOperator.value){
                case "+":
                    total.value = parseFloat(leftOperand.value) + parseFloat(rightOperand.value);
                    break;
                case "-":
                    total.value = parseFloat(leftOperand.value) - parseFloat(rightOperand.value);
                    break;
                case "*":
                    total.value = parseFloat(leftOperand.value) * parseFloat(rightOperand.value);
                    break;
                case "/":
                    total.value = parseFloat(leftOperand.value) / parseFloat(rightOperand.value);
                    break;
            }
        } else {
            // check to see if numbers or operators are entered
            // if numbers, go leftOperand
            // if operators, go centerOperator then rightOperand
            if (!isNaN(this.value) || (this.value) == ".")  {
                if (centerOperator.value == "") {
                    leftOperand.value += this.value;
                } else {
                    rightOperand.value += this.value;
                }
            } else {
                centerOperator.value = this.value;
            };
        }
    };

    // add event listener
    var button = document.getElementsByClassName("btn");
    for (var i = 0; i < button.length; i++) {
        button[i].addEventListener("click", btnPressed);
    }

})();