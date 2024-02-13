const userSkillRepository = require('../../domain/user/userSkillRepository');
const { success } = require('../../utils/responseGenerator');

const deleteUserSkills = async (req, res) => {
  const data = await userSkillRepository.deleteUserSkill(
    req.params.userId,
    req.body,
    req.user.email
  );

  if (data.success.length === 0) {
    res.status(400).json(
      success({
        message: 'No Skills deleted.',
        data: data,
        statusCode: 400,
        error: true,
      })
    );
  } else
    res.status(202).json(
      success({
        message: `User's skills deleted successfully.`,
        data: { skills: data },
        statusCode: 202,
      })
    );
};
module.exports = { deleteUserSkills };
