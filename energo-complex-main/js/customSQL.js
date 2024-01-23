
let tableWrapper = document.querySelector(".table");
const urlParams = new URLSearchParams(window.location.search);
let tableObj;
let form = document.querySelector(".inputForm");
const formCont = document.querySelector(".inputPopup");
let lastTable ;
let query;

let formLabel;
async function generateTable(obj , reversedlabel="",isReversed = true){
    const forLoop = async _ => {
        for( [index,columns] of obj.columns.entries()){
            const label = columns;
            if(label.name == reversedlabel){
                tableWrapper.innerHTML+=`<div class="table__label ${isReversed ? "reversed":"unreversed"}">${label.name}</div>`;
            }
            else{
                tableWrapper.innerHTML+=`<div class="table__label">${label.name}</div>`;
            }
            if(index==0){
                continue;
            }
            }
            
    }
    await forLoop();
    tableWrapper.style.cssText=`grid-template-columns:1fr ${"4fr ".repeat(obj.columns.length-1)}`;
    obj.content.forEach((row,rowIndex)=>{
        row.forEach((item,index)=>{
            text = (obj.columns[index].type=="date") ? new Date(item).toLocaleDateString() : item;
            tableWrapper.innerHTML+=`<div class="table__item${(rowIndex%2!=0)?" even":""}">${text}</div>`;
            
            
        });
        formLabel = document.querySelector(".inputPopup__label")
    });
    //close button
    const closeBtn = document.querySelector(".inputForm__close");
    form.addEventListener("click",(e)=>{
        if(e.target == closeBtn){
            formCont.style.display="none";
        } 
    });
    //sorting
    document.querySelectorAll(".table__label").forEach(label =>{
        label.addEventListener("click", (e)=>{
            if(e.target.classList.contains("reversed")){
                fetch(`http://localhost:8080/sql?query=${query}&session=${localStorage.getItem("sessionId")}&by=${label.innerHTML}&sort=ASC`).then(response => response.json())
                .then(responeObj=>{
                    tableObj = responeObj;
                    tableWrapper.innerHTML="";
                    generateTable(tableObj,e.target.innerHTML,false);

                })
                .catch(err=>{
                    new Notify ({
                        status: 'error',
                        title: 'Помилка',
                        text: `Щось пішло не так... ${err} `,
                        effect: 'slide',
                        speed: 300,
                        customClass: '',
                        customIcon: '',
                        showIcon: true,
                        showCloseButton: true,
                        autoclose: true,
                        autotimeout: 3000,
                        gap: 20,
                        distance: 20,
                        type: 2,
                        position: 'right top'
                    })
                });
            }
            else{
                fetch(`http://localhost:8080/sql?query=${query}&session=${localStorage.getItem("sessionId")}&by=${label.innerHTML}&sort=DESC`).then(response => response.json())
                .then(responeObj=>{
                    tableObj = responeObj;
                    tableWrapper.innerHTML="";
                    generateTable(tableObj,e.target.innerHTML,true);
                })
                .catch(err=>{
                    new Notify ({
                        status: 'error',
                        title: 'Помилка',
                        text: `Щось пішло не так... ${err} `,
                        effect: 'slide',
                        speed: 300,
                        customClass: '',
                        customIcon: '',
                        showIcon: true,
                        showCloseButton: true,
                        autoclose: true,
                        autotimeout: 3000,
                        gap: 20,
                        distance: 20,
                        type: 2,
                        position: 'right top'
                    })
                });
            }
        });
    })
    
}

document.addEventListener("keydown",(e)=>{
    if(e.key == "Escape"){
        formCont.style.display="none";
    }
});
formCont.addEventListener("click",(e)=>{
    if(e.target==e.currentTarget){
        formCont.style.display="none";
    }
});

document.querySelector(".addBtn").addEventListener("click",(e)=>{
    formCont.style.display="flex";
});
