
function displaySlots(){
  $.post(
    'slot-ajax', 
    {
      date: $('#date').val(),
      room: $('#room').val(),
      start_hour: $('#start-hour').val(), 
      start_min: $('#start-min').val(), 
      end_hour: $('#end-hour').val(), 
      end_min: $('#end-min').val(), 
    }, 
    function(data, status){
      if (status === 'success'){
        $(".seat").removeClass("reserved").addClass("available");
        reserved_seats = new Array(); 
        data.forEach(function(reservation){
          console.log("Room:" + reservation.room);
          console.log("Seats: " + reservation.seat_ids);
          reservation.seat_ids.forEach(function(seats){
            reserved_seats.push(seats);
          });//seats
        });//reservations
      }//status

      //changing seat status
      reserved_seats.forEach(function(seat){
       $("#"+seat).removeClass("available").addClass("reserved"); 
      }); 

      //changing displayed details
      let start_time_text = $('#start-hour').val() + ":" + $('#start-min').val() + " " + $('#start-period').val();
      let end_time_text = $('#end-hour').val() + ":" + $('#end-min').val() + " " + $('#end-period').val();
      $("#date-selected").text($('#date').val());
      $("#room-selected").text($('#room').val());
      $("#time-selected").text(start_time_text + " - " + end_time_text);

    }//data,status
  ); 
}


$(document).ready(function(){
  $('.details').change(function(){
    displaySlots();
  });

  
});

