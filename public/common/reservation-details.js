function deleteReservation() {
    const currentUrl = new URL(window.location.href);
    const reservationId = currentUrl.searchParams.get('reservation_id');

    if (!reservationId) {
        console.error('Reservation ID not found in URL.');
        return;
    }
    console.log(reservationId);
    fetch(`/delete-reservation/${reservationId}`, { method: 'GET' })
        .then(response => {
            if (response.ok) {
                window.location.href = '/';
            } else {
                console.error('Failed to deactivate account.');
            }
        })
        .catch(error => {
            console.error('Error deactivating account:', error);
        });
}