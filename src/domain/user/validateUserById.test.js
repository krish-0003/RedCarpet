const model = require('../../database/models');
const userFactory = require('../../factories/user');
const { NotFoundError } = require('../../utils/customException');
const { validateUserById } = require('./validateUserById');

beforeEach(() => {
  jest.clearAllMocks();
});

const User = model.Users;

describe('validateUserById', () => {
  describe('successfull call', () => {
    it('should return count=1 for id', async () => {
      const userData = userFactory.build();

      jest.spyOn(User, 'count').mockResolvedValueOnce(1);

      await validateUserById(userData.id);

      expect(User.count).toHaveBeenCalledWith({ where: { id: userData.id } });
      expect(User.count).toHaveBeenCalledTimes(1);
    });
  });
  describe('User does not exists', () => {
    it('should throw error', async () => {
      const userData = userFactory.build();

      jest.spyOn(User, 'count').mockResolvedValueOnce(0);

      try {
        await validateUserById(userData.id);

        expect(User.count).toHaveBeenCalledWith({ where: { id: userData.id } });
        expect(User.count).toHaveBeenCalledTimes(1);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError);
      }
    });
  });
});
