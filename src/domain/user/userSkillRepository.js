const model = require('../../database/models');
const { validateUserById } = require('./validateUserById');
const {
  ConflictError,
  BadRequestError,
} = require('../../utils/customException');

const Skills = model.Skills;
const UserSkills = model.UserSkills;

const addUserSkills = async (userId, body, userEmail) => {
  const transactionInstance = await model.sequelize.transaction();
  await validateUserById(userId);

  const { skills } = body;
  const uniqueSkills = new Set(
    skills.map((skill) => skill.toLowerCase().trim())
  );

  if (uniqueSkills.size !== skills.length) {
    throw new BadRequestError('Duplicate skills are not allowed');
  }

  const response = await Promise.all(
    skills.map(async (skill) => {
      const [data, created] = await Skills.findOrCreate({
        where: { name: skill.trim() },
        defaults: {
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: userEmail,
          updatedBy: userEmail,
        },
        transaction: transactionInstance,
      });

      const [userSkill, createdStatus] = await UserSkills.findOrCreate({
        where: { user_id: userId, skill_id: data.id },
        attributes: ['skill_id'],
        defaults: {
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: userEmail,
          updatedBy: userEmail,
        },
        transaction: transactionInstance,
      });
      if (!createdStatus) {
        throw new ConflictError(`Skill "${skill}" already exists `);
      }
      return { id: userSkill.dataValues.skill_id, name: skill };
    })
  ).catch(async (error) => {
    await transactionInstance.rollback();
    throw error;
  });
  await transactionInstance.commit();
  return response;
};
const getUserSkills = async (userId) => {
  await validateUserById(userId);

  const data = await UserSkills.findAll({
    where: { user_id: userId },
    attributes: [],
    include: [{ model: Skills, attributes: ['id', 'name'] }],
  });

  const skills = data.map((skill) => {
    return { id: skill.Skill.id, name: skill.Skill.name };
  });
  return skills;
};

const getAllSkills = async () => {
  const skills = await Skills.findAll({ attributes: ['id', 'name'] });

  return skills;
};

const deleteUserSkill = async (userId, body) => {
  const { skills } = body;
  //  Check if the user exists
  await validateUserById(userId);
  const error = [];
  const success = [];

  await Promise.all(
    skills.map(async (skillId) => {
      const userSkill = await UserSkills.findOne({
        where: { user_id: userId, skill_id: skillId },
      });

      if (!userSkill) {
        error.push({
          errorType: 'UserSkillNotFound',
          id: skillId,
        });
      } else {
        await userSkill.destroy();
        success.push({
          message: 'Skill deleted successfully',
          id: skillId,
        });
      }
    })
  );

  return { success, error };
};

module.exports = {
  addUserSkills,
  getUserSkills,
  getAllSkills,
  deleteUserSkill,
};
