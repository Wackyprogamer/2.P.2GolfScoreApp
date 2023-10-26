// app state
let players = {};
let golfCourse;
let selectedCourseId;
let teeBoxType;
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
} // This will be Player Score

function createNewPlayer(name) {
  const newPlayerId = guidGenerator();
  const newPlayer = new Player(name, newPlayerId);

  players[newPlayerId] = newPlayer;
}// Function to create a new player

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

function getHoleIndex(whichTable, i) {
  return whichTable === 1 ? i : i + 9;
}

function getTotalScore(playerId) {
  const player = players[playerId];
  const scores = player.scores;

  const totalScore = scores.reduce((total, scoreItem) => total + scoreItem, 0);

  return totalScore;
}
function getScoresToDisplay(whichTable, playerId) {
  const player = players[playerId];
  return whichTable === 1 ? player.scores.slice(0, 9) : player.scores.slice(9);
}

function getOutOrInScore(whichTable, playerId) {
  const scoresToDisplay =getScoresToDisplay(whichTable, playerId)
  const outOrInScore = scoresToDisplay.reduce((total, scoreItem) => total + scoreItem, 0);

  return outOrInScore;
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
        const holesIndex = getHoleIndex(whichTable, i);
        const cellValue = golfCourseData.holes[holesIndex].teeBoxes[teeBoxType]?.[key];
        
        
        total += cellValue;
        
        html += `<th>${cellValue}</th>`
        
      }

      html += `<th>${total}</th>`
      html += '</tr>';

      return html;
    }

    function getHolesRow() {//get Golf Courses Hole Data from API
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


  /// Extra Added Function of mine that could replace the original playersHTML
  function getPlayersHtml(whichTable) {
    let innerHTML = ''
  
    for (let [playerId,player] of Object.entries(players)) {
      const scoresToDisplay = getScoresToDisplay(whichTable, playerId)
      const outOrInScore = getOutOrInScore(whichTable, playerId)
  
      innerHTML += '<tr>';
  
      innerHTML += `<th>${player.name}</th>`
  
      scoresToDisplay.forEach((scoreItem, i) => {
        const holeIndex = getHoleIndex(whichTable, i)
        innerHTML += `<th data-playerId="${playerId}" data-hole="${holeIndex}">
          <input value="${scoreItem}" type="number" />
        </th>`;
      })
  
      innerHTML += `<th data-playerId="${playerId}" data-total-type="${whichTable}">${outOrInScore}</th>`
  
      // Add total score cell only for the second table
      if (whichTable === 2) {
        const totalScore = getTotalScore(playerId);
        innerHTML += `<th data-playerId="${playerId}" data-total-type="total">${totalScore}</th>`
      }
  
      innerHTML += '</tr>'
    }
  
    return innerHTML;
  }

  function getPlayersHtml() {
    let innerHTML = ''

    for (let [playerId,player] of Object.entries(players)) {
      const scoresToDisplay = getScoresToDisplay(whichTable, playerId)
      const outOrInScore = getOutOrInScore(whichTable, playerId)
  
      innerHTML += '<tr>';
  
      innerHTML += `<th>${player.name}</th>`
  
      scoresToDisplay.forEach((scoreItem, i) => {
        const holeIndex = getHoleIndex(whichTable, i)
        innerHTML += `<th data-playerId="${playerId}" data-hole="${holeIndex}">
          <input value="${scoreItem}" type="number" />
        </th>`;
      })
  
  
      innerHTML += `<th data-playerId="${playerId}" data-total-type="${whichTable}">${outOrInScore}</th>`
      innerHTML += '</tr>'
    }

    return innerHTML;
  }
  bindEventListenerToTableData(whichTable);
}

// Item to get total score for player for that table
function renderPlayerTotal(whichTable, playerId) {
  const element = document.querySelector(`th[data-playerid="${playerId}"][data-total-type="${whichTable}"]`)
  const outOrInScore = getOutOrInScore(whichTable, playerId);

  element.textContent = outOrInScore;
}

// Supposed to update array of players score per hole one user edits th and inputs their own value -- will verify if it works
// Add event listener to each editable th
function bindEventListenerToTableData (whichTable) {
  for (let [playerId,player] of Object.entries(players)) {
    
    for (let i = 0; i < player.scores.length /2 ; i++) {
      const holeIndex = getHoleIndex(whichTable, i)
      const query = `#tableData${whichTable}Body th[data-playerId="${playerId}"][data-hole="${holeIndex}"] input`
      const cellElement = document.querySelector(query)

      cellElement.addEventListener('change', function(e) {
        e.preventDefault();
        //Update the corresponding score in the player's scores array
        player.scores[holeIndex] = Number(e.target.value);
        renderPlayerTotal(whichTable, playerId);
        // update the in and out scores


        //This line of code here checks if holeIndex thats selected is equal to index 17
        if (holeIndex === 17) {
          //if it is then total score equals get total score of player
          const totalScore = getTotalScore(playerId);
          if (totalScore > 0) { // checks if total score is greater than 0
            toastr.success(`Congrats ${player.name}! Your total score is ${totalScore}. You are (L)PGA Tour material`); // sends a toast message to tell the user congrats for finishing the game and tells them their score as well
          }
        }
      });
      
    }
  }
} 

function bindClickToButtonPlayer() {
  document.getElementById('buttonPlayer').addEventListener('click', function() {
    const name = document.getElementById('inputPlayer').value;
    document.getElementById('confirmation').textContent = 'Player Added! -- ' + name;
    createNewPlayer(name);
    showFirstTable();
    showTableScores();
    renderGolfScoreCards(selectedCourseId);
  })
}

function showTeeBoxSelect() {
  const element = document.querySelector('#teebox-select').parentElement;

  element.setAttribute('style', '')
}

function showPlayerCreator() {
  const element = document.querySelector('#userSection');

  element.setAttribute('style', '');
}

function showFirstTable() {
  const element = document.querySelector('#firstTable');

  element.setAttribute('style', '')
}

function showTableScores() {
  const element = document.querySelector('#secondTableScores')

  element.setAttribute('style', '');
}

function hideTeeBoxSelect() {
  const element = document.querySelector('#teebox-select').parentElement;

  element.setAttribute('style', 'display:none')
}

function hidePlayerCreator() {
  const element = document.querySelector('#userSection');

  element.setAttribute('style', 'display:none')
}

function hideFirstTable() {
  const element = document.querySelector('#firstTable');

  element.setAttribute('style', 'display:none')
}

function hideTableScores() {
  const element = document.querySelector('#secondTableScores')

  element.setAttribute('style', 'display: none');
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

  function bindEventListenerToCourseSelector() {
    const dropdownElement = document.querySelector('#course-select');
  
    document.querySelector('#course-select');
    const headerElement = document.querySelector('#selectedCourse')

    dropdownElement.onchange = function(event) {

      const selectedCourseName = event.target.options[event.target.selectedIndex].text;
      selectedCourseId = event.target.value;


      headerElement.innerText = `Selected Course: ${selectedCourseName}`;

      players = {};
      hidePlayerCreator();
      hideFirstTable();
      hideTableScores();
      showTeeBoxSelect();

    };
  }

  function bindEventListenerToTeeboxSelector() {
    const teeboxSelector = document.querySelector('#teebox-select');

    teeboxSelector.onchange = function(e) {

      players = {};
      teeBoxType = e.target.value;
      hideFirstTable();
      hideTableScores();
      showPlayerCreator();
    }
  }

  await renderHtml();
  bindEventListenerToCourseSelector();
  bindEventListenerToTeeboxSelector();
  bindClickToButtonPlayer();

}

// Start the App
function initializeApp() {
  renderDropDown();
}

initializeApp();  
