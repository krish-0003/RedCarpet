const CheckListRepository = require('../../domain/checkList/checkListRepository');
const { success } = require('../../utils/responseGenerator');

const markCheckListValue = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const data = await CheckListRepository.markCheckListValue(userId, req.body);

  return res.status(200).json(
    success({
      message: "User's Checklist Value has been updated successfully.",
      data,
      statusCode: 200,
    })
  );
};

module.exports = { markCheckListValue };
