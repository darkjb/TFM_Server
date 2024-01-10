const validateParticipant = (participant) => {
  if (participant.participantId !== 0) {
    const msg = "participantId distinto de 0: " + participant.participantId;
    return msg;
  }
  if (participant.tournamentId < 1) {
    const msg = "tournamentId no válido: " + participant.tournamentId;
    return msg;
  }
  if (participant.elo < 0) {
    const msg = "elo negativo: " + participant.elo;
    return msg;
  }
};

module.exports = validateParticipant;
