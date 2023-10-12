// function created to get data from a remote source and display
//it on the app -- function below gets all the courses ' name, id
// url.


function getAvailableGolfCourses() {
    return fetch(
      "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json",
    { mode: "no-cors" }
    ).then(function (response) {
      return response.json();
    });
  }

//then using this function to grab golf course's details

function getGolfCourseDetails(golfCourseId) {
    return fetch(
      `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`,
      { mode: "no-cors" }
    ).then(function (response) {
      return response.json();
    });
  }

  // golf course select box so the user can choose what golf course
  //to play on. Is created via javaScript by looping over the golf
  //courses and creating an html string with the <option>s.

  let courseOptionsHtml = '';

  courses.forEach((course) => {
    courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
  });

  document.getElementById('Course-select').innerHTML = courseOptionsHtml;