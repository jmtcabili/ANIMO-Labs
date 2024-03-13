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



var itemsPerPage = 3;
var currentPage = 1;
var data = [
    { reservationNumber: "123456", laboratory: "Chemistry Lab", time: "11:00 AM - 12:00 PM" },
    { reservationNumber: "123789", laboratory: "Computer Lab", time: "10:00 AM - 11:00 AM" },
    { reservationNumber: "123111", laboratory: "Electronics Lab", time: "1:00 PM - 4:00 PM" },
];

// Get all unique start and end times
var uniqueStartTimes = [...new Set(data.map(item => item.time.split(" - ")[0]))];
var uniqueEndTimes = [...new Set(data.map(item => item.time.split(" - ")[1]))];

// Sort the times if needed
uniqueStartTimes.sort();
uniqueEndTimes.sort();

// Populate the select options for start time
var startTimeSelect = document.getElementById("start-time");
startTimeSelect.innerHTML = "<option value=''>Start Time</option>"; // Clear previous options
uniqueStartTimes.forEach(time => {
    startTimeSelect.innerHTML += `<option value="${time}">${time}</option>`;
});

// Populate the select options for end time
var endTimeSelect = document.getElementById("end-time");
endTimeSelect.innerHTML = "<option value=''>End Time</option>"; // Clear previous options
uniqueEndTimes.forEach(time => {
    endTimeSelect.innerHTML += `<option value="${time}">${time}</option>`;
});

document.getElementById("laboratry").addEventListener("change", displayItems);
document.getElementById("start-time").addEventListener("change", displayItems);
document.getElementById("end-time").addEventListener("change", displayItems);

function displayItems() {
    var startIndex = (currentPage - 1) * itemsPerPage;
    var content = "";
    var selectedLab = document.getElementById("laboratry").value;
    var selectedStartTime = document.getElementById("start-time").value;
    var selectedEndTime = document.getElementById("end-time").value;

    // Filter data based on selected filters
    var filteredData = data.filter(item => {
        var timeComponents = item.time.split(" - "); // Split the time range into start and end components
        var startTime = timeComponents[0]; // Extract the start time
        var endTime = timeComponents[1]; // Extract the end time
        
        return (
            (selectedLab === "" || selectedLab === item.laboratory) &&
            (selectedStartTime === "" || startTime === selectedStartTime) &&
            (selectedEndTime === "" || endTime === selectedEndTime)
        );
    });

    // Check the number of filtered items
    var numFilteredItems = filteredData.length;

    // Adjust endIndex if the number of filtered items is less than itemsPerPage
    var endIndex = Math.min(startIndex + itemsPerPage, numFilteredItems);

    // Generate content for the current page
    for (var i = startIndex; i < endIndex; i++) {
        var item = filteredData[i];
        content += `<div class="mini-box">
                        <div><strong>Reservation #:</strong> ${item.reservationNumber}</div>
                        <div><strong>Laboratory:</strong> ${item.laboratory}</div>
                        <div><strong>Time:</strong> ${item.time}</div>
                    </div>`;
    }

    // Update HTML with the generated content
    document.getElementById("content").innerHTML = content;
    document.getElementById("currentPage").textContent = "Page " + currentPage;
}

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

displayItems(); // Display initial items

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






