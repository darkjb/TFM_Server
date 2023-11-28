const validateUser = (user) => {
    if(user.userId !== 0) {
        const msg = "userId distinto de 0: " + user.userId
        return msg;
    }
};

module.exports = validateUser;
