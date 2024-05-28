module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true // Indexed for optimized queries filtering by user role
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
    indexes: [{ fields: ['role'] }]
  });

  User.associate = (models) => {
    User.hasMany(models.Slot, { foreignKey: 'coachId' });
    User.hasMany(models.Call, { foreignKey: 'studentId' });
  };

  return User;
};