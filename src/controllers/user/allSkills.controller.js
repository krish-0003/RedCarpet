const { getAllSkills } = require('../../domain/user/userSkillRepository');
const { success } = require('../../utils/responseGenerator');

const allSkills = async (req, res) => {
  const receivedSkills = await getAllSkills();
  return res.status(200).json(
    success({
      message: 'All skills.',
      statusCode: 200,
      data: { skills: receivedSkills },
    })
  );
};

module.exports = { allSkills };
