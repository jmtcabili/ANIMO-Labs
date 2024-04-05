function deleteReservation(current_id, isLabTech) {
    const currentUrl = new URL(window.location.href);
    const reservationId = currentUrl.searchParams.get('reservation_id');
    const userId = current_id;


    if (!reservationId) {
        console.error('Reservation ID not found in URL.');
        return;
    }
    console.log(reservationId);
    fetch(`/delete-reservation/${reservationId}`, { method: 'GET' })
        .then(response => {
            if (response.ok) {
                if (isLabTech == 1){
                    window.location.href = '/lab-profile/'+ userId ;
                }   
                else{
                    window.location.href = '/user-profile/'+ userId ;
                }
                
            } else {
                console.error('Failed to deactivate account.');
            }
        })
        .catch(error => {
            console.error('Error deactivating account:', error);
        });
}