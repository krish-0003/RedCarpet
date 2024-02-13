const {
  getUsers,
  getPendingUsersCount,
  getUserById,
  deleteUser,
  updateUser,
  addUser,
  addMultipleUser,
} = require('./userRepository');
const model = require('../../database/models');
const userFactory = require('../../factories/user');
const userRepository = require('./userRepository');
const softwareFactory = require('../../factories/software');
const userSoftwareFactory = require('../../factories/userSoftware');
const historyFactory = require('../../factories/history');
const { getUserHistoryById } = require('../../domain/user/userRepository');
const {
  NotFoundError,
  BadRequestError,
} = require('../../utils/customException');
const { changeStatusByUserId } = require('./userRepository');

const software = model.Softwares;
const userSoftware = model.UserSoftwares;
const user = model.Users;
const history = model.Histories;
const users = model.Users;
const agencies = model.Agencies;
const branches = model.Branches;

const mockData = historyFactory.buildList(2);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('add a new user with provided body', async () => {
    const body = userFactory.build();
    delete body.id;

    jest.spyOn(agencies, 'findOrCreate').mockImplementation(() => {
      return { id: 1 };
    });
    const spyCreateUser = jest.spyOn(users, 'create').mockImplementation(() => {
      return body;
    });
    const newUser = await addUser(body);
    expect(spyCreateUser).toHaveBeenCalled();

    expect(newUser).toEqual(body);
  });

  it('should return an error response when with error message', async () => {
    const body = userFactory.build();
    delete body.id;

    const spyCreateUser = jest.spyOn(users, 'create').mockResolvedValue(null);

    expect(await addUser(body)).toEqual(null);
    expect(spyCreateUser).toHaveBeenCalled();
  });
});
describe('updateUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  let existUser = userFactory.build();
  existUser = {
    ...existUser,
    branch_id: 1,
  };
  let demobranch = {
    id: 1,
    name: 'Example Branch',
  };
  const userEmail = 'demo@gmail.com';

  let body = userFactory.build();
  body = {
    dataValues: {
      ...body,
      branch_id: 1,
      updated_by: userEmail,
      agency_id: null,
    },
  };
  const updatedBody = {
    ...body,
    Branch: {
      id: 1,
      name: 'Example Branch',
    },
  };
  it('should update an existing user with provided body', async () => {
    const spyUpdateUser = jest
      .spyOn(users, 'update')
      .mockResolvedValue([1, [body]]);
    const spyFindUser = jest
      .spyOn(users, 'findByPk')
      .mockResolvedValueOnce(existUser);

    jest.spyOn(agencies, 'findOrCreate').mockImplementation(() => {
      return { id: 1 };
    });
    const spyFindBranch = jest
      .spyOn(branches, 'findOne')
      .mockResolvedValueOnce(demobranch);
    const response = await updateUser(body.id, body, userEmail);
    const updatedResponse = {
      dataValues: response,
    };
    expect(spyFindUser).toHaveBeenCalledTimes(1);
    expect(spyUpdateUser).toHaveBeenCalledTimes(1);
    expect(spyFindBranch).toHaveBeenCalledTimes(1);
    const expectedResponse = {
      dataValues: {
        ...updatedBody.dataValues,
        Branch: {
          id: 1,
          name: 'Example Branch',
        },
      },
    };
    expect(updatedResponse).toEqual(expectedResponse);
  });

  it('throw a error when we dont find user with provided userId', async () => {
    const body = userFactory.build();

    const spyFindUser = jest
      .spyOn(users, 'findByPk')
      .mockResolvedValueOnce(null);

    await expect(updateUser(body.id, body)).rejects.toThrow();
    expect(spyFindUser).toHaveBeenCalled();
  });

  it('should throw an error if there is an error while updating user', async () => {
    const spyFindUser = jest
      .spyOn(users, 'findByPk')
      .mockResolvedValueOnce(existUser);

    const errorMock = {
      parent: { message: 'some error message' },
      fields: ['name'],
    };
    const spyUpdateUser = jest
      .spyOn(users, 'update')
      .mockRejectedValueOnce(errorMock);

    await expect(updateUser(body.id, body)).rejects.toThrow();

    expect(spyFindUser).toHaveBeenCalled();
    expect(spyUpdateUser).toHaveBeenCalled();
  });
});

