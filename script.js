function timeStampToDate(timestamp) {
    // Convert timestamp to milliseconds
    let timestampMilliseconds = timestamp * 1000;
  
    // Create a new Date object
    let date = new Date(timestampMilliseconds);
  
    // Adjust for UTC+5.5 (India Standard Time)
    let utcPlus5_5Date = new Date(date.getTime() + (5.5 * 60 + date.getTimezoneOffset()) * 60 * 1000);
  
    // Format the date as "date/Feb/year"
    let optionsDate = { day: "numeric", month: "short", year: "numeric" };
    let formattedDate = utcPlus5_5Date.toLocaleDateString("en-US", optionsDate);
  
    // Format the time in 12-hour clock
    let hours = utcPlus5_5Date.getHours();
    let minutes = utcPlus5_5Date.getMinutes();
  
    // Format the time in 12-hour clock
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12
    let formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;
  
    return [formattedDate, formattedTime];
  }

  function timeLeft(relativeTimeSeconds) {
    // Convert seconds to milliseconds
    let relativeTimeMilliseconds = Math.abs(relativeTimeSeconds) * 1000;
  
    // Calculate days, hours, minutes, and seconds
    let days = Math.floor(relativeTimeMilliseconds / (24 * 60 * 60 * 1000));
    let hours = Math.floor(
      (relativeTimeMilliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
    );
    let minutes = Math.floor(
      (relativeTimeMilliseconds % (60 * 60 * 1000)) / (60 * 1000)
    );
    let seconds = Math.floor((relativeTimeMilliseconds % (60 * 1000)) / 1000);
  
    if (relativeTimeSeconds >= 0) {
      if (days < 2) {
        return `${days * 24 + hours} hours, ${minutes} minutes, ${seconds} seconds ago`;
      } else {
        return `${days} days ago`;
      }
    } else {
      if (days < 2) {
        return `${days * 24 + hours} hours, ${minutes} minutes, ${seconds} seconds left`;
      } else {
        return `${days} days left`;
      }
    }
  }
  

function secToHour(durationInSeconds) {
    let hours = Math.floor(durationInSeconds / 3600);
    let minutes = Math.floor((durationInSeconds % 3600) / 60);
  
    // Format the result
    let formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    return formattedTime;
  }
  

let url = "https://codeforces.com/api/contest.list";

let getContestDetails = async () => {
  let response = await fetch(url);
  let data = await response.json();
  // console.log(data.result);
  makeCards(data.result);
};

let makeCards = (contests) => {
  let ihtml = "";
  for (let item of contests) {
    // console.log(item);
    let schedule = timeStampToDate(item.startTimeSeconds);
    let date = schedule[0];
    let time = schedule[1];
    let timeDiff = timeLeft(item.relativeTimeSeconds);
    let length=secToHour(item.durationSeconds);
    
    ihtml += `
            <div class="card m-4 " style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">${item.name}</h5>
                  <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item"><span><b>Start :</b> ${date} ${time}</span></li>
                  <li class="list-group-item"><span><b>${item.phase}</b>: ${timeDiff}</span></li>
                  <li class="list-group-item"><span><b>Type: </b>${item.type}</span></li>
                  <li class="list-group-item"><span><b>Length : </b>${length}</span></li>
                </ul>
                <!-- <div class="card-body">
                  <a href="#" class="card-link">Card link</a>
                  <a href="#" class="card-link">Another link</a>
                </div> -->
              </div>`;
  }
  cardContainer.innerHTML=ihtml;
};

setInterval(()=>{
    getContestDetails();
}, 2000);
