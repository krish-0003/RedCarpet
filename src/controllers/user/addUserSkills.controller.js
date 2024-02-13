const userSkillRepository = require('../../domain/user/userSkillRepository');
const { success } = require('../../utils/responseGenerator');

const addUserSkills = async (req, res) => {
  const data = await userSkillRepository.addUserSkills(
    req.params.userId,
    req.body,
    req.user.email
  );

  return res.status(201).json(
    success({
      message: `User's skills updated successfully.`,
      data: { skills: data },
      statusCode: 201,
    })
  );
};

module.exports = { addUserSkills };
