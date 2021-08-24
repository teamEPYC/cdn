// Written by Prateek (prateek@epyc.in)

function setLocalTime() {
  var items = $(".localized-time");
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var date = item.innerText;
    // console.log("date", date);
    
    var parsed = moment.parseZone(date + " +05:30", "YYYY-MM-DD H:mm a Z", true);
    // console.log("parsed", parsed);
    // August 26, 2021 at 2:00 pm
    var formatted_date = parsed.local().format("MMMM DD, YYYY");
    var formatted_time = parsed.local().format("LT");
    var formatted = formatted_date + " at " + formatted_time;
    // console.log("formatted", formatted);
    $(item).text(formatted);
  }
}

//
// 
$(document).ready(function () {
  setLocalTime();
});
