module.exports = (sequelize, DataTypes) => {
  const Slot = sequelize.define('Slot', {
    coachId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true, // Indexed for optimized queries filtering by coachId
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    timestamps: true,
    indexes: [{ fields: ['coachId'] }]
  });

  Slot.associate = (models) => {
    Slot.belongsTo(models.User, { as: 'coach', foreignKey: 'coachId' });
    Slot.hasOne(models.Call, { foreignKey: 'slotId' });
  };

  return Slot;
};
