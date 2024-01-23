"use strict"
import "../css/style.scss";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import "/js/Inter-Regular-normal";
//printing
function extractFieldFromArray(arr, field) {
    return arr.map(obj => obj[field]);
}
function cleanFileName(text) {
    const invalidChars = /[<>:"\/\\|?*\x00-\x1F]/g; // Недопустимі символи
    const maxLength = 255; // Максимальна довжина імені файлу
    
    // Замінюємо недопустимі символи на відповідні рядки
    const cleanText = text
        .replace(/</g, 'меньше')
        .replace(/>/g, 'більше')
        .replace(invalidChars, '');
      
  
    // Обмежуємо довжину тексту до максимально допустимої
    const truncatedText = cleanText.slice(0, maxLength);
  
    return truncatedText;
  }
const printBtn = document.querySelector(".genPDF");
if(printBtn){
    printBtn.addEventListener("click",generatePDF);
}
function generatePDF() {
    
    try {
        const doc = new jsPDF();
        doc.setFont('Inter-Regular');
        doc.text(document.querySelector(".tables__name").innerText, 14, 15);
        autoTable(doc, {
            head:[ extractFieldFromArray(tableObj.columns,"name")],
            body:tableObj.content,
            styles:{
                font: 'Inter-Regular',
            },
            startY:30,
            headStyles: {
                fillColor: [255, 122, 0],
                textColor: 'white',
            },
        });
        doc.save(`${cleanFileName(document.querySelector(".tables__name").innerText)}.pdf`);
    } catch (error) {
        new Notify ({
            status: 'error',
            title: 'Помилка',
            text: `Щось пішло не так... ${error} `,
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
