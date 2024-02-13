const userSkillRepository = require('../../domain/user/userSkillRepository');
const { success } = require('../../utils/responseGenerator');

const getUserSkills = async (req, res) => {
  const skills = await userSkillRepository.getUserSkills(req.params.userId);

  return res.status(200).json(
    success({
      message: `List of user's skills`,
      data: { skills: skills },
      statusCode: 200,
    })
  );
};

module.exports = { getUserSkills };
