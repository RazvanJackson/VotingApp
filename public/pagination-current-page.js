var currentPage = document.querySelector("[currentPage]").attributes.currentPage.value;

if(currentPage==1){
    document.querySelectorAll("[href='/poll/all?page="+currentPage+"']")[1].style.backgroundColor = "#5cb85c";
}
else{
    document.querySelectorAll("[href='/poll/all?page="+currentPage+"']")[0].style.backgroundColor = "#5cb85c";
}