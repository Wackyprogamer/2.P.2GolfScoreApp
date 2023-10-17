// function created to get data from a remote source and display
//it on the app -- function below gets all the courses ' name, id
// url.


//function getAvailableGolfCourses() {
    //return fetch(
      //"https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json",
    //{ mode: "no-cors" }
    //).then(function (response) {
      //return response.json();
    //});
  //}

//then using this function to grab golf course's details

//function getGolfCourseDetails(golfCourseId) {
    //return fetch(
     // `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`,
      //{ mode: "no-cors" }
    //).then(function (response) {
      //return response.json();
    //});
 // }

  // golf course select box so the user can choose what golf course
  //to play on. Is created via javaScript by looping over the golf
  //courses and creating an html string with the <option>s.

 // let courseOptionsHtml = '';

 // courses.forEach((course) => {
   // courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
  //});

  //document.getElementById('Course-select').innerHTML = courseOptionsHtml;



  //This function to grab user input to add player and input it to the
  //score card -- up to 4 players

  document.getElementById("buttonPlayer").addEventListener('click', playerAdd);

  function playerAdd () {
    

    let player = document.getElementById('inputPlayer').value; // Grab Player Name Input

    let newTR = document.createElement('tr'); // create table row element

    newTR.id = player; // set tablerow ID to equal player name

    let newTH = document.createElement('th'); // create header cell

    newTH.id = "player-" + player ; //set id of header cell to player-name

    newTH.textContent = player; // set text content of table header cell to input

    document.getElementById('tableData1Body').appendChild(newTR).appendChild(newTH); // append new tr with child of th to tablebody on document

    document.getElementById('tableData2Body').appendChild(newTR).appendChild(newTH); // same thing just second tableBody
    
    //before I added the second one -- will append to the first table -- now only appends to second table
  }

  