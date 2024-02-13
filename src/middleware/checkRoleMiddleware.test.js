const verifyRole = require('../utils/roleAccess');
const errorMessage = require('../utils/errorMessage');
const checkRole = require('./checkRoleMiddleware');
const { UnauthorizedRequestError } = require('../utils/customException');

jest.mock('../utils/roleAccess');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Test checkRole Middleware.', () => {
  // mock values.
  const mockRequest = {
    user: {
      email: 'vaishali.buch@techholding.co',
    },
  };
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
  const next = jest.fn();

  describe('User for provided email has one of role from multiple roles argument.', () => {
    it('Should invoke next function.', async () => {
      // mock values.
      const roles = ['HR Manager', 'Admin', 'Manager'];
      verifyRole.mockResolvedValue(true);

      const checkRoleMiddleware = checkRole(roles);
      await checkRoleMiddleware(mockRequest, mockResponse, next);

      //expected behaviours
      expect(verifyRole).toHaveBeenCalledWith(roles, mockRequest.user.email);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('User for provided email has role same as roles argument.', () => {
    it('Should invoke next function.', async () => {
      // mock values.
      const roles = ['HR Manager'];
      verifyRole.mockResolvedValue(true);

      const checkRoleMiddleware = checkRole(roles);
      await checkRoleMiddleware(mockRequest, mockResponse, next);

      //expected behaviours
      expect(verifyRole).toHaveBeenCalledWith(roles, mockRequest.user.email);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('User for provided email does not have one of role from roles argument.', () => {
    it('Should return false.', async () => {
      // mock values.
      const roles = ['HR Manager', 'Admin', 'Manager'];
      verifyRole.mockResolvedValue(false);

      try {
        const checkRoleMiddleware = checkRole(roles);
        await checkRoleMiddleware(mockRequest, mockResponse, next);
      } catch (err) {
        expect(error.message).toBe(errorMessage.statusCode401);
      }

      //expected behaviours
      expect(verifyRole).toHaveBeenCalledWith(roles, mockRequest.user.email);
    });
  });

  describe('User for provided email does not exist in database.', () => {
    it('Should throw 401 error.', async () => {
      // mock values.
      const expectedError = new UnauthorizedRequestError(
        errorMessage.statusCode401
      );
      const roles = ['HR Manager', 'Admin', 'Manager'];
      verifyRole.mockRejectedValue(expectedError);

      try {
        const checkRoleMiddleware = checkRole(roles);
        await checkRoleMiddleware(mockRequest, mockResponse, next);
      } catch (error) {
        expect(error.message).toBe(errorMessage.statusCode401);
      }

      // expected behaviours
      expect(verifyRole).toHaveBeenCalledWith(roles, mockRequest.user.email);
      expect(verifyRole).rejects.toThrow(expectedError);
    });
  });
});
