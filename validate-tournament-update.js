const validateTournamentUpdate = (tournament) => {
  if (tournament.tournamentId === 0) {
    const msg = "tournamentId es 0";
    return msg;
  }
};

module.exports = validateTournamentUpdate;
