// app state
let players = {};
let golfCourse;
// Stuff about Player Data
function guidGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return 'a' + (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
function getEmptyGolfScores() {
  return new Array(18).fill(0);
}

class Player {
  constructor(name, id = getNextId(), scores = getEmptyGolfScores()) {
    this.name = name;
    this.id = id;
    this.scores = scores;
  }
}

function createNewPlayer(name) {
  const newPlayerId = guidGenerator();
  const newPlayer = new Player(name, newPlayerId);

  players[newPlayerId] = newPlayer;
}

// Fetching Stuff from the Internet/REST API
function getAvailableGolfCourses() {
  return fetch(
    "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json",
  ).then(function (response) {
    return response.json();
  });
}

function getGolfCourseDetails(golfCourseId) {
  return fetch(
    `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`
  ).then(function (response) {
    return response.json();
  });
}

// Render Golf Card

async function renderGolfScoreCards(golfCourseId) {
  // render the first table
  const golfCourseData = await getGolfCourseDetails(golfCourseId);
  // render the second table
  renderTable(1, golfCourseData);
  renderTable(2, golfCourseData);
}

function renderTable(whichTable, golfCourseData) {
  const tBody = document.querySelector(`#tableData${whichTable}Body`);
  tBody.innerHTML = '';
  tBody.innerHTML += getTopPieceHtml();
  tBody.innerHTML += getPlayersHtml();

  function getTopPieceHtml() {
    function getDataRow(title, key) {
      let html  = ''
      let total = 0;

      html += '<tr>';
      html += `<th>${title}</th>`

      for(let i  = 0;  i < 9; i++) {
        const holesIndex = whichTable === 1 ? i : i + 9;
        const cellValue = golfCourseData.holes[holesIndex].teeBoxes[0]?.[key];
        
        total += cellValue;
        
        html += `<th>${cellValue}</th>`
        
      }

      html += `<th>${total}</th>`
      html += '</tr>';

      return html;
    }

    function getHolesRow() {
      let html  = ''
      let lastCell = whichTable === 1 ? 'Out' : 'In';
      
      html += '<tr>';
      html += `<th>Holes</th>`

      for(let i  = 0; i < 9; i++) {
        const displayHole = whichTable === 1 ? `0${i + 1}`: i + 10 ;
        html += `<th>${displayHole}</th>`;
      }
      

      html += `<th>${lastCell}</th>`
      html += '</tr>';

      return html;
    }


    let innerHTML = '';
    innerHTML += getHolesRow();
    innerHTML += getDataRow('Yardage', 'yards');
    innerHTML += getDataRow('Par', 'par');
    innerHTML += getDataRow('Handicap', 'hcp');

    return innerHTML;
  }

  function getPlayersHtml() {
    let innerHTML = ''

    for (let player of Object.values(players)) {
      const scoresToDisplay = whichTable === 1 ? player.scores.slice(0, 9) : player.scores.slice(9)
      const outOrInScore = scoresToDisplay.reduce((total, scoreItem) => total + scoreItem, 0);
  
      innerHTML += '<tr>';
  
      innerHTML += `<th>${player.name}</th>`
  
      scoresToDisplay.forEach(scoreItem => {
        innerHTML += `<th>${scoreItem}</th>`;
      })
  
  
      innerHTML += `<th>${outOrInScore}</th>`
      innerHTML += '</tr>'
    }

    return innerHTML;
  }
  
}

async function renderDropDown() {

  async function renderHtml() {
    const courses = await getAvailableGolfCourses();
    const dropdownElement = document.querySelector('#course-select');
  
    let innerHTML = '';
  
    courses.forEach(({id, name}) => {
      innerHTML += `<option value=${id}>${name}</option>`
    })
  
    dropdownElement.innerHTML = innerHTML;
  }

  function bindEventListenerToDropdown() {
    const dropdownElement = document.querySelector('#course-select');
  
    document.querySelector('#course-select');
    const headerElement = document.querySelector('#selectedCourse')

    dropdownElement.onchange = function(event) {
      const selectedCourseId = event.target.value;
      const selectedCourseName = event.target.options[event.target.selectedIndex].text;

      headerElement.innerText = `Selected Course: ${selectedCourseName}`;

      renderGolfScoreCards(selectedCourseId);
    };
  }

  await renderHtml();
  bindEventListenerToDropdown();

}

document.getElementById('buttonPlayer').addEventListener('click', function() {
  const name = document.getElementById('inputPlayer').value;
  createNewPlayer(name);
})

// Start the App
function initializeApp() {
  renderDropDown();
}

initializeApp();




  
  