const { getUserRoleByEmail } = require('../domain/user/userRepository');
const errorMessage = require('./errorMessage');
const verifyRole = require('./roleAccess');

jest.mock('../domain/user/userRepository');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('test verifyRole().', () => {
  const email = 'vaishali.buch@techholding.co';
  const roles = ['HR Manager', 'Admin', 'Manager'];

  describe('User for provided email has one of role from roles argument.', () => {
    it('Should return true.', async () => {
      getUserRoleByEmail.mockResolvedValue('HR Manager');
      const isAuthenticated = await verifyRole(roles, email);

      //expected behaviours
      expect(getUserRoleByEmail).toHaveBeenCalledWith(email);
      expect(isAuthenticated).toBe(true);
    });
  });

  describe('User for provided email does not have one of role from roles argument.', () => {
    it('Should return false.', async () => {
      getUserRoleByEmail.mockResolvedValue('Employee');
      const isAuthenticated = await verifyRole(roles, email);

      //expected behaviours
      expect(getUserRoleByEmail).toHaveBeenCalledWith(email);
      expect(isAuthenticated).toBe(false);
    });
  });

  describe('User for provided email does not exist in database.', () => {
    const expectedError = new Error(errorMessage.statusCode401);

    it('Should throw 401 error.', async () => {
      getUserRoleByEmail.mockRejectedValue(expectedError);
      try {
        const isAuthenticated = await verifyRole(roles, email);
      } catch (error) {
        //expected behaviours
        expect(error.message).toBe(errorMessage.statusCode401);
      }

      expect(getUserRoleByEmail).toHaveBeenCalledWith(email);
      expect(getUserRoleByEmail).rejects.toThrow(expectedError);
      expect(verifyRole).rejects.toThrow(expectedError);
    });
  });
});
