
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
        for(const reservation of data){
          console.log(reservation.start_time); 
      }
      }
    }
  ); 
}


$(document).ready(function(){
  $('.details').change(function(){
    displaySlots();
  });

  
});

