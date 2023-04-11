const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    const AppUser = sequelize.define('app_user', {
        user_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(320),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        nickname: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    const hashPassword = async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
    };

    AppUser.beforeCreate(hashPassword);

    AppUser.beforeUpdate(async (user) => {
        if (user.changed('password')) {
            hashPassword(user);
        }
    });

    return AppUser;
}

