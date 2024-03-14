$(document).ready(function(){
    $("#edit-profile-button").click(function(){
        $("#upcoming-reservations").hide();
        $("#recent-activity").hide();
        $("#edit-profile").show();
        $("#accept").hide();
        $("#view-reservation").hide();
        $("#contact").hide();
    });
    $("#home-button").click(function(){
        $("#upcoming-reservations").show();
        $("#edit-profile").hide();
        $("#accept").hide();
        $("#view-reservation").hide();
        $("#contact").hide();
    });
    $("#accept-button").click(function(){
        $("#upcoming-reservations").hide();
        $("#recent-activity").hide();
        $("#edit-profile").hide();
        $("#accept").show();
        $("#view-reservation").hide();
        $("#contact").hide();
    });
    $("#view-reservation-button").click(function(){
        $("#upcoming-reservations").hide();
        $("#recent-activity").hide();
        $("#edit-profile").hide();
        $("#accept").hide();
        $("#view-reservation").show();
        $("#contact").hide();
    });
    $("#contact-button").click(function(){
        $("#upcoming-reservations").hide();
        $("#recent-activity").hide();
        $("#edit-profile").hide();
        $("#accept").hide();
        $("#view-reservation").hide();
        $("#contact").show();
    });
    $(".return-to-main-menu button").click(function() {
        $("#upcoming-reservations").hide();
        $("#recent-activity").hide();
        $("#edit-profile").hide();
        $("#accept").hide();
        $("#view-reservation").show();
        $("#contact").hide();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Select edit pens
    const editPenName = document.querySelector('.edit-pen-name');
    const editPenDescription = document.querySelector('.edit-pen-description');

    // Add click event listener for name edit pen
    editPenName.addEventListener('click', () => {
        const displayName = document.querySelector('.display-name');
        const editName = document.querySelector('.edit-name');

        displayName.classList.add('hide');
        editName.classList.remove('hide');
        editName.value = displayName.textContent.trim();
        editName.focus();
    });

    // Add blur event listener for name input
    const editName = document.querySelector('.edit-name');
    editName.addEventListener('blur', () => {
        const displayName = document.querySelector('.display-name');
        const editName = document.querySelector('.edit-name');

        displayName.textContent = editName.value.trim();
        displayName.classList.remove('hide');
        editName.classList.add('hide');
    });

    // Add click event listener for description edit pen
    editPenDescription.addEventListener('click', () => {
        const displayDescription = document.querySelector('.display-description');
        const editDescription = document.querySelector('.edit-description');

        displayDescription.classList.add('hide');
        editDescription.classList.remove('hide');
        editDescription.value = displayDescription.textContent.trim();
        editDescription.focus();
    });

    // Add blur event listener for description textarea
    const editDescription = document.querySelector('.edit-description');
    editDescription.addEventListener('blur', () => {
        const displayDescription = document.querySelector('.display-description');
        const editDescription = document.querySelector('.edit-description');

        displayDescription.textContent = editDescription.value.trim();
        displayDescription.classList.remove('hide');
        editDescription.classList.add('hide');
    });
});


// document.getElementById('image-upload').addEventListener('change', function(event) {
//     const file = event.target.files[0]; // Get the selected image file

//     // Display the selected image as a preview
//     const reader = new FileReader();
//     reader.onload = function() {
//         const imageData = reader.result;
//         document.getElementById('profile-image').src = imageData; // Update src attribute
//     };
//     reader.readAsDataURL(file);
// });


function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayItems();
    }
}

function nextPage() {
    if (currentPage < Math.ceil(data.length / itemsPerPage)) {
        currentPage++;
        displayItems();
    }
}


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
        
        
var input = document.querySelector('#send-button');
var textarea = document.querySelector('#message');

// input.addEventListener('click', function () {
//     textarea.value = '';
// }, false);


$('#confirm').change(function() {
$('#confirm-button').prop("disabled", !this.checked);
})

$(document).ready(function() {
    console.log('Document ready');
    // Function to fetch filtered data
    function fetchData(lab, start, end) {
        $.ajax({
            url: '/view-filter', // Corrected URL
            method: 'POST',
            data: { laboratory: lab, start_time: start, end_time: end }, // Corrected data parameters
            success: function(data) {
                // Clear previous data
                $('.box-content').empty();
                // Append new data
                data.forEach(function(item) {
                    $('.box-content').append(`
                    <a href="/reservation-details?reservation_id=${item.reservation_id}&student_id=${item.student_id}">
                        <div class="mini-box-click">
                            <div><strong>Student:</strong> ${item.name}</div>
                            <div><strong>Student ID:</strong> ${item.student_id}</div>
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
    $('#select_laboratory, #select_start-time, #select_end-time').on('change', function() {
        var lab = $('#select_laboratory').val();
        var start = $('#select_start-time').val();
        var end = $('#select_end-time').val();
        fetchData(lab, start, end); // Pass correct variables
    });
});