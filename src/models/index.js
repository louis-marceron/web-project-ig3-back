module.exports = (sequelize) => {
    const AppUser = require('./AppUser')(sequelize);

    return { AppUser };
};
