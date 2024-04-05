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
    
    const logOutButton = document.getElementById('log-out-button');
    
    logOutButton.addEventListener('click', function(event) {
        console.log("CLICKED");
        event.preventDefault(); // Prevent the default link behavior

        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}) // Send an empty body or any necessary data
        })
        .then(response => {
            if (response.ok) {
                // Redirect to the home page or perform any other action
                window.location.href = '/';
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
    });
    // Select edit pens
    const editPenName = document.querySelector('.edit-pen-name');
    const editPenDescription = document.querySelector('.edit-pen-description');
    const editPenPassword = document.querySelector('.edit-pen-password');
    const editPenImage = document.querySelector('.edit-pen-image');

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

    // Add click event listener for password edit pen
    editPenPassword.addEventListener('click', () => {
        const editOldPassword = document.querySelector('.edit-old-password');
        const editNewPassword = document.querySelector('.edit-new-password');
    
        // Toggle visibility of password input fields
        editOldPassword.classList.toggle('hide');
        editNewPassword.classList.toggle('hide');
    
        // Optionally, set focus to the first input field
        editOldPassword.focus();
    });

    // Add click event listener for image edit pen
    editPenImage.addEventListener('click', () => {
        const imageUpload = document.querySelector('#image-upload');
        // Trigger file input click
        imageUpload.click();
    });

    // Add change event listener for file input (image upload)
    const imageUpload = document.querySelector('#image-upload');
    imageUpload.addEventListener('change', () => {
        const profileImage = document.querySelector('#profile-image');
        const file = imageUpload.files[0];
        if (file) {
            // Handle image preview if needed
            const reader = new FileReader();
            reader.onload = function(event) {
                profileImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    // Update profile when Update button is clicked
    const updateButton = document.getElementById('update-profile');
    updateButton.addEventListener('click', () => {
        const newName = document.querySelector('.display-name').textContent.trim();
        const newDescription = document.querySelector('.display-description').textContent.trim();
        const oldPassword = document.querySelector('.edit-old-password').value.trim(); // Added
        const newPassword = document.querySelector('.edit-new-password').value.trim();
        const userID = document.querySelector('.text-idnumber a').textContent.trim(); // Changed from .text to .textContent
        const formData = new FormData();
        
        formData.append('id', userID);
        formData.append('name', newName);
        formData.append('desc', newDescription);
        formData.append('oldPassword', oldPassword); // Added
        formData.append('newPassword', newPassword);
        formData.append('image', document.getElementById('image-upload').files[0]); // Added
        
        $.ajax({
            url: '/update-profile',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response){
                console.log(response.message);
                // Display success message
                const successMessage = document.querySelector('.result'); // Use querySelector for class
                const message = document.querySelector('#result-message'); // Use querySelector for ID
                message.textContent = response.message;
                successMessage.style.display = 'block';
                        
                // Optionally, reset password inputs
                document.querySelector('.edit-old-password').value = '';
                document.querySelector('.edit-new-password').value = '';
            },
            error: function(xhr, status, error){
                console.error(xhr.responseText); // Log the detailed error message
                // Display error message
                const errorMessage = document.createElement('div');
                errorMessage.classList.add('result'); // Add the 'result' class
                errorMessage.innerHTML = `
                    <div class="result-content">
                        <span class="close-button">&times;</span>
                        <p id="result-message">Error: ${xhr.responseText}</p>
                    </div>
                `;
                errorMessage.style.display = 'block';
                 // Add event listener to close button
                const closeButton = errorMessage.querySelector('.close-button');
                closeButton.addEventListener('click', function() {
                    errorMessage.remove(); // Remove the error message from the DOM
                });

                // Append the error message to the document body
                document.body.appendChild(errorMessage);
            }
        });
    });
    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', function() {
        // Hide the pop-up message
        const result = document.querySelector('.result');
        result.style.display = 'none';
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
        
        
var input = document.querySelector('#send-button');
var textarea = document.querySelector('#message');

$('#confirm').change(function() {
$('#confirm-button').prop("disabled", !this.checked);
})

$(document).ready(function() {
    console.log('Document ready');
    // Function to fetch filtered data
    function fetchData(id, lab, start, end) {
        $.ajax({
            url: '/view-filter', // Corrected URL
            method: 'POST',
            data: { student_id: id, laboratory: lab, start_time: start, end_time: end }, // Corrected data parameters
            success: function(data) {
                // Clear previous data
                $('#reservation-list-container').empty();
                // Append new data
                data.forEach(function(item) {
                    $('#reservation-list-container').append(`
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
    $('.student-id, #select_laboratory, #select_start-time, #select_end-time').on('change', function() {
        var id = $('.student-id').val(); 
        var lab = $('#select_laboratory').val();
        var start = $('#select_start-time').val();
        var end = $('#select_end-time').val();
        fetchData(id, lab, start, end); // Pass correct variables
    });
});


document.addEventListener('DOMContentLoaded', function() {
    // Define the room options for each laboratory
    const labRooms = {
        "Chemistry Lab": ["V101", "V102", "V103", "V104", "V105"],
        "Computer Lab": ["G302", "G303", "G304", "G305"],
        "Electronics Lab": ["G403", "G404"]
    };

    // Function to populate room options based on selected laboratory
    function populateRoomOptions(lab) {
        const roomSelect = document.getElementById('room');
        roomSelect.innerHTML = '<option value="">Select Room</option>'; // Reset room options
        if (lab in labRooms) {
            labRooms[lab].forEach(room => {
                const option = document.createElement('option');
                option.value = room;
                option.textContent = room;
                roomSelect.appendChild(option);
            });
        }
    }

    // Event listener for change in laboratory select
    const labSelect = document.getElementById('laboratry');
    labSelect.addEventListener('change', function() {
        const selectedLab = labSelect.value;
        populateRoomOptions(selectedLab);
    });

    // Initial population of room options
    populateRoomOptions(labSelect.value);
});