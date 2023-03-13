// start at load.
get_books();
setInterval(() => { // update every second because lol.
  get_books();
},1000)


const days = ["mo","di","mi","do","fr","sa","do"]
var books = {}


function get_books(){
  $.get("/book", function(response) {
      books = JSON.parse(response)
      apply_books(books, $('#room_select').val());
  }); 
}


function apply_books(bookings, raum){

  for (let hour = 0; hour < $('#bookings-table > tbody > tr').length ; hour++) { // go trough the the hours. 
    for (let day = 2; day < days.length; day++) { // go trough the the hours. 
      let cell = $(`#bookings-table > tbody > tr:nth-child(${hour}) > td:nth-child(${day})`);
      if (cell.html() !== "-") { cell.html("-"); }
    }
  }

  for(let i in bookings){
    let booking = bookings[i]
    
    let day_index = days.indexOf( String(booking['day']).toLowerCase() ) + 2
    let hour_index = Number.parseInt( booking['hour'] )
    if( (booking.room).toLowerCase() == raum.toLowerCase() ){
      $(`#bookings-table > tbody > tr:nth-child(${hour_index}) > td:nth-child(${day_index})`).html(`${booking['teacher']}<br>(${booking['fach']})`)
    }
  
  }
}




$('td:contains("-")').click(function() {
  if( this.textContent != "-") return false;

  var stunde = $(this).closest('tr').find('td:first-child').text();
  var tag = $(this).closest('table').find('thead th').eq($(this).index()).text();

  if(! ["sa","so"].includes( tag.toLowerCase().replace(/ /g,"").replace(/\n/g,"") )){
    $('#modal-hour').val(stunde.replace(/ /g,""));
    $('#modal-day').val(tag.replace(/ /g,""));
    $('#booking_window').show();
  }
});

function saveBooking(){
  let data = {
    "day":$('#modal-day').val(),
    "hour":$('#modal-hour').val(),
    "teacher":$('#modal-teach').val(),
    "fach": $('#modal-name').val(),
    "room": $('#room_select').val()
  }

  $('#modal-teach').val("")
  $('#modal-name').val("")
  
  if( ["day","hour","teacher","fach","room"].every(key => data[key] !== '') ){

    $.ajax({
      type: "POST",
      url: "/book",
      data: data,
      success: function(response) {
        console.log( response.statusCode )
      }
    });
  }
}