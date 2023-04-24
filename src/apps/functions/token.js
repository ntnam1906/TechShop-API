const generateInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateConfirmationToken = () => {
    return generateInteger(1000, 9999);
}

module.exports = {
    generateInteger,
    generateConfirmationToken,
};