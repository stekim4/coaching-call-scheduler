module.exports = (sequelize, DataTypes) => {
  const Call = sequelize.define('Call', {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true, // Indexed for optimized queries filtering by studentId
    },
    slotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true, // Indexed for optimized queries filtering by slotId
    },
    satisfaction: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
    },
    coachNotes: {
      type: DataTypes.TEXT,
    },
  }, {
    indexes: [
      { fields: ['studentId'] },
      { fields: ['slotId'] }
    ],
    timestamps: true,
  });

  Call.associate = (models) => {
    Call.belongsTo(models.User, { as: 'student', foreignKey: 'studentId' });
    Call.belongsTo(models.Slot, { foreignKey: 'slotId' });
  };

  return Call;
};
