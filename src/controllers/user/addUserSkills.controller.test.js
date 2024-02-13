const { InternalServerError } = require('../../utils/customException');
const userSkillRepository = require('../../domain/user/userSkillRepository');
const skillFactory = require('../../factories/skill');
const userFactory = require('../../factories/user');
const { addUserSkills } = require('./addUserSkills.controller');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addUserSkills Controller', () => {
  const mockSkills = skillFactory.buildList(5).map((skill) => skill.name);
  const userData = userFactory.build();
  describe('successfull call', () => {
    it('shoud add user skills', async () => {
      const mockRequest = {
        body: {
          skills: mockSkills,
        },
        params: {
          userId: userData.id,
        },
        user: {
          email: 'tech@techholding.co',
        },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest
        .spyOn(userSkillRepository, 'addUserSkills')
        .mockResolvedValueOnce(mockSkills);

      await addUserSkills(mockRequest, mockResponse);

      const mockSuccessResponse = {
        message: `User's skills updated successfully.`,
        data: { skills: mockSkills },
        code: 201,
        error: false,
        metadata: {
          currentPage: 1,
          totalPages: 1,
          totalResults: 1,
        },
      };

      expect(userSkillRepository.addUserSkills).toHaveBeenCalledWith(
        mockRequest.params.userId,
        mockRequest.body,
        mockRequest.user.email
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockSuccessResponse);
    });
  });
});
