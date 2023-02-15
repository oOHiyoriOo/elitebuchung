function book_room(){
  let data = {
    "class": $('#class').val(),
    "room": $('#room').val(),
    "start": $('#start-time').val(),
    "duration": $('#duration').val()
  }

  $.ajax({
    type: "POST",
    url: "/book",
    data: data,
    success: function(response) {
      console.log(response);
    }
  });
}


$.get("/book", function(response) {
  let bookings = JSON.parse(response)
  let booking_table = $('#bookings-table')
  for(i in bookings){
    console.log(bookings[i])
  }
});
