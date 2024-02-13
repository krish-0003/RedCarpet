const express = require('express');
const router = express.Router();
const db = require('../../database/models');
const { success, error } = require('../../utils/responseGenerator');
const { healthCheckEndpoints } = require('../../utils/strings');

router.get(healthCheckEndpoints.healthCheck, async (req, res) => {
  try {
    await db.sequelize.authenticate();
    return res.status(200).json(
      success({
        message: `API is up and running`,
        statusCode: 200,
      })
    );
  } catch (e) {
    return res.status(500).json(
      error({
        message: `Database down`,
        statusCode: 200,
        name: e.message,
      })
    );
  }
});

module.exports = router;
