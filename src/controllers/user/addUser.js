const userRepository = require('../../domain/user/userRepository');
const moment = require('moment');
const { InternalServerError } = require('../../utils/customException');
const { employeeApprovalEmail } = require('../../utils/helpers/emailHelper');
const { success } = require('../../utils/responseGenerator');
const { locations } = require('../../utils/strings');
const addUser = async (req, res) => {
  const response = await userRepository.addUser(
    req.body,
    req.user.email,
    req.user
  );
  if (!response) {
    throw new InternalServerError();
  }

  const userLocation = locations.remoteBranchIds.includes(response.branch_id)
    ? response.country_code === locations.indianPhoneCode
      ? locations.india
      : locations.us
    : locations.indiaBranchIds.includes(response.branch_id)
    ? locations.india
    : locations.us;

  const pendingUsersRequests = await userRepository.getPendingUsersCount(
    userLocation === locations.india
      ? locations.indiaBranchIds
      : locations.usBranchIds
  );

  employeeApprovalEmail(req, {
    employeeId: response.id,
    firstname: response.first_name,
    lastname: response.last_name,
    location: userLocation,
    onboardDate: moment().format('MMM DD, YYYY'),
    pendingRequests: pendingUsersRequests - 1,
  });

  res.status(201).json(
    success({
      message: 'User added successfully',
      data: response,
      statusCode: 201,
    })
  );
};

module.exports = addUser;
