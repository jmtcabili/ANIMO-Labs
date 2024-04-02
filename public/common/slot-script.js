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

  //if 12:00am
  if ($('#start-period').val() === 'AM' && ($('#start-hour').val() == 12))
    start_hour = 0; 
  if ($('#end-period').val() === 'AM' && ($('#end-hour').val() == 12))
    end_hour = 0; 

  if ($('#start-period').val() === 'PM' && ($('#start-hour').val() != 12))
    start_hour += 12;    
  if ($('#end-period').val() === 'PM' && ($('#end-hour').val() != 12))
    end_hour += 12;

  start_time = start_hour*100 + start_min; 
  end_time = end_hour*100 + end_min; 

}

function checkTime(){ //validates time and returns status
  let isValid = 0;

  getTime();
  if (end_time - start_time <= 0){
    alert("End time should be after start time.");
  }else if (end_time - start_time > 200){
    alert("Duration should be at most 2 hours");
  }else
    isValid = 1; 
  
  return isValid;    
}

function checkDate(){ //validates date and returns status
  let date_input = $("#date").val()
  let date_deets = date_input.split("-");
  let year = Number(date_deets[0]);
  let month = Number(date_deets[1])-1;
  let day = Number(date_deets[2]);

  date = new Date(year, month, day);  
  return new Date(date.toDateString()) < new Date(new Date().toDateString());

}

function displaySlots(){ //display proper slot status at given filter
  
  let server = "";
  if ($('#reservation_number').text())
    server = '/slot-update-ajax'; 
  else 
    server = '/slot-ajax';

  $.post(
     server, 
    {
      date: $('#date').val(),
      room: $('#room').val(),
      start_time: start_time, 
      end_time: end_time,
      id : $('#reservation_number').text()
    }, 
    function(data, status){
      if (status === 'success'){
        console.log("Query Success");
        //reset seat status
        $(".seat").removeClass("reserved").removeClass("selected").addClass("available");
        //empty selected seats from previous query if existing
        $('#seats_selected').val('');
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


function pickSeats(){
  $('.seat').on("click", function(){
    if (flag){ //if inputs are validated
      //get current seats
      seats_selected = $('#seats_selected').val();
      //if reserved, you can't click
      //if selected, first click -> add to seats selected
      //             second click -> remove from seats
      if (this.classList.contains("available")){
        seats_selected += (this.id + " "); 
        $('#seats_selected').val(seats_selected);
        $('#' + this.id).removeClass("available").addClass("selected");
      } else if (this.classList.contains("selected")){
        //find seat in seats_selected
        seats_selected = seats_selected.replace(this.id+' ', '');
        $('#seats_selected').val(seats_selected);
        $('#' + this.id).removeClass("selected").addClass("available");
      }
    } 
  });
}


$(document).ready(function(){
  const date = new Date();
  let curr_day = date.getDate();
  let curr_month = date.getMonth()+1; 
  let curr_year = date.getFullYear();

  displaySlots();

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
  pickSeats();

});

