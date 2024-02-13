const { getCheckListValue } = require('./getCheckListValue.controller');
const CheckListRepository = require('../../domain/checkList/checkListRepository');
const checkListFactory = require('../../factories/checkList');
const userCheckListFactory = require('../../factories/userCheckList');
const userFactory = require('../../factories/user');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getCheckListValue Controller', () => {
  describe('successfull call', () => {
    const mockCheckList = checkListFactory.build();
    const mockUserCheckList = userCheckListFactory.build();
    const userData = userFactory.build();
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

      const mockdata = [
        {
          checklist_id: mockCheckList.id,
          checklist_value: mockUserCheckList.checklist_value,
          type: mockCheckList.type,
        },
      ];

      jest
        .spyOn(CheckListRepository, 'getCheckListValue')
        .mockResolvedValueOnce(mockdata);

      await getCheckListValue(mockRequest, mockResponse);

      const mockSuccessResponse = {
        message: `List of user's Checklist Value `,
        data: mockdata,
        code: 200,
        error: false,
        metadata: {
          currentPage: 1,
          totalPages: 1,
          totalResults: 1,
        },
      };

      expect(CheckListRepository.getCheckListValue).toHaveBeenCalledWith(
        userData.id
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockSuccessResponse);
    });
  });
});
