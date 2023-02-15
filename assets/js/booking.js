// start at load.
get_books();
setInterval(() => { // update every second because lol.
  get_books();
},1000)


const days = ["mo","di","mi","do","fr","sa","do"]

function get_books(){
  $.get("/book", function(response) {
    let bookings = JSON.parse(response)
    let booking_table = $('#bookings-table')
    for(i in bookings){
      
      let booking = bookings[i]
      let day_index = days.indexOf( String(booking['day']).toLowerCase() ) + 2
      let hour_index = Number.parseInt( booking['hour'] )
      $(`#bookings-table > tbody > tr:nth-child(${hour_index}) > td:nth-child(${day_index})`).html(`${booking['teacher']}<br>(${booking['fach']})`)
    }
  });
}