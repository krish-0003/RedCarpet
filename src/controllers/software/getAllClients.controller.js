const { getAllClient } = require('../../domain/software/softwareRepository');
const errorMessage = require('../../utils/errorMessage');
const { success } = require('../../utils/responseGenerator');

const getAllClients = async (req, res) => {
  const receivedClients = await getAllClient();
  return res.status(200).json(
    success({
      message: errorMessage.statusCode200,
      statusCode: res.statusCode,
      data: receivedClients,
    })
  );
};
module.exports = { getAllClients };