describe('getUsers', () => {
  it('should return a list of users based on the given parameters', async () => {
    const data = userFactory.buildList(3);
    const spyUserCount = jest.spyOn(users, 'count').mockResolvedValueOnce(6);
    const spyCreateUser = jest.spyOn(users, 'findAll').mockResolvedValue(data);

    const result = await getUsers({
      serachText: 'Vaibhav',
      location: 'Ahemdabad',
      status: 'active',
      orderBy: 'id',
      order: 'ASC',
      workAllocation: 40,
      resultsPerPage: 10,
      page: 1,
    });

    expect(spyCreateUser).toHaveBeenCalled();
    expect(spyUserCount).toHaveBeenCalled();
    expect(result).toHaveProperty('totalResults');
    expect(result.totalResults).toBeGreaterThanOrEqual(0);
    expect(result.user).toBeInstanceOf(Array);
    expect(result).toHaveProperty('currentPage');
    expect(result.currentPage).toBe(1);
  });

  it('should return all users if no parameters are provided', async () => {
    const data = userFactory.buildList(3);
    const spyUserCount = jest.spyOn(users, 'count').mockResolvedValueOnce(6);
    const spyFindAllUser = jest.spyOn(users, 'findAll').mockResolvedValue(data);
    const result = await getUsers({});

    expect(spyFindAllUser).toHaveBeenCalled();
    expect(result.user).toBeInstanceOf(Array);
    expect(result).toHaveProperty('currentPage');
    expect(result.currentPage).toBe(1);
  });
});

describe('getUserById', () => {
  test('returns user object when given a valid id with agency details ', async () => {
    const mockUser = userFactory.build();

    jest.spyOn(users, 'findByPk').mockResolvedValueOnce(mockUser);

    jest.spyOn(agencies, 'findByPk').mockResolvedValueOnce({
      agency_name: 'agencyname',
      email: 'agencyEmail',
    });

    const userId = 1;
    const result = await getUserById(userId);
    expect(result).toEqual(mockUser);
  });
  test('returns user object when given a valid id', async () => {
    const mockUser = userFactory.build();
    delete mockUser.agency_id;

    jest.spyOn(users, 'findByPk').mockResolvedValueOnce(mockUser);

    const userId = 1;
    const result = await getUserById(userId);
    expect(result).toEqual(mockUser);
  });

  test('throws an error when given an invalid id', async () => {
    jest.spyOn(users, 'findByPk').mockResolvedValueOnce(null);

    const { id } = userFactory.build();

    await expect(getUserById(id)).rejects.toThrow(NotFoundError.message);
  });
});
describe('deleteUser', () => {
  it('should update the users deletedBy and deletedAt fields', async () => {
    const { id, deletedBy } = userFactory.build();
    const user = userFactory.build({ id });
    const mockUserSave = jest.fn().mockReturnValue();
    user.save = await mockUserSave;
    jest.spyOn(users, 'findByPk').mockResolvedValueOnce(user);
    expect();

    const result = await deleteUser(id);

    expect(result).toEqual(id);
  });
  it('should throw an error if the User delete fails', async () => {
    const { id } = userFactory.build();

    const userUpdateSpy = jest
      .spyOn(users, 'findByPk')
      .mockRejectedValueOnce(new Error('Something went wrong'));

    await expect(deleteUser(id)).rejects.toThrow('Something went wrong');
    expect(userUpdateSpy).toHaveBeenCalled();
  });
});

