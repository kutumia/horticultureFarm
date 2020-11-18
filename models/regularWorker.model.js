module.exports = (sequelize, Sequelize) => {
    const regularWorker = sequelize.define("regularworker", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
      },
      name: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.STRING
      },
      nid: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.STRING
      },
      center_id: {
        type: Sequelize.INTEGER
      }
    });
  
    return regularWorker;
  };