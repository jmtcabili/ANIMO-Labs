let start_hour = 0; 
let start_min = 0; 
let start_time = 0; 
let end_hour = 0; 
let end_min = 0; 
let end_time = 0; 
let flag = 0; 


function getTime(){
  start_hour = Number($('#start-hour').val());
  end_hour = Number($('#end-hour').val());
  start_min = Number($('#start-min').val());
  end_min = Number($("#end-min").val());

  if ($('#start-period').val() === 'PM')
    start_hour += 12;    
  if ($('#end-period').val() === 'PM')
    end_hour += 12;
  start_time = start_hour*100 + start_min; 
  end_time = end_hour*100 + end_min; 
}

function checkTime(){
  let isValid = 0;

  getTime();
  console.log(end_time - start_time);
  if (end_time - start_time <= 0){
    alert("End time should be after start time.");
  }else if (end_time - start_time > 200){
    alert("Duration should be at most 2 hours");
  }else
    isValid = 1; 
  
  return isValid;    
}

function checkDate(){
  let date_input = $("#date").val()
  let date_deets = date_input.split("-");
  let year = Number(date_deets[0]);
  let month = Number(date_deets[1])-1;
  let day = Number(date_deets[2]);

  date = new Date(year, month, day);
  console.log(date.valueOf() < new Date().valueOf);
  
  return new Date(date.toDateString()) < new Date(new Date().toDateString());

}

function displaySlots(){
  console.log("Func" +  String($('#date').val()));
  $.post(
     '/slot-ajax', 
    {
      date: $('#date').val(),
      room: $('#room').val(),
      start_time: start_time, 
      end_time: end_time
    }, 
    function(data, status){
      if (status === 'success'){
        console.log("Query Success")
        $(".seat").removeClass("reserved").addClass("available");
        reserved_seats = new Array(); 
        data.forEach(function(reservation){
          //console.log("Room:" + reservation.room);
          //console.log("Seats: " + reservation.seat_ids);
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
  const date = new Date();
  let curr_day = date.getDate();
  let curr_month = date.getMonth()+1; 
  let curr_year = date.getFullYear();

  if (curr_day < 10)
    curr_day = '0' + String(curr_day);
  if (curr_month < 10)
    curr_month = '0' + String(curr_month);
  $("#date").val(curr_year + '-' + curr_month + '-' + curr_day);

  $('.details').change(function(){
    getTime(); 
    if (flag == 1)
      displaySlots();
  });
  $('.start-time').change(function(){
    if (checkTime() == 1)
      flag = 1; 
    else 
      flag = 0; 
  });
  $('.end-time').change(function(){
    if (checkTime() == 1)
      flag = 1; 
    else 
      flag = 0; 
  });
  $('#date').change(function(){
    if (checkDate() == 1){
      flag = 0; 
      alert("Date should be at least today.");
    } else
      flag = 1; 
  });
  
});

