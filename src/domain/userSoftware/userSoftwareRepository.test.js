const model = require('../../database/models');
const userSoftwareRepository = require('./userSoftwareRepository');
const softwareFactory = require('../../factories/software');
const userSoftwareFactory = require('../../factories/userSoftware');
const userFactory = require('../../factories/user');
const { userSoftwareStatus } = require('../../utils/strings');

const software = model.Softwares;
const userSoftware = model.UserSoftwares;
const softwareManagers = model.SoftwareManagers;
const user = model.Users;

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Testing addUserSoftwares.', () => {
  const currentUser = {
    req: {
      name: 'demo',
      id: 1,
    },
  };
  const mockArgument = [
    {
      user_id: 1,
      createdBy: 'fakeEmail@faker.com',
      status: userSoftwareStatus.pending,
      software_id: 1,
    },
    currentUser,
  ];

  describe('When correct user id provided.', () => {
    const mockUserResponse = {
      ...userFactory.build({
        id: mockArgument.userId,
      }),
      reqUserObj: {
        name: currentUser.name,
        userId: currentUser.userId,
      },
      status: 'active',
    };

    describe('When incorrect software id provided', () => {
      const mockResponse = {
        error: [
          {
            errorType: 'SoftwareNotFound',
            software_id: 1,
          },
        ],
        success: [],
      };
      it('Should send Error in response.', async () => {
        const userfindByPKMock = jest
          .spyOn(user, 'findByPk')
          .mockResolvedValue(mockUserResponse);
        jest.spyOn(software, 'findByPk').mockResolvedValueOnce(null);

        const response = await userSoftwareRepository.addUserSoftwares(
          [
            {
              user_id: 1,
              createdBy: 'fakeEmail@faker.com',
              status: userSoftwareStatus.pending,
              software_id: 1,
            },
          ],
          currentUser
        );
        expect(response).toEqual(mockResponse);
        userfindByPKMock.mockClear();
      });
    });

    describe('When correct software id provided.', () => {
      describe('When software does not have active status.', () => {
        const mockResponse = {
          error: [
            {
              errorType: 'SoftwareNotActive',
              software_id: 1,
            },
          ],
          success: [],
        };
        it('Should send Error in response.', async () => {
          jest
            .spyOn(software, 'findByPk')
            .mockResolvedValueOnce(
              softwareFactory.build({ status: 'offboarding' })
            );
          const response = await userSoftwareRepository.addUserSoftwares(
            [
              {
                user_id: 1,
                createdBy: 'fakeEmail@faker.com',
                status: userSoftwareStatus.pending,
                software_id: 1,
              },
            ],
            currentUser
          );
          expect(response).toEqual(mockResponse);
        });
      });
      const mockSoftwareResponse = {
        ...softwareFactory.build({ status: 'active' }),
        Managers: [
          { company_email: 'user1@example.com' },
          { company_email: 'user2@example.com' },
          { company_email: null },
          { company_email: 'user3@example.com' },
        ],
      };
      describe('When software already assigned to user with pending status.', () => {
        const mockUserSoftwareResponse = userSoftwareFactory.build({
          user_id: mockUserResponse.id,
          software_id: mockSoftwareResponse.id,
          status: userSoftwareStatus.pending,
        });
        const mockResponse = {
          error: [
            {
              errorType: 'SoftwareAlreadyRequested',
              software_id: 1,
            },
          ],
          success: [],
        };
        it('Should send Error in response.', async () => {
          jest
            .spyOn(software, 'findByPk')
            .mockResolvedValueOnce(mockSoftwareResponse);
          jest
            .spyOn(userSoftware, 'findOne')
            .mockResolvedValueOnce(mockUserSoftwareResponse);
          const response = await userSoftwareRepository.addUserSoftwares(
            [
              {
                user_id: 1,
                createdBy: 'fakeEmail@faker.com',
                status: userSoftwareStatus.pending,
                software_id: 1,
              },
            ],
            currentUser
          );
          expect(response).toEqual(mockResponse);
        });
      });
      describe('When software already assigned to user with active status.', () => {
        const mockResponse = {
          error: [
            {
              errorType: 'SoftwareAlreadyAssigned',
              software_id: 1,
            },
          ],
          success: [],
        };
        const mockUserSoftwareResponse = userSoftwareFactory.build({
          user_id: mockUserResponse.id,
          software_id: mockSoftwareResponse.id,
          status: userSoftwareStatus.active,
        });
        it('Should send Error in response.', async () => {
          jest
            .spyOn(software, 'findByPk')
            .mockResolvedValueOnce(mockSoftwareResponse);
          jest
            .spyOn(userSoftware, 'findOne')
            .mockResolvedValueOnce(mockUserSoftwareResponse);
          const response = await userSoftwareRepository.addUserSoftwares(
            [
              {
                user_id: 1,
                createdBy: 'fakeEmail@faker.com',
                status: userSoftwareStatus.pending,
                software_id: 1,
              },
            ],
            currentUser
          );
          expect(response).toEqual(mockResponse);
        });
      });
      describe('When software not assigned to user.', () => {
        const mockUserSoftware = userSoftwareFactory.build({
          user_id: mockUserResponse.id,
          software_id: mockSoftwareResponse.id,
          status: mockArgument.status,
          note: null,
          username: null,
        });
        const mockResponse = {
          error: [],
          success: [mockUserSoftware],
        };
        const mockManagerEmailList = [
          'user1@example.com',
          'user2@example.com',
          'user3@example.com',
        ];
        const mockMailData = [
          {
            managers: mockManagerEmailList,
            softwareName: mockSoftwareResponse.name,
          },
        ];

        it('Should add data in userSoftware table.', async () => {
          jest
            .spyOn(software, 'findByPk')
            .mockResolvedValueOnce(mockSoftwareResponse);
          jest.spyOn(userSoftware, 'findOne').mockResolvedValueOnce(null);
          jest
            .spyOn(userSoftware, 'bulkCreate')
            .mockResolvedValue([mockUserSoftware]);
          jest.spyOn(mockMailData, 'push').mockResolvedValueOnce(mockMailData);
          jest.spyOn(mockMailData, 'map').mockResolvedValueOnce();
          const response = await userSoftwareRepository.addUserSoftwares(
            [
              {
                user_id: 1,
                createdBy: 'fakeEmail@faker.com',
                status: userSoftwareStatus.pending,
                software_id: 1,
              },
            ],
            currentUser
          );
          expect(response).toEqual(mockResponse);
        });
      });
    });
  });
  describe('When incorrect user id provided', () => {
    it('Should throw error.', async () => {
      const userfindByPKMock = jest
        .spyOn(user, 'findByPk')
        .mockResolvedValueOnce(null);

      await expect(
        userSoftwareRepository.addUserSoftwares(mockArgument)
      ).rejects.toThrow();
      userfindByPKMock.mockClear();
    });
  });
});

