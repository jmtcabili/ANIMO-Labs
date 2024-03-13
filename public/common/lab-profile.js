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
        $("#recent-activity").show();
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


// Function to handle image upload
document.getElementById('image-upload').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Get the selected image file

    // Display the selected image as a preview
    const reader = new FileReader();
    reader.onload = function() {
        const imageData = reader.result;
        document.getElementById('profile-image').src = imageData;

        // Assuming you have a function to save the image data to the server
        saveImageToServer(imageData); // Call function to save image data to server
    };
    reader.readAsDataURL(file);
});
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

input.addEventListener('click', function () {
    textarea.value = '';
}, false);


$('#confirm').change(function() {
$('#confirm-button').prop("disabled", !this.checked);
})

document.addEventListener('DOMContentLoaded', function() {
    const laboratorySelect = document.getElementById('laboratory');
    const startTimeSelect = document.getElementById('start-time');
    const endTimeSelect = document.getElementById('end-time');

    // Function to update filtered data
    async function updateFilteredData() {
        console.log("Function updateFilteredData is being called.");
        const laboratory = laboratorySelect.value;
        const startTime = startTimeSelect.value;
        const endTime = endTimeSelect.value;

        console.log('Laboratory:', laboratory);
        console.log('Start Time:', startTime);
        console.log('End Time:', endTime);

        const response = await fetch(`/lab-profile?laboratory=${laboratory}&start_time=${startTime}&end_time=${endTime}`);
        const data = await response.json();

        console.log('Filtered Data:', data);

        // Update reservation list container
        const reservationListContainer = document.getElementById('reservation-list-container');
        reservationListContainer.innerHTML = '';

        data.forEach(reservation => {
            const miniBoxClick = document.createElement('div');
            miniBoxClick.classList.add('mini-box-click');
            miniBoxClick.innerHTML = `
                <div><strong>Student:</strong> ${reservation.name}</div>
                <div><strong>Student ID:</strong> ${reservation.student_id}</div>
                <div><strong>Reservation #:</strong> ${reservation.reservation_id}</div>
                <div><strong>Laboratory:</strong> ${reservation.laboratory}</div>
                <div><strong>Time:</strong> ${reservation.start_time} - ${reservation.end_time}</div>
            `;
            reservationListContainer.appendChild(miniBoxClick);
        });
    }

    // Event listeners for select elements
    laboratorySelect.addEventListener('change', updateFilteredData);
    startTimeSelect.addEventListener('change', updateFilteredData);
    endTimeSelect.addEventListener('change', updateFilteredData);

    // Initial data load
    updateFilteredData();
});



        