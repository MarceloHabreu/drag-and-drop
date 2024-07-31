// Select all columns and cards
const columns = document.querySelectorAll(".column__cards");
const cards = document.querySelectorAll(".card");

let draggedCard;

// Function to save the current state to local storage
const saveState = () => {
  const state = Array.from(columns).map(column => {
    return Array.from(column.children).map(card => card.textContent);
  });
  localStorage.setItem("boardState", JSON.stringify(state));
};

// Function to load the state from local storage
const loadState = () => {
  const state = JSON.parse(localStorage.getItem("boardState"));
  if (!state) return;
  
  state.forEach((columnCards, columnIndex) => {
    columnCards.forEach(cardText => {
      const card = document.createElement("section");
      card.className = "card";
      card.draggable = "true";
      card.textContent = cardText;
      card.addEventListener("dragstart", dragStart);
      card.addEventListener("focusout", () => {
        card.contentEditable = "false";
        if (!card.textContent) card.remove();
        saveState();
      });
      columns[columnIndex].append(card);
    });
  });
};

// Function to handle the drag start event
const dragStart = (event) => {
  draggedCard = event.target;
  event.dataTransfer.effectAllowed = "move";
};

// Function to handle the drag over event
const dragOver = (event) => {
  event.preventDefault();
};

// Function to handle the drag enter event
const dragEnter = ({target}) => {
  if (target.classList.contains("column__cards")) {
    target.classList.add("column--highlight");
  }
};

// Function to handle the drag leave event
const dragLeave = ({target}) => {
  target.classList.remove("column--highlight");
};

// Function to handle the drop event
const drop = ({target}) => {
  if (target.classList.contains("column__cards")) {
    target.classList.remove("column--highlight");
    target.append(draggedCard);
    saveState();
  }
};

// Function to create a new card
const createCard = ({target}) => {
  if (!target.classList.contains("column__cards")) return;
  const card = document.createElement("section");
  card.className = "card";
  card.draggable = "true";
  card.contentEditable = "true";
  card.addEventListener("dragstart", dragStart);
  card.addEventListener("focusout", () => {
    card.contentEditable = "false";
    if (!card.textContent) card.remove();
    saveState();
  });
  target.append(card);
  card.focus();
};

// Add dragstart event listener to all existing cards
cards.forEach((card) => {
  card.addEventListener("dragstart", dragStart);
});

// Add event listeners to all columns
columns.forEach((column) => {
  column.addEventListener("dragover", dragOver);
  column.addEventListener("dragenter", dragEnter);
  column.addEventListener("dragleave", dragLeave);
  column.addEventListener("drop", drop);
  column.addEventListener("dblclick", createCard);
});

// Load the state from local storage when the document is loaded
document.addEventListener("DOMContentLoaded", loadState);
