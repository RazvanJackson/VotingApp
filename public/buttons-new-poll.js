var moreOptionsBtn = document.querySelector("[name='more-options-btn']");
var deleteOptionBtn = document.getElementsByClassName("delete-option");
var optionForm = document.querySelector("form");
var firstBtn = document.querySelector("button");
var optionNumber = 3;

var input;
var button;
var newDiv;

moreOptionsBtn.addEventListener("click", addOption);
function addOption(){
    newDiv = document.createElement("div");
    newDiv.className = "form-group new-option-div";
    newDiv.setAttribute("name", "option"+optionNumber);
    optionForm.insertBefore(newDiv, firstBtn);

    input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "option"+optionNumber);
    input.setAttribute("placeholder", "New option");
    input.className = "form-control new-option";
    newDiv.appendChild(input);

    button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("name", "option"+optionNumber);
    button.innerHTML = "<i class='fa fa-trash' aria-hidden='true'></i> Delete" ;
    button.className = "btn btn-danger delete-option";
    newDiv.appendChild(button);
    optionNumber++;
    
    button.addEventListener("click", updateOption);

}

function updateOption(){
    optionNumber--;
    var query = "[name='option"+optionNumber+"']";
    var targetChild = document.querySelector(query);
    targetChild.parentNode.removeChild(targetChild);
}