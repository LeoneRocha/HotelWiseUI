
  const reservationStatus = ReservationStatus.Cancelled;
  const description = getEnumDescription(ReservationStatus, reservationStatus, ReservationStatusDescriptions);
  
  console.log(description); // Saída: "Cancelada"