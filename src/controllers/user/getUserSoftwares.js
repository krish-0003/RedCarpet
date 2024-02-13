const { getUserSoftwares } = require('../../domain/user/userRepository');
const { success } = require('../../utils/responseGenerator');

// getUserSoftwares() controller fetches list of software mapped with user having provided userId.
module.exports.getUserSoftwares = async (req, res) => {
  // get userId from params.
  const userId = parseInt(req.params.userId);
  // perform database action.
  const response = await getUserSoftwares({
    userId,
  });

  res.status(200).json(
    success({
      message: 'List of assigned software to User.',
      data: response,
      statusCode: 200,
    })
  );
};