describe('Testing getUserSoftwares.', () => {
  const mockUserId = { userId: 1 };

  describe('When incorrect user id provided', () => {
    it('Should throw Error.', async () => {
      jest.spyOn(user, 'findByPk').mockResolvedValueOnce(null);

      await expect(
        userRepository.getUserSoftwares(mockUserId)
      ).rejects.toThrow();
    });
  });

  describe('When correct user id provided.', () => {
    const mockUserResponse = userFactory.build({
      id: mockUserId.userId,
    });

    describe('When 1 Software assigned to User.', () => {
      it('Should return array of 1 software object.', async () => {
        const mockUserSoftwareResponse = userSoftwareFactory.build({
          user_id: mockUserResponse.id,
        });
        const mockSoftwareResponse = softwareFactory.build({
          id: mockUserSoftwareResponse.software_id,
        });
        (mockUserSoftwareResponse.Software = {
          ...mockSoftwareResponse,
          SoftwareAlias: [],
          dataValues: { managed_by: [] },
        }),
          (mockUserSoftwareResponse.dataValues = {
            Software: { dataValues: { SoftwareAlias: {} } },
          });
        jest.spyOn(user, 'findByPk').mockResolvedValue(mockUserResponse);
        jest
          .spyOn(userSoftware, 'findAll')
          .mockResolvedValue([mockUserSoftwareResponse]);

        const response = await userRepository.getUserSoftwares(mockUserId);

        expect(response).toEqual([mockUserSoftwareResponse]);
      });
    });

    describe('When 2 software assigned to user.', () => {
      it('Should return array of 2 software object.', async () => {
        const firstMockUserSoftwareResponse = userSoftwareFactory.build({
          user_id: mockUserResponse.id,
        });
        const secondMockUserSoftwareResponse = userSoftwareFactory.build({
          user_id: mockUserResponse.id,
        });
        const firstMockSoftwareResponse = softwareFactory.build({
          id: firstMockUserSoftwareResponse.software_id,
        });
        const secondMockSoftwareResponse = softwareFactory.build({
          id: secondMockUserSoftwareResponse.software_id,
        });
        firstMockUserSoftwareResponse.Software = {
          ...firstMockSoftwareResponse,
          SoftwareAlias: [],
          dataValues: { managed_by: [] },
        };
        secondMockUserSoftwareResponse.Software = {
          ...secondMockSoftwareResponse,
          SoftwareAlias: [],
          dataValues: { managed_by: [] },
        };
        firstMockUserSoftwareResponse.dataValues = {
          Software: { dataValues: { SoftwareAlias: {} } },
        };
        secondMockUserSoftwareResponse.dataValues = {
          Software: { dataValues: { SoftwareAlias: {} } },
        };
        jest.spyOn(user, 'findByPk').mockResolvedValue(mockUserResponse);
        jest
          .spyOn(userSoftware, 'findAll')
          .mockResolvedValue([
            firstMockUserSoftwareResponse,
            secondMockUserSoftwareResponse,
          ]);

        const response = await userRepository.getUserSoftwares(mockUserId);

        expect(response).toEqual([
          firstMockUserSoftwareResponse,
          secondMockUserSoftwareResponse,
        ]);
      });
    });

    describe('When no software assigned to user.', () => {
      it('Should return empty array.', async () => {
        jest.spyOn(user, 'findByPk').mockResolvedValueOnce(mockUserResponse);
        jest.spyOn(userSoftware, 'findAll').mockResolvedValueOnce([]);
        jest
          .spyOn(software, 'findByPk')
          .mockResolvedValueOnce({ dataValues: null });

        expect(await userRepository.getUserSoftwares(mockUserId)).toEqual([]);
      });
    });
  });
});

describe('getUserHistoryById', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return user history for valid id', async () => {
    // Mock Audits.findAll to return some sample data
    const auditFindAllMock = jest
      .spyOn(history, 'findAll')
      .mockResolvedValue(mockData);
    const findByPkMock = jest
      .spyOn(user, 'findByPk')
      .mockResolvedValue(mockData);

    const result = await getUserHistoryById({ userId: mockData.id, limit: 10 });

    expect(result).toEqual(mockData);
    expect(auditFindAllMock).toHaveBeenCalledTimes(1);
    expect(auditFindAllMock).toHaveBeenCalledWith({
      where: { user_id: mockData.id },
      raw: true,
      order: [['timestamp', 'DESC']],
      limit: 10,
    });
  });

  it('should throw 500 error for database error', async () => {
    // Mock Audits.findAll to throw an error
    const auditFindAllMock = jest
      .spyOn(history, 'findAll')
      .mockRejectedValue(new Error('Database error'));
    const findByPkMock = jest
      .spyOn(user, 'findByPk')
      .mockResolvedValue(mockData[0]);
    await expect(
      getUserHistoryById({ userId: mockData[0].id, limit: 10 })
    ).rejects.toThrow();
    expect(auditFindAllMock).toHaveBeenCalled();
  });

  test('should throw 404 error for null result', async () => {
    const mockId = 1;

    const findByPkMock = jest.spyOn(user, 'findByPk').mockResolvedValue(null);

    // Expect the function to throw a NotFoundError with a specific message
    await expect(getUserHistoryById(mockId)).rejects.toThrow(NotFoundError);

    // Expect the findAll method to have been called with specific arguments
    expect(findByPkMock).toHaveBeenCalled();
  });
});

