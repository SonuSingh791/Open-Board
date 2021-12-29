let optionsContainer = document.querySelector(".options-container");
let toolBoxContainer = document.querySelector(".toolbox-container");
let pencilToolContainer = document.querySelector(".pencil-tool-container");
let eraserToolContainer = document.querySelector(".eraser-tool-container");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let upload = document.querySelector(".import");
let body = document.querySelector("body");
let stickyNotes = document.querySelector(".notes");
optionsContainer.addEventListener("click", (e) => {
    if(optionsContainer.innerText === "menu"){
        optionsContainer.innerText = "close";
        toolBoxContainer.style.display = "flex";
    }
    else{
        optionsContainer.innerText = "menu"
        toolBoxContainer.style.display = "none";
        pencilToolContainer.style.display = "none";
        eraserToolContainer.style.display = "none";
        pencil.classList.remove("active");
        eraser.classList.remove("active");
    }
    console.log(optionsContainer.innerText)
});

pencil.addEventListener("click", (e) => {
    if(pencil.classList.contains("active")){
        pencilToolContainer.style.display = "none";
        pencil.classList.remove("active");
    }
    else{
        pencilToolContainer.style.display = "block";
        pencil.classList.add("active");
        
    }
    if(eraser.classList.contains("active")){
        eraserToolContainer.style.display = "none";
        eraser.classList.remove("active");
    }
})
eraser.addEventListener("click", (e) => {
    if(eraser.classList.contains("active")){
        eraserToolContainer.style.display = "none";
        eraser.classList.remove("active");
    }
    else{
        eraserToolContainer.style.display = "flex";
        eraser.classList.add("active");
        
    }
    if(pencil.classList.contains("active")){
        pencilToolContainer.style.display = "none";
        pencil.classList.remove("active");
    }
})

upload.addEventListener("click", (e) => {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();
    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url =  URL.createObjectURL(file);
        stickyTemplateHTML = `
        <div class="header-container">
            <div class="remove"><span class="material-icons">close</span></div>
            <div class="minimize"><span class="material-icons">minimize</span></div>
            <div class="maximize"><span class="material-icons">open_in_full</span></div>
        </div>
        <div class="sticky-notes">
            <img src = "${url}" />
        </div>
        `;
        createSticky(stickyTemplateHTML);
    })
})

stickyNotes.addEventListener("click", (e) => {
    stickyTemplateHTML = `
    <div class="header-container">
        <div class="remove"><span class = "material-icons">close</span></div>
        <div class="minimize"><span class = "material-icons">minimize</span></div>
        <div class="maximize"><span class = "material-icons">open_in_full</span></div>
    </div>
    <div class="sticky-notes">
        <textarea spellcheck="false"></textarea>
    </div>
    `
    createSticky(stickyTemplateHTML);
})

function createSticky(stickyTemplateHTML){
    let stickyNotesContainerEle = document.createElement("div");
    stickyNotesContainerEle.setAttribute("class", "sticky-notes-container");
    stickyNotesContainerEle.innerHTML = stickyTemplateHTML;
    body.appendChild(stickyNotesContainerEle);
    let remove = stickyNotesContainerEle.querySelector(".remove");
    let minimize = stickyNotesContainerEle.querySelector(".minimize");
    let maximize = stickyNotesContainerEle.querySelector(".maximize");
    noteActions(stickyNotesContainerEle, remove, minimize, maximize);
    stickyNotesContainerEle.addEventListener("mousedown", (event) => {
        dragAndDrop(stickyNotesContainerEle,event)
    })
}

function dragAndDrop(stickyNotesContainerEle, event){

        let shiftX = event.clientX - stickyNotesContainerEle.getBoundingClientRect().left;
        let shiftY = event.clientY - stickyNotesContainerEle.getBoundingClientRect().top;
      
        stickyNotesContainerEle.style.position = 'absolute';
        stickyNotesContainerEle.style.zIndex = 1000;
        // document.body.append(stickyNotesContainerEle);
      
        moveAt(event.pageX, event.pageY);
      
        // moves the stickyNotesContainerEle at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
          stickyNotesContainerEle.style.left = pageX - shiftX + 'px';
          stickyNotesContainerEle.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // move the stickyNotesContainerEle on mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // drop the stickyNotesContainerEle, remove unneeded handlers
        stickyNotesContainerEle.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          stickyNotesContainerEle.onmouseup = null;
        };
      
      
      stickyNotesContainerEle.ondragstart = function() {
        return false;
      };
}

function noteActions(note, remove, minimize, maximize){
    remove.addEventListener("click", (e) => {
        note.remove();
    })
    let noteContainer = note.querySelector(".sticky-notes");
    minimize.addEventListener("click", (e) => {
        let display = getComputedStyle(noteContainer).getPropertyValue("display");
        if(display === "block") noteContainer.style.display = "none";
    })
    maximize.addEventListener("click", (e) => {
        let display = getComputedStyle(noteContainer).getPropertyValue("display");
        if(display === "none") noteContainer.style.display = "block";
    })
}