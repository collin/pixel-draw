const LOCAL_KEY = 'drawing-data'

function persistState () {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(state))
}

function loadState () {
  let fromLocal = localStorage.getItem(LOCAL_KEY)
  if (fromLocal) {
    return JSON.parse(fromLocal)
  }
  else {
    return {
      drawing: [[]],
      color: 'red'
    }
  }
}

let state = loadState()

function renderCanvas () {
  const stage = document.querySelector("#canvas .stage")
  let pixelHTML = ""
  for (let [rowIndex, row] of Object.entries(state.drawing)) {
    pixelHTML += `<div class="pixel-row">`
    for (let [columnIndex, cellColor] of Object.entries(row)) {
      pixelHTML += `
        <div
          class="pixel-cell"
          data-row="${rowIndex}"
          data-column="${columnIndex}"
          style="background-color: ${cellColor};"
        >
        </div>
      `
    }
    pixelHTML += `</div>`
  }
  stage.innerHTML = pixelHTML
}
renderCanvas()

function renderColorPicker () {
  const picker = document.querySelector("#color-picker")
  const lastColor = picker.querySelector(".selected")
  const currentColor = picker.querySelector(`[data-color="${state.color}"]`)

  if (lastColor) lastColor.classList.remove("selected")
  if (currentColor) currentColor.classList.add("selected")
}
renderColorPicker()

const actions = {
  pickColor (color) {
    state.color = color
    renderColorPicker()
    persistState()
  },
  paintCell (row, column) {
    state.drawing[row][column] = state.color
    renderCanvas()
    persistState()
  },
  addRow () {
    const newRow = (new Array(state.drawing[0].length)).fill('')
    state.drawing = [...state.drawing, newRow]
    renderCanvas()
    persistState()
  },
  removeRow () {
    state.drawing.pop()
    renderCanvas()
    persistState()
  },
  addColumn () {
    state.drawing.forEach(row => row.push(''))
    renderCanvas()
    persistState()
  },
  removeColumn () {
    for (let row of state.drawing) {
      row.pop()
    }
    renderCanvas()
    persistState()
  }
}

document.querySelector("#controller").addEventListener("click", event => {
  if (event.target.matches("button") && event.target.dataset.action) {
    if (actions.hasOwnProperty(event.target.dataset.action)) {
      actions[event.target.dataset.action]()
    }
  }
})

document.querySelector("#color-picker").addEventListener("click", event => {
  if (event.target.matches("button") && event.target.dataset.color) {
    actions.pickColor(event.target.dataset.color)
  }
})

document.querySelector("#canvas").addEventListener("click", event => {
  if (event.target.matches(".pixel-cell")) {
    actions.paintCell(
      event.target.dataset.row,
      event.target.dataset.column,
    )
  }
})
