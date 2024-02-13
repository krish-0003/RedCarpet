const { OAuth2Client } = require('google-auth-library');
const { getUserInfoByToken } = require('../middleware/authMiddleware');
const { login } = require('./authUser');
const model = require('../database/models');
const Tokens = model.Tokens;
const verifyRole = require('../utils/roleAccess');
const jwt = require('jsonwebtoken');
jest.mock('google-auth-library');
jest.mock('../middleware/authMiddleware');
jest.mock('../utils/roleAccess');

describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return a 200 status with the access token', async () => {
    const req = {
      body: {
        code: 'mock_code',
      },
      session: {
        refreshToken: '',
      },
    };
    const expectedData = {
      accessToken: 'encrypted_mock_access_token',
      refreshToken: 'encrypted_mock_refresh_token',
    };
    const tokens = {
      access_token: 'mock_access_token',
    };
    const mockGoogleClient = {
      getToken: jest.fn().mockResolvedValue({ tokens }),
    };
    const mockUserInfo = {
      id: 'mock_user_id',
      name: 'mock_user_name',
      email: 'mock_user_email',
    };
    jest.spyOn(Tokens, 'findOrCreate').mockResolvedValue([{}, true]);

    OAuth2Client.mockImplementation(() => mockGoogleClient);
    getUserInfoByToken.mockResolvedValue(mockUserInfo);
    verifyRole.mockResolvedValue(true);
    jest.spyOn(jwt, 'sign').mockResolvedValue(tokens.access_token);

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    await login(req, res);

    expect(mockGoogleClient.getToken).toHaveBeenCalledWith(req.body.code);
    expect(getUserInfoByToken).toHaveBeenCalledWith(tokens.access_token);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should return 400 status if there is bad request or user is not found or is null', async () => {
    const req = {
      body: {
        code: 'mock_code',
      },
    };

    const tokens = {
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
    };

    const mockGoogleClient = {
      getToken: jest.fn().mockResolvedValue({ tokens }),
    };
    OAuth2Client.mockImplementation(() => mockGoogleClient);
    getUserInfoByToken.mockResolvedValue(null);
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await expect(login(req, res)).rejects.toThrow();
  });

  it('should return a status 500 error when an error occurs', async () => {
    const req = { body: { code: 'test-code' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const tokens = {
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
    };
    const mockGoogleClient = {
      getToken: jest.fn().mockResolvedValue({ tokens }),
    };

    OAuth2Client.mockImplementation(() => mockGoogleClient);
    await expect(login(req, res)).rejects.toThrow();
  });
});
