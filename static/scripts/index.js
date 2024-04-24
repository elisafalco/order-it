const dropzone = document.getElementById('js-drop-zone');
const draggables = document.querySelectorAll('.js-picture');
const prefixInput = document.querySelector('.js-prefix');
const submitButton = document.querySelector('.js-submit-button');

/************************/
/******* ON LOAD ********/
/************************/
window.addEventListener('load', () => {
  updateItemsTitle();
});


/************************/
/**** EVENT LISTENER ****/
/************************/
// On dragstart & dragend
draggables.forEach(draggable => {
  draggable.addEventListener("dragstart", function() {
    this.classList.add("dragging")
  })
  draggable.addEventListener("dragend", function() {
    this.classList.remove("dragging");
    updateItemsTitle();
  })
});

// On prefix update
prefixInput.addEventListener("input", function() {
  updateItemsTitle();
});

// On dragover
dropzone.addEventListener("dragover", function(e) {
  const draggedElement = document.querySelector(".dragging");
  const [beforeElement, afterElement] = getBeforeElement(e.clientX, e.clientY);
  if (beforeElement) {
    beforeElement.insertAdjacentElement("afterend", draggedElement);
  } else if(afterElement) {
    afterElement.insertAdjacentElement("beforebegin", draggedElement);
  }
});

// On submit
submitButton.addEventListener('click', () => {
  const pictures = document.querySelectorAll('.js-picture');
  const pictureNames = [...pictures].map((picture) => {
    return picture.getAttribute('data-file-name');
  });
  const prefix = prefixInput ? prefixInput.value : '';

  const body = {
    prefix: prefix,
    order: pictureNames,
  }

  if (pictureNames.length) {
    fetch(
      'http://localhost:3000/',
      { 
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      }
    ).then(response => {
      console.log(response);
      if (response.status === 200) {
        console.log("OK")
      }
    })
    .catch(err => console.error(err))
  }
});

/************************/
/****** FUNCTIONS *******/
/************************/
/**
 * getBeforeElement
 * @param {number} x 
 * @param {number} y 
 * @returns {Element[]}
 */
const getBeforeElement = (x, y) => {
  const notDraggedCards = [...dropzone.querySelectorAll(".js-picture:not(.dragging)")];

  let before = undefined;
  let after = undefined;

  notDraggedCards.forEach((card) => {
    const cardRect = card.getBoundingClientRect();
    const isOnSameLine = cardRect.top < y && cardRect.top + cardRect.height > y;
    const isOnRightSide = cardRect.left + (cardRect.width/2) < x && cardRect.left + cardRect.width > x;
    const isOnLeftSide = cardRect.left < x && cardRect.left + (cardRect.width/2) > x;

    // Check top
    if (isOnSameLine) {
      if (isOnRightSide) {
        before = card;
      } else if (isOnLeftSide) {
        after = card;
      }
    }
  });

  return [before, after];
}

/**
 * updateItemsTitle
 */
const updateItemsTitle = () => {
  const draggables = document.querySelectorAll('.js-picture');
  const prefix = prefixInput ? prefixInput.value : '';

  draggables.forEach((draggable, index) => {
    draggable.setAttribute('title', `${prefix}${index + 1}`);
  });
}