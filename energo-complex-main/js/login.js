const loginText = document.querySelector(".header__login span");
const loginBtn = document.querySelector(".header__login-btn");
const loginBtnImage = document.querySelector(".header__login-btn img");
if(localStorage.getItem("sessionId")){
    loginText.innerHTML = localStorage.getItem("login");
    loginBtnImage.style.transform="scaleX(-100%)";
}
loginBtn.addEventListener("click",(e)=>{
    if(localStorage.getItem("sessionId")){
        localStorage.removeItem("sessionId");
        localStorage.removeItem("login");
        location.reload();
    }
    else{
        window.open("/login.html","_self");
    }
});
const fadeInAnim = document.querySelector(".loadAnim");
if(fadeInAnim){
    fadeInAnim.addEventListener("animationend",(e)=>{
        fadeInAnim.style.display = "none";
    });
}