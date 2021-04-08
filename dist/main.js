"use strict"

let pagination = document.querySelectorAll('.slider__pagination-item'),
    iteration = 0,
    active;

for (let pag of pagination){
   if (pag.className.includes('slider__pagination-item_active')) {
       active = iteration;
   }
i++;
   let j = i;

    pag.onclick = function () {
        addActiveClass(this, j);
    }
}
function addActiveClass(element, j){
let index = pag.indexOf(pag)
    pagination[active].setAttribute("class", " slider__pagination-item");
active = j;
    element.setAttribute("class", "slider__pagination-item_active slider__pagination-item");



}