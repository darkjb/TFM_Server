const validateComment = (comment) => {
  if (comment.tournamentId < 1) {
    const msg = "tournamentId no válido: " + comment.tournamentId;
    return msg;
  }
  if (comment.commentId !== 0) {
    const msg = "commentId distinto de 0: " + comment.commentId;
    return msg;
  }
};

module.exports = validateComment;
