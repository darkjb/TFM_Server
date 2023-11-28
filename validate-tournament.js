const validateTournament = (tournament) => {
    if(tournament.tournamentId !== 0) {
        const msg = "tournamentId distinto de 0: " + tournament.tournamentId;
        return msg;
    }
    if(tournament.pairing < 1 || tournament.pairing > 2) {
        const msg = "pairing out of range: " + tournament.pairing;
        return msg;
    }
    if(tournament.tiebreak < 1 || tournament.tiebreak > 2) {
        const msg = "tiebreak out of range: " + tournament.tiebreak;
        return msg;
    }
};

module.exports = validateTournament;
