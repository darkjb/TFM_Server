const validateResult = (result) => {
    if(result.tournamentId < 1) {
        const msg = "tournamentId no válido: " + result.tournamentId;
        return msg;
    }
    if(result.roundNumber < 1) {
        const msg = "roundNumber no válido: " + result.roundNumber;
        return msg;
    }
    if(result.pageNumber < 1) {
        const msg = "pageNumber no válido: " + result.tournamentId;
        return msg;
    }
};

module.exports = validateResult;
