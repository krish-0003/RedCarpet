const {
  addUserSoftwares,
} = require('../../domain/userSoftware/userSoftwareRepository');
const { success } = require('../../utils/responseGenerator');
const { userSoftwareStatus } = require('../../utils/strings');

// addUserSoftwares() controller takes required values from request and adds user software mapping.
module.exports.addUserSoftwares = async (req, res) => {
  // get userId from params.
  const userId = parseInt(req.params.userId);

  const bulkData = req.body.softwareList.map((softwareInstance) => {
    return {
      user_id: userId,
      software_id: softwareInstance.software_id,
      createdBy: req.user.email,
      status: userSoftwareStatus.pending,
    };
  });

  const response = await addUserSoftwares(bulkData, req);
  // if response contains all errors only, then send 400 response.
  if (response && response.error.length === req.body.softwareList.length)
    res.status(400).json(
      success({
        message: 'Softwares assignement failed.',
        data: response,
        statusCode: 400,
        error: true,
      })
    );
  else
    res.status(201).json(
      success({
        message: 'Softwares assigned successfully.',
        data: response,
        statusCode: 201,
        error: false,
      })
    );
};
