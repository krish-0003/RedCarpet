const CheckListRepository = require('../../domain/checkList/checkListRepository');
const { success } = require('../../utils/responseGenerator');

const getCheckListValue = async (req, res) => {
  const userId = parseInt(req.params.userId);

  const data = await CheckListRepository.getCheckListValue(userId);

  return res.status(200).json(
    success({
      message: `List of user's Checklist Value `,
      data: data,
      statusCode: 200,
    })
  );
};

module.exports = { getCheckListValue };
