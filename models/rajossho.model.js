module.exports = (sequelize, Sequelize) => {
  const rajossho = sequelize.define("rajossho", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement:true
    },
    code: {
      type: Sequelize.STRING
    },
    upokhat: {
      type: Sequelize.STRING
    },
    july1: {
      type: Sequelize.INTEGER
    },
    august1: {
      type: Sequelize.INTEGER
    },
    sept1: {
      type: Sequelize.INTEGER
    },
    oct1: {
      type: Sequelize.INTEGER
    },
    nov1: {
      type: Sequelize.INTEGER
    },
    dec1: {
      type: Sequelize.INTEGER
    },
    jan2: {
      type: Sequelize.INTEGER
    },
    feb2: {
      type: Sequelize.INTEGER
    },
    march2: {
      type: Sequelize.INTEGER
    },
    apr2: {
      type: Sequelize.INTEGER
    },
    may2: {
      type: Sequelize.INTEGER
    },
    june2: {
      type: Sequelize.INTEGER
    },
    total: {
      type: Sequelize.INTEGER
    },
    year: {
      type: Sequelize.INTEGER
    },
    center_id: {
      type: Sequelize.INTEGER
    }
  });

  return rajossho;
};