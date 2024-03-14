$(document).ready(function(){
    $("#edit-profile-button").click(function(){
        $("#upcoming-reservations").hide();
        $("#recent-activity").hide();
        $("#edit-reservation").hide();
        $("#view-reservation").hide();
        $("#contact").hide();
        $("#deactivate").hide();
        $("#edit-profile").show();
    });
    $("#home-button").click(function(){
        $("#upcoming-reservations").show();
        $("#recent-activity").show();
        $("#edit-reservation").hide();
        $("#view-reservation").hide();
        $("#contact").hide();
        $("#deactivate").hide();
        $("#edit-profile").hide();
    });
    $("#edit-reservation-button").click(function(){
        $("#upcoming-reservations").hide();
        $("#recent-activity").hide();
        $("#edit-reservation").show();
        $("#view-reservation").hide();
        $("#contact").hide();
        $("#deactivate").hide();
        $("#edit-profile").hide();
    });
    $("#view-reservation-button").click(function(){
        $("#upcoming-reservations").hide();
        $("#recent-activity").hide();
        $("#edit-reservation").hide();
        $("#view-reservation").show();
        $("#contact").hide();
        $("#deactivate").hide();
        $("#edit-profile").hide();
    });
    $("#contact-button").click(function(){
        $("#upcoming-reservations").hide();
        $("#recent-activity").hide();
        $("#edit-reservation").hide();
        $("#view-reservation").hide();
        $("#contact").show();
        $("#deactivate").hide();
        $("#edit-profile").hide();
    });
    $("#deactivate-button").click(function(){
        var modal = document.getElementById("deactivate-modal");
        modal.style.display = "block";
        deactivateModal();
    });
});


function messageModal(){
    var modal = document.getElementById("send-modal");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks the button, open the modal 
    
    modal.style.display = "block";
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
        $("#upcoming-reservations").show();
        $("#recent-activity").show();
        $("#contact").hide();
    }
}

function deactivateModal(){
    var btn1 = document.getElementById("cancel-button");
    var btn2 = document.getElementById("confirm-button");
    var modal = document.getElementById("deactivate-modal");

    btn1.onclick = function(){
        modal.style.display = "none";
    }
}

function message(){
    var input = document.querySelector('#send-button');
    var textarea = document.querySelector('#message');

    input.addEventListener('click', function () {
        textarea.value = '';
    }, false);
}


$('#confirm').change(function() {
$('#confirm-button').prop("disabled", !this.checked);
})

$(document).ready(function() {
    console.log('Document ready');
    // Function to fetch filtered data
    function fetchData(id, lab, start, end) {
        $.ajax({
            url: '/view-filter-user', // Corrected URL
            method: 'POST',
            data: { student_id: id, laboratory: lab, start_time: start, end_time: end }, // Corrected data parameters
            success: function(data) {
                // Clear previous data
                $('#content').empty();
                // Append new data
                data.forEach(function(item) {
                    $('#content').append(`
                    <a href="/reservation-details?reservation_id=${item.reservation_id}&student_id=${item.student_id}">
                        <div class="mini-box-click">
                            <div><strong>Reservation #:</strong> ${item.reservation_id}</div>
                            <div><strong>Laboratory:</strong> ${item.laboratory}</div>
                            <div><strong>Time:</strong> ${item.start_time} - ${item.end_time}</div>
                        </div>
                    </a>
                    `);
                });
            },
            error: function(err) {
                console.error('Error fetching data:', err);
            }
        });
    }

    // Event listener for changes in select elements
    $('#select_id, #select_laboratory, #select_start-time, #select_end-time').on('change', function() {
        var id = $('#select_id').val();
        var lab = $('#select_laboratory').val();
        var start = $('#select_start-time').val();
        var end = $('#select_end-time').val();
        fetchData(id, lab, start, end); // Pass correct variables
    });
});