describe('changeStatusByUserId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    id = 1;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  let id;

  it('should throw an error if no id is provided', async () => {
    id = null;
    await expect(changeStatusByUserId(id)).rejects.toThrow(NotFoundError);
  });

  it('should update the user status to active if it is pending ', async () => {
    const mockBody = userFactory.build({ id: 1 });
    mockBody.status = 'pending';
    const findUser = jest.spyOn(user, 'findByPk').mockResolvedValue(mockBody);
    const updatedBody = { ...mockBody, status: 'active' };
    const updateUser = jest
      .spyOn(user, 'update')
      .mockResolvedValueOnce(updatedBody);
    const mockCurrentUser = {
      name: 'fake name',
      userId: 1,
    };
    const result = await changeStatusByUserId(mockBody.id, mockCurrentUser);

    expect(findUser).toHaveBeenCalledWith(mockBody.id);
    expect(updateUser).toHaveBeenCalledWith(
      {
        status: 'active',
      },
      {
        where: { id: 1 },
        individualHooks: true,
        userObj: {
          name: mockCurrentUser.name,
          userId: mockCurrentUser.userId,
        },
      }
    );
    expect(result).toEqual(updatedBody);
  });

  it('should return response if status is already active', async () => {
    const mockBody = userFactory.build();
    mockBody.status = 'active';
    const findUser = jest.spyOn(user, 'findByPk').mockResolvedValue(mockBody);

    await expect(changeStatusByUserId(id)).rejects.toThrow(BadRequestError);
    expect(findUser).toHaveBeenCalled();
  });
});

describe('addMultipleUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create multiple users and return them', async () => {
    const body = userFactory.build();
    delete body.id;
    const userObj = {
      name: 'demo',
      email: 'demo@gmail.com',
    };
    const createdUsers = jest
      .spyOn(user, 'bulkCreate')
      .mockImplementation(() => {
        return [body];
      });
    const result = await addMultipleUser([body], userObj);

    expect(createdUsers).toHaveBeenCalledWith([body], { userObj });
    expect(result).toEqual([body]);
  });

  it('should throw a BadRequestError when a unique constraint error occurs', async () => {
    const body = userFactory.build();
    delete body.id;
    const userObj = {
      name: 'demo',
      email: 'demo@gmail.com',
    };
    user.bulkCreate = jest.fn().mockRejectedValue({
      name: 'SequelizeUniqueConstraintError',
      errors: [{ message: 'Email must be unique', path: 'email' }],
    });

    await expect(addMultipleUser(body, userObj)).rejects.toThrow(
      new BadRequestError('Email must be unique', 'email')
    );
    expect(user.bulkCreate).toHaveBeenCalledWith(body, { userObj });
  });

  it('should throw a BadRequestError with the appropriate error message and field', async () => {
    const body = userFactory.build();
    delete body.id;
    const userObj = {
      name: 'demo',
      email: 'demo@gmail.com',
    };
    user.bulkCreate = jest.fn().mockRejectedValue({
      parent: { message: 'Invalid input syntax for integer', code: '22P02' },
      fields: { id: '1' },
    });

    await expect(addMultipleUser(body, userObj)).rejects.toThrow(
      new BadRequestError('Invalid input syntax for integer', 'id')
    );
    expect(user.bulkCreate).toHaveBeenCalledWith(body, { userObj });
  });
});

describe('getPendingUsersCount', () => {
  describe('when branch Ids provided', () => {
    it('should return count of users with pending status', async () => {
      const mockBrachIds = [1, 2, 3];
      const mockReturnValue = 6;
      const spyUserCount = jest
        .spyOn(users, 'count')
        .mockResolvedValueOnce(mockReturnValue);
      const result = await getPendingUsersCount(mockBrachIds);

      expect(spyUserCount).toHaveBeenCalled();
      expect(result).toBe(mockReturnValue);
    });
  });

  describe('when branch Ids not provided', () => {
    it('should return count of users with pending status', async () => {
      const mockReturnValue = 6;
      const spyUserCount = jest
        .spyOn(users, 'count')
        .mockResolvedValueOnce(mockReturnValue);

      const result = await getPendingUsersCount();

      expect(spyUserCount).toHaveBeenCalled();
      expect(result).toBe(mockReturnValue);
    });
  });

  describe('when count method throws Error', () => {
    it('should throw Error', async () => {
      const mockBrachIds = [1, 2, 3];
      const spyUserCount = jest
        .spyOn(users, 'count')
        .mockRejectedValue(new Error('Database error'));
      await expect(getPendingUsersCount(mockBrachIds)).rejects.toThrow();
    });
  });
});