describe('Testing updateUserSoftwares.', () => {
  describe('When wrong userSoftwareId provided', () => {
    const mockArgument = {
      userSoftwareId: '121',
      currentUserEmail: 'faker@fake.com',
      username: 'fakeUsername',
      status: userSoftwareStatus.active,
      note: 'fake note.',
    };
    it('Should throw Error.', async () => {
      jest.spyOn(userSoftware, 'findByPk').mockResolvedValueOnce(null);

      await expect(
        userSoftwareRepository.updateUserSoftwares(mockArgument)
      ).rejects.toThrow();
    });
  });

  describe('When cannot find software mapped for provided userSoftware id', () => {
    const mockArgument = {
      userSoftwareId: '121',
      currentUserEmail: 'faker@fake.com',
      username: 'fakeUsername',
      status: userSoftwareStatus.active,
      note: 'fake note.',
    };
    it('Should throw Error.', async () => {
      jest
        .spyOn(userSoftware, 'findByPk')
        .mockResolvedValueOnce(
          userSoftwareFactory.build({ status: userSoftwareStatus.pending })
        );
      jest.spyOn(software, 'findByPk').mockResolvedValueOnce(null);

      await expect(
        userSoftwareRepository.updateUserSoftwares(mockArgument)
      ).rejects.toThrow();
    });
  });

  describe('When api call is not from software manager', () => {
    const mockArgument = {
      userSoftwareId: '121',
      currentUserEmail: 'faker@fake.com',
      username: 'fakeUsername',
      status: userSoftwareStatus.active,
      note: 'fake note.',
    };
    it('Should throw Error.', async () => {
      jest
        .spyOn(userSoftware, 'findByPk')
        .mockResolvedValueOnce(
          userSoftwareFactory.build({ status: userSoftwareStatus.pending })
        );
      jest
        .spyOn(software, 'findByPk')
        .mockResolvedValueOnce(softwareFactory.build());

      await expect(
        userSoftwareRepository.updateUserSoftwares(mockArgument)
      ).rejects.toThrow();
    });
  });

  describe('When wrong status value provided', () => {
    const mockArgument = {
      userSoftwareId: '1',
      currentUserEmail: 'faker@fake.com',
      username: 'fakeUsername',
      status: 'wrongStatus',
      note: 'fake note.',
    };
    jest
      .spyOn(software, 'findByPk')
      .mockResolvedValue(
        softwareFactory.build({ managed_by: 'faker@fake.com' })
      );
    it('Should throw Error.', async () => {
      await expect(
        userSoftwareRepository.updateUserSoftwares(mockArgument)
      ).rejects.toThrow();
    });
  });

  describe('When same status update requested', () => {
    const mockArgument = {
      userSoftwareId: '121',
      currentUserEmail: 'faker@fake.com',
      username: 'fakeUsername',
      status: userSoftwareStatus.active,
      note: 'fake note.',
    };
    it('Should throw Error.', async () => {
      jest
        .spyOn(userSoftware, 'findByPk')
        .mockResolvedValueOnce(
          userSoftwareFactory.build({ status: userSoftwareStatus.active })
        );

      await expect(
        userSoftwareRepository.updateUserSoftwares(mockArgument)
      ).rejects.toThrow();
    });
  });

  describe('When status update requested againest the flow.', () => {
    const mockArgument = {
      userSoftwareId: '121',
      currentUserEmail: 'faker@fake.com',
      username: 'fakeUsername',
      status: userSoftwareStatus.active,
      note: 'fake note.',
    };
    it('Should throw Error.', async () => {
      jest
        .spyOn(userSoftware, 'findByPk')
        .mockResolvedValueOnce(
          userSoftwareFactory.build({ status: userSoftwareStatus.revoked })
        );

      await expect(
        userSoftwareRepository.updateUserSoftwares(mockArgument)
      ).rejects.toThrow();
    });
  });

  describe('When username not provided while assigning software.', () => {
    const mockArgument = {
      userSoftwareId: '121',
      currentUserEmail: 'faker@fake.com',
      username: null,
      status: userSoftwareStatus.active,
      note: 'fake note.',
    };
    it('Should throw Error.', async () => {
      jest
        .spyOn(userSoftware, 'findByPk')
        .mockResolvedValueOnce(
          userSoftwareFactory.build({ status: userSoftwareStatus.pending })
        );

      await expect(
        userSoftwareRepository.updateUserSoftwares(mockArgument)
      ).rejects.toThrow();
    });
  });

  describe('When status update successfull', () => {
    const mockArgument = {
      userSoftwareId: '121',
      currentUserEmail: 'faker@fake.com',
      username: 'fakeUsername',
      status: userSoftwareStatus.active,
      note: 'fake note.',
    };
    const mockUserSoftwareResponse = userSoftwareFactory.build({
      note: mockArgument.note,
      username: mockArgument.username,
      status: userSoftwareStatus.active,
    });
    it('Should update data in db.', async () => {
      jest.spyOn(userSoftware, 'findByPk').mockResolvedValueOnce(
        userSoftwareFactory.build({
          ...mockUserSoftwareResponse,
          status: userSoftwareStatus.pending,
        })
      );
      jest.spyOn(softwareManagers, 'findOne').mockResolvedValueOnce({});
      jest.spyOn(user, 'findByPk').mockResolvedValueOnce(
        userFactory.build({
          status: 'active',
        })
      );
      jest
        .spyOn(userSoftware, 'update')
        .mockResolvedValue([1, [mockUserSoftwareResponse]]);

      const response = await userSoftwareRepository.updateUserSoftwares(
        mockArgument
      );
      expect(response).toEqual(mockUserSoftwareResponse);
    });
  });
});

describe('deleteUserSoftwares', () => {
  userSoftware.findByPk = jest.fn((id) => {
    if (id === 1) {
      return {
        id: 1,
        status: 'pending',
        save: jest.fn(),
      };
    } else if (id === 2) {
      return {
        id: 2,
        status: 'active',
        save: jest.fn(),
      };
    } else if (id === 3) {
      return null;
    }
  });
  it('should delete user softwares and return success and errors', async () => {
    const userSoftwareIds = [1, 2, 3];
    const userEmail = 'user@example.com';

    const result = await userSoftwareRepository.deleteUserSoftwares(
      userSoftwareIds,
      userEmail
    );

    expect(result).toEqual({
      success: [
        {
          message: 'software deleted successfully',
          id: 1,
        },
        {
          message: 'software deleted successfully',
          id: 2,
        },
      ],
      error: [
        {
          errorType: 'UserSoftwareNotFound',
          id: 3,
        },
      ],
    });
  });
});
