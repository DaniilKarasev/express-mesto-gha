const linkValidation = /^https*:\/\/(www.)*[0-9a-zа-я.\-_~:/?[\]@!$&'()*+,;=]{1,}(#*$)/i;
const idValidation = /^[0-9a-f]{24}$/i;

module.exports = {
  linkValidation,
  idValidation,
};
