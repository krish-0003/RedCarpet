const {
  addUserSoftwares: addUserSoftwaresEntry,
} = require('../../domain/userSoftware/userSoftwareRepository');
const { BadRequestError } = require('../../utils/customException');
const userSoftwareFactory = require('../../factories/userSoftware');
const { addUserSoftwares } = require('./addUserSoftwares');

jest.mock('../../domain/userSoftware/userSoftwareRepository');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Testing addUserSoftwares controller.', () => {
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };

  describe('When incorrect user id provided', () => {
    const mockRequest = {
      params: {
        userId: null,
      },
      user: {
        email: 'tech@techholding.co',
      },
    };
    it('Should throw Error.', async () => {
      await expect(
        addUserSoftwares(mockRequest, mockResponse)
      ).rejects.toThrow();
    });
  });

  describe('When correct user id provided.', () => {
    describe('When software id not provided', () => {
      const mockRequest = {
        params: {
          userId: 1,
        },
        user: {
          email: 'tech@techholding.co',
        },
        body: {
          softwareList: [
            {
              status: 'active',
            },
          ],
        },
      };

      it('Should throw Error.', async () => {
        addUserSoftwaresEntry.mockResolvedValueOnce({
          error: mockRequest.body.softwareList,
        });
        await addUserSoftwares(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalled();
      });
    });
    describe('When wrong status value sent.', () => {
      const mockRequest = {
        params: {
          userId: 1,
        },
        user: {
          email: 'tech@techholding.co',
        },
        body: {
          softwareList: [
            {
              softwareId: '1',
              status: 'fakeStatus',
            },
          ],
        },
      };

      it('Should throw Error.', async () => {
        addUserSoftwaresEntry.mockResolvedValueOnce({
          error: mockRequest.body.softwareList,
        });
        await addUserSoftwares(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalled();
      });
    });

    describe('when addUserSoftware successfully performs database operation.', () => {
      const mockRequest = {
        params: {
          userId: 1,
        },
        user: {
          email: 'tech@techholding.co',
        },
        body: {
          softwareList: [
            {
              softwareId: '1',
              status: 'active',
            },
          ],
        },
      };

      addUserSoftwaresEntry.mockResolvedValue(userSoftwareFactory.build());

      it('Should send response with statuscode 200.', async () => {
        addUserSoftwaresEntry.mockResolvedValueOnce({
          error: [],
          success: mockRequest.body.softwareList,
        });
        await addUserSoftwares(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalled();
      });
    });
  });
});
