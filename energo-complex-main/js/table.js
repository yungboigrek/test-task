
let tableWrapper = document.querySelector(".table");
const urlParams = new URLSearchParams(window.location.search);
let tableObj;
let form = document.querySelector(".inputForm");
const formCont = document.querySelector(".inputPopup");
let lastTable ;
//delete form
const deleteForm = document.querySelector(".confirmPopup");
const closeDeleteForm = document.querySelector(".cancel");
const confirmDeleteForm = document.querySelector(".confirm");
document.querySelector(".tables__name").innerHTML = urlParams.get("table");
document.querySelector('title').innerHTML = urlParams.get("table");
let formLabel;
if(urlParams.get("table")){
    fetch(`http://localhost:8080/table?table=${urlParams.get("table")}&session=${localStorage.getItem("sessionId")}`).then(response => response.json())
    .then(responeObj=>{
        tableObj = responeObj;
        lastTable = `http://localhost:8080/table?table=${urlParams.get("table")}&session=${localStorage.getItem("sessionId")}`;
        generateTable(tableObj,true,"ID",false);
        
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
async function generateTable(obj , genForm=true , reversedlabel="",isReversed = true){
    
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
            if(genForm){
                columnType = label.type;
                inputType = "text";
                if (columnType.includes('int')) {
                    switch(label.name){
                        case "Тип":
                            await fetch(`http://localhost:8080/dropdown?table=Типи підприємств&for=${label.name}&session=${localStorage.getItem("sessionId")}`)
                            .then(response => response.json())
                            .then(responseObj => {
                                form.innerHTML+=`<label for="${label.name}">${label.name}</label>${responseObj.html}`;
                                inputType="NO";
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
                        break;
                        case "Підприємство":
                            await fetch(`http://localhost:8080/dropdown?table=Енергетичні підприємства&for=${label.name}&session=${localStorage.getItem("sessionId")}`)
                            .then(response => response.json())
                            .then(responseObj => {
                                form.innerHTML+=`<label for="${label.name}">${label.name}</label>${responseObj.html}`;
                                inputType="NO";
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
                        break;
                        case "Енергоресурс":
                            await fetch(`http://localhost:8080/dropdown?table=Енергоресурси&for=${label.name}&session=${localStorage.getItem("sessionId")}`)
                            .then(response => response.json())
                            .then(responseObj => {
                                form.innerHTML+=`<label for="${label.name}">${label.name}</label>${responseObj.html}`;
                                inputType="NO";
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
                        break;
                        case "Постачальник":
                            await fetch(`http://localhost:8080/dropdown?table=Постачальники Обладнання&for=${label.name}&session=${localStorage.getItem("sessionId")}`)
                            .then(response => response.json())
                            .then(responseObj => {
                                form.innerHTML+=`<label for="${label.name}">${label.name}</label>${responseObj.html}`;
                                inputType="NO";
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
                        break;
                        default:
                            inputType = 'number';
                        break;
                    }
                } else if (columnType.includes('float') || columnType.includes('double') || columnType.includes('decimal')) {
                    inputType = 'number';
                    inputType += ' step="any"';
                } else if (columnType.includes('date')) {
                    inputType = 'date';
                } else if (columnType.includes('time')) {
                    inputType = 'time';
                }
                if(inputType != "NO"){
                    form.innerHTML+=`<label for="${label.name}">${label.name}</label>
                    <input type="${inputType}" name="${label.name}" id="${label.name}">`;
                }
                if(index == obj.columns.length-1){
                    form.innerHTML+=`<input type="submit" value="Підтвердити">`;
                }
            }
            }
            
    }
    await forLoop();
    tableWrapper.style.cssText=`grid-template-columns:1fr ${"4fr ".repeat(obj.columns.length-1)}`;
    obj.content.forEach((row,rowIndex)=>{
        row.forEach((item,index)=>{
            text = (obj.columns[index].type=="date") ? new Date(item).toLocaleDateString() : item;
            if(index == row.length-1){
                tableWrapper.innerHTML+=`<div class="table__item${(rowIndex%2!=0)?" even":""}">${text}
                <div class="actions">
                    <div data-id="${row[0]}" class="edit"></div>
                    <div data-id="${row[0]}" class="delete"></div>
                </div></div>`;
            }
            else{
                tableWrapper.innerHTML+=`<div class="table__item${(rowIndex%2!=0)?" even":""}">${text}</div>`;
            }
            
            
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
    //edit button
    const editButtons = document.querySelectorAll(".edit");
    editButtons.forEach(button =>{
        button.addEventListener("click", e =>{
            formCont.style.display="flex";
            form.setAttribute("data-action","edit");
            form.setAttribute("data-edit",e.currentTarget.getAttribute("data-id"));
            formLabel.innerHTML = "Редагувати запис";
            tableObj.columns.forEach((column,index) =>{
                if(index==0){
                    return;
                }
                const input = document.querySelector(`[name= ${column.name}]`);
                const columnType=column.type;
                let searchN=obj.content.findIndex( element => element[0]== Number(form.getAttribute("data-edit")));
                if(columnType.includes('int')){
                    console.log(input.tagName);
                    switch(input.tagName){
                        case "INPUT":
                            input.value = tableObj.content[searchN][index];
                        break;
                        case "SELECT":
                            input.value = input.querySelector(`[data-for='${tableObj.content[searchN][index]}']`).value;
                        break;
                    }
                } else if (columnType.includes('float') || columnType.includes('double') || columnType.includes('decimal')) {
                    input.value = tableObj.content[searchN][index];
                } else if (columnType.includes('date')) {
                    const parts = new Date(tableObj.content[searchN][index]).toLocaleDateString().replace(/\./g, '-').split('-');
                    input.value = `${parts[2]}-${parts[1]}-${parts[0]}`;
                } else if (columnType.includes('time')) {
                    input.value = tableObj.content[searchN][index];
                } else if (columnType.includes('text')) {
                    input.value = tableObj.content[searchN][index];
                }
                
            })
        });
    });
    //delete button
    const deleteButtons =document.querySelectorAll(".delete");
    deleteButtons.forEach(button =>{
        button.addEventListener("click", async (e) =>{
            deleteForm.setAttribute("data-delete",Number(e.target.getAttribute("data-id")));
            deleteForm.style.display="flex";
        });
    });
    //sorting
    document.querySelectorAll(".table__label").forEach(label =>{
        label.addEventListener("click", (e)=>{
            if(e.target.classList.contains("reversed")){
                fetch(`http://localhost:8080/table?table=${urlParams.get("table")}&by=${label.innerHTML}&sort=ASC&session=${localStorage.getItem("sessionId")}`).then(response => response.json())
                .then(responeObj=>{
                    tableObj = responeObj;
                    tableWrapper.innerHTML="";
                    lastTable = `http://localhost:8080/table?table=${urlParams.get("table")}&by=${label.innerHTML}&sort=ASC&session=${localStorage.getItem("sessionId")}`;
                    generateTable(tableObj,false,e.target.innerHTML,false);

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
                fetch(`http://localhost:8080/table?table=${urlParams.get("table")}&by=${label.innerHTML}&sort=DESC&session=${localStorage.getItem("sessionId")}`).then(response => response.json())
                .then(responeObj=>{
                    tableObj = responeObj;
                    tableWrapper.innerHTML="";
                    lastTable = `http://localhost:8080/table?table=${urlParams.get("table")}&by=${label.innerHTML}&sort=DESC&session=${localStorage.getItem("sessionId")}`;
                    generateTable(tableObj,false,e.target.innerHTML,true);
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
function reloadTable(){
    fetch(lastTable).then(response => response.json())
    .then(responeObj=>{
        tableObj = responeObj;
        tableWrapper.innerHTML="";
        generateTable(tableObj,false);
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
//delete form confirmation
closeDeleteForm.addEventListener("click",(e)=>{
    deleteForm.style.display="none";
});
confirmDeleteForm.addEventListener("click",async (e)=>{
    await fetch(`http://localhost:8080/delete?table=${urlParams.get("table")}&id=${deleteForm.getAttribute("data-delete")}&session=${localStorage.getItem("sessionId")}`,{
        method: 'DELETE',
        body: ""})
    .then(response => {
        if(response.ok){
            new Notify ({
                status: 'success',
                title: 'Успішно',
                text: 'Успішно видалено запис.',
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
            
        }
        return response.json();
    })
    .then(returnObj =>{
        if(returnObj.err){
            if(returnObj.err.code == "ER_TABLEACCESS_DENIED_ERROR"){
                new Notify ({
                    status: 'error',
                    title: 'Помилка',
                    text: 'Недостатньо прав',
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
            }
            else{
                new Notify ({
                    status: 'error',
                    title: 'Помилка',
                    text: 'Щось пішло не так...',
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
            }
        }
        deleteForm.style.display="none";
        reloadTable();
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
    
    
});



form.addEventListener("submit",(e)=>{
    e.preventDefault();
   
    if(form.getAttribute("data-action") == "add"){
        let into= "(";
        let content = "("
        tableObj.columns.forEach((column,index) => {
            if(index == tableObj.columns.length-1){
                into+=`${column.name} `;
                content+=`'${document.querySelector(`[name= ${column.name}]`).value}'`;
            }
            else if(index != 0){
                into+=`${column.name}, `;
                content+=`'${document.querySelector(`[name= ${column.name}]`).value}', `;
            }
        })
        into+=")";
        content+=")";
        fetch(`http://localhost:8080/add?table=${urlParams.get("table")}&into=${into}&content=${content}&session=${localStorage.getItem("sessionId")}`,{
            method: 'POST',
            body: ""})
        .then(response => {
            if(response.ok){
                new Notify ({
                    status: 'success',
                    title: 'Успішно',
                    text: 'Успішно додано запис.',
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
                
            }
            return response.json();
        })
        .then(returnObj =>{
            if(returnObj.err){
                if(returnObj.err.code == "ER_TABLEACCESS_DENIED_ERROR"){
                    new Notify ({
                        status: 'error',
                        title: 'Помилка',
                        text: 'Недостатньо прав',
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
                }
                else{
                    new Notify ({
                        status: 'error',
                        title: 'Помилка',
                        text: 'Щось пішло не так...',
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
                }
            }
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
        formCont.style.display="none";
        reloadTable();
    }
    else if(form.getAttribute("data-action") == "edit"){
        let content = "";
        tableObj.columns.forEach((column,index) => {
            if(index == tableObj.columns.length-1){
                content+=`${column.name} = '${document.querySelector(`[name= ${column.name}]`).value}'`;
            }
            else if(index != 0){
                content+=`${column.name} = '${document.querySelector(`[name= ${column.name}]`).value}', `;
            }
        })
        fetch(`http://localhost:8080/update?table=${urlParams.get("table")}&content=${content}&id=${Number(form.getAttribute("data-edit"))}&session=${localStorage.getItem("sessionId")}`,{
            method: 'POST',
            body: ""})
        .then(response => {
            if(response.ok){
                new Notify ({
                    status: 'success',
                    title: 'Успішно',
                    text: 'Запис успішно змінено.',
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
                
            }
            return response.json();
        })
        .then(returnObj =>{
            if(returnObj.err){
                if(returnObj.err.code == "ER_TABLEACCESS_DENIED_ERROR"){
                    new Notify ({
                        status: 'error',
                        title: 'Помилка',
                        text: 'Недостатньо прав',
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
                }
                else{
                    new Notify ({
                        status: 'error',
                        title: 'Помилка',
                        text: 'Щось пішло не так...',
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
                }
            }
            formCont.style.display="none";
            reloadTable();
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
})

document.querySelector(".addBtn").addEventListener("click",(e)=>{
    formCont.style.display="flex";
    form.setAttribute("data-action","add");
    formLabel.innerHTML = "Додати запис";
    tableObj.columns.forEach((column,index) =>{
        if(index==0){
            return;
        }
        const input = document.querySelector(`[name= ${column.name}]`);
        input.value = "";
    });
});
document.addEventListener("keydown",(e)=>{
    if(e.key == "Escape"){
        formCont.style.display="none";
        deleteForm.style.display="none";
    }
});
formCont.addEventListener("click",(e)=>{
    if(e.target==e.currentTarget){
        formCont.style.display="none";
    }
});
deleteForm.addEventListener("click",(e)=>{
    if(e.target==e.currentTarget){
        deleteForm.style.display="none";
    }
});
