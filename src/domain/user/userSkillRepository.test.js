const model = require('../../database/models');
const skillFactory = require('../../factories/skill');
const userFactory = require('../../factories/user');
const userSkillFactory = require('../../factories/userSkill');

const {
  getUserSkills,
  addUserSkills,
  getAllSkills,
  deleteUserSkill,
} = require('./userSkillRepository');

const Skills = model.Skills;
const UserSkills = model.UserSkills;

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('./validateUserById');

describe('getUserSkills Repository', () => {
  const skillList = skillFactory.buildList(10);
  const userData = userFactory.build();
  const userSkillsList = userSkillFactory.buildList(15);

  describe('successfull call', () => {
    it('should return user skills list', async () => {
      const mockData = userSkillsList
        .filter((userSkill) => userSkill.user_id === userData.id)
        .map((userSkill) => {
          return {
            Skill: {
              id: skillList[userSkill.skill_id - 1].id,
              name: skillList[userSkill.skill_id - 1].name,
            },
          };
        });

      const mockSkills = mockData.map((skill) => {
        return { id: skill.Skill.id, name: skill.Skill.name };
      });

      jest.spyOn(UserSkills, 'findAll').mockResolvedValueOnce(mockData);
      jest.spyOn(mockData, 'map').mockResolvedValueOnce(mockSkills);

      const skills = await getUserSkills(userData.id);
      expect(skills).toEqual(mockSkills);
      expect(UserSkills.findAll).toHaveBeenCalledWith({
        where: { user_id: userData.id },
        attributes: [],
        include: [{ model: Skills, attributes: ['id', 'name'] }],
      });
    });
  });
});

describe('addUserSkills Repository', () => {
  const skillList = skillFactory.buildList(10);
  const userData = userFactory.build();
  const userSkillsList = userSkillFactory.buildList(15);
  describe('successfull call', () => {
    it('should add user skills', async () => {
      const mockUserId = userData.id;
      const transactionInstance = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };
      const mockData = userSkillsList
        .filter((userSkill) => userSkill.user_id === mockUserId)
        .map((userSkill) => {
          return { Skill: { name: skillList[userSkill.skill_id - 1].name } };
        });

      const mockSkills = Array.from(
        new Set(mockData.map((skill) => skill.Skill.name))
      );
      const mockBody = { skills: mockSkills };
      const mockResponse = mockSkills.map((skill) => {
        return { id: userSkillsList[0].skill_id, name: skill };
      });

      jest
        .spyOn(Skills, 'findOrCreate')
        .mockResolvedValue([skillList[0], true]);

      jest
        .spyOn(UserSkills, 'findOrCreate')
        .mockResolvedValue([{ dataValues: userSkillsList[0] }, true]);
      const transactionSpy = jest
        .spyOn(model.sequelize, 'transaction')
        .mockResolvedValueOnce(transactionInstance);
      const skills = await addUserSkills(mockUserId, mockBody);
      expect(skills).toStrictEqual(mockResponse);
    });
  });

  describe('no parameters provided', () => {
    it('should throw an error', async () => {
      const transactionInstance = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      const transactionSpy = jest
        .spyOn(model.sequelize, 'transaction')
        .mockResolvedValueOnce(transactionInstance);
      try {
        await addUserSkills();
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
  });

  describe('no skills provided in body provided', () => {
    it('should throw an error', async () => {
      const transactionInstance = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      const transactionSpy = jest
        .spyOn(model.sequelize, 'transaction')
        .mockResolvedValueOnce(transactionInstance);
      const mockUserId = userData.id;
      const mockBody = {};

      try {
        await addUserSkills(mockUserId, mockBody);
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
  });
});

describe('getAllSkills Repository', () => {
  const skillList = skillFactory.buildList(10);

  describe('successfull call', () => {
    it('should return all skills list', async () => {
      const mockSkills = skillList.map((skill) => {
        return { id: skill.id, name: skill.name };
      });

      jest.spyOn(Skills, 'findAll').mockResolvedValueOnce(mockSkills);

      const skills = await getAllSkills();
      expect(skills).toEqual(mockSkills);
      expect(Skills.findAll).toHaveBeenCalledTimes(1);
    });
  });
});

describe('deleteUserSkill', () => {
  UserSkills.findOne = jest.fn(({}) => {
    return {
      destroy: jest.fn(),
    };
  });

  it('should delete user skills and return success and errors', async () => {
    const body = { skills: [1, 2, 3] };
    const userId = 1;

    const result = await deleteUserSkill(userId, body);

    expect(result).toEqual({
      success: [
        {
          message: 'Skill deleted successfully',
          id: 1,
        },
        {
          message: 'Skill deleted successfully',
          id: 2,
        },
        {
          message: 'Skill deleted successfully',
          id: 3,
        },
      ],
      error: [],
    });
  });
});
