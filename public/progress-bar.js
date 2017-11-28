var progressBar = document.querySelectorAll(".progress-bar");
var totalVotes = document.querySelector('input[name="totalVotes"]').value;

progressBar.forEach(function(element){
    element.style.width = element.attributes["aria-valuenow"].value / totalVotes *100 + "%";
})