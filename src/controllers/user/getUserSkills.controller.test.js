const userSkillRepository = require('../../domain/user/userSkillRepository');
const skillFactory = require('../../factories/skill');
const userFactory = require('../../factories/user');
const userSkillFactory = require('../../factories/userSkill');
const { InternalServerError } = require('../../utils/customException');
const { getUserSkills } = require('./getUserSkills.controller');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getUserSkills Controller', () => {
  describe('successfull call', () => {
    const skillList = skillFactory.buildList(10);
    const userData = userFactory.build();
    const userSkillsList = userSkillFactory.buildList(15);

    it('should return successfull response', async () => {
      const mockRequest = {
        params: {
          userId: userData.id,
        },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockData = userSkillsList
        .filter((userSkill) => userSkill.user_id === userData.id)
        .map((userSkill) => {
          return { Skill: { name: skillList[userSkill.skill_id - 1].name } };
        });

      const mockSkills = mockData.map((skill) => skill.Skill.name);

      jest
        .spyOn(userSkillRepository, 'getUserSkills')
        .mockResolvedValueOnce(mockSkills);

      await getUserSkills(mockRequest, mockResponse);

      const mockSuccessResponse = {
        message: `List of user's skills`,
        data: { skills: mockSkills },
        code: 200,
        error: false,
        metadata: {
          currentPage: 1,
          totalPages: 1,
          totalResults: 1,
        },
      };

      expect(userSkillRepository.getUserSkills).toHaveBeenCalledWith(
        userData.id
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockSuccessResponse);
    });
  });
});
