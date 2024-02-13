const { InternalServerError } = require('../../utils/customException');
const CheckListRepository = require('../../domain/checkList/checkListRepository');
const checkListFactory = require('../../factories/checkList');
const userCheckListFactory = require('../../factories/userCheckList');

const userFactory = require('../../factories/user');
const { markCheckListValue } = require('./markCheckListValue.controller');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('markCheckListValue Controller', () => {
  const mockCheckList = checkListFactory.build();
  const mockUserCheckList = userCheckListFactory.build();
  const userData = userFactory.build();

  describe('successfull call', () => {
    it('shoud mark checklist value ', async () => {
      const mockRequest = {
        body: {
          checklistId: mockCheckList.id,
          checklistValue: mockUserCheckList.checklist_value,
        },
        params: {
          userId: userData.id,
        },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest
        .spyOn(CheckListRepository, 'markCheckListValue')
        .mockResolvedValueOnce(mockUserCheckList);

      await markCheckListValue(mockRequest, mockResponse);

      const mockSuccessResponse = {
        message: `User's Checklist Value has been updated successfully.`,
        data: mockUserCheckList,
        code: 200,
        error: false,
        metadata: {
          currentPage: 1,
          totalPages: 1,
          totalResults: 1,
        },
      };

      expect(CheckListRepository.markCheckListValue).toHaveBeenCalledWith(
        mockRequest.params.userId,
        mockRequest.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockSuccessResponse);
    });
  });
});
