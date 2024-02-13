const model = require('../../database/models');
const checkListFactory = require('../../factories/checkList');
const userCheckListFactory = require('../../factories/userCheckList');
const userFactory = require('../../factories/user');
const { InternalServerError } = require('../../utils/customException');

const {
  markCheckListValue,
  getCheckListValue,
} = require('../checkList/checkListRepository');

const CheckLists = model.CheckLists;
const UserCheckLists = model.UserCheckLists;
const Users = model.Users;
beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('../user/validateUserById');
jest.mock('./validateCheckListId');

describe('markCheckListValue Repository', () => {
  const mockCheckList = checkListFactory.build();
  const mockUserCheckList = userCheckListFactory.build();
  const userData = userFactory.build();

  describe('successfull call', () => {
    it('should mark checkList value', async () => {
      const mockUserCheckListSave = jest.fn().mockReturnValue();
      mockUserCheckList.save = await mockUserCheckListSave;
      const mockUserId = userData.id;
      const mockBody = {
        checklist_id: mockUserCheckList.checklist_id,
        checklist_value: mockUserCheckList.checklist_value,
      };

      jest
        .spyOn(UserCheckLists, 'findByPk')
        .mockResolvedValue(mockUserCheckList);

      const mockedDataResponse = await markCheckListValue(mockUserId, mockBody);
      expect(mockedDataResponse).toEqual({
        id: mockUserCheckList.id,
        checklist_id: mockUserCheckList.checklist_id,
        checklist_value: mockUserCheckList.checklist_value,
      });
    });
  });

  describe('wrong userId provided', () => {
    it('should throw an error', async () => {
      const mockBody = {
        checklist_id: mockUserCheckList.checklist_id,
        checklist_value: mockUserCheckList.checklist_value,
      };

      try {
        await markCheckListValue('a', mockBody);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerError);
      }
    });
  });

  describe('no Checklist id and Value provided in body provided', () => {
    it('should throw an error', async () => {
      const mockUserId = userData.id;
      const mockBody = {};

      try {
        await markCheckListValue(mockUserId, mockBody);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerError);
      }
    });
  });

  describe('No  Checklist Value provided in body', () => {
    it('should throw an error', async () => {
      const mockUserId = userData.id;
      const mockBody = {
        checklist_id: mockUserCheckList.checklist_id,
        checklist_value: '',
      };

      try {
        await markCheckListValue(mockUserId, mockBody);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerError);
      }
    });
  });
});

describe('getCheckListValue Repository', () => {
  const mockCheckList = checkListFactory.build();
  const mockUserCheckList = userCheckListFactory.build();
  const userData = userFactory.build();

  describe('successfull call', () => {
    it('should return user Checklist list', async () => {
      const userData = userFactory.build();
      const checkListFactoryData = checkListFactory.build();

      const mockData = [
        {
          id: userData.id,
          status: 'active',
          CheckLists: [
            {
              id: userData.id,
              checklist_title: checkListFactoryData.checklist_title,
              type: checkListFactoryData.type,
              UserCheckLists: {
                id: userData.id,
                checklist_value: false,
              },
            },
          ],
        },
      ];

      jest.spyOn(Users, 'findByPk').mockResolvedValueOnce(mockData);
    });
  });
  describe('No userId provided', () => {
    it('should throw error', async () => {
      try {
        await getCheckListValue();
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });
});
