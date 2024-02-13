const model = require('../../database/models');
const softwareRepository = require('./softwareRepository');
const softwareFactory = require('../../factories/software');
const userSoftwareFactory = require('../../factories/userSoftware');
const userFactory = require('../../factories/user');
const { getAllSoftwares } = require('./softwareRepository');
const {
  NotFoundError,
  InternalServerError,
} = require('../../utils/customException');
const clientFactory = require('../../factories/clients');
const { getAllClient } = require('./softwareRepository');

const Software = model.Softwares;
const userSoftwares = model.UserSoftwares;
const User = model.Users;
const Clients = model.Clients;
const SoftwareManager = model.SoftwareManagers;
const { createSoftware, updateSoftware } = require('./softwareRepository');
const softwareManagerFactory = require('../../Factories/softwareManager');
const req = { user: { email: 'techholding@techholding.co' } };
beforeEach(() => {
  jest.clearAllMocks();
});

describe('getSoftwareById', () => {
  test('returns software object when given a valid id', async () => {
    const mockSoftware = softwareFactory.build();
    jest.spyOn(Software, 'findByPk').mockResolvedValueOnce(mockSoftware);

    const softwareId = softwareFactory.build();
    const result = await softwareRepository.getSoftwareById(softwareId);

    expect(result).toEqual(mockSoftware);
  });

  test('throws an error when given an invalid id', async () => {
    jest.spyOn(Software, 'findByPk').mockResolvedValueOnce(null);

    const softwareId = softwareFactory.build();
    await expect(
      softwareRepository.getSoftwareById(softwareId)
    ).rejects.toThrow(NotFoundError.message);
  });

  test('throws an error when an unexpected error occurs', async () => {
    jest.spyOn(Software, 'findByPk').mockImplementationOnce(() => {
      throw new Error(InternalServerError.message);
    });

    const softwareId = 1;
    await expect(
      softwareRepository.getSoftwareById(softwareId)
    ).rejects.toThrow(InternalServerError.message);
  });
});

describe('createSoftware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should add new Software successfully', async () => {
    const body = {
      dataValues: { ...softwareFactory.build(), Client: {} },
      managed_by: [1],
    };
    const clientBody = clientFactory.build(10);
    const softwareManagerBody = softwareManagerFactory.build();
    const userBody = userFactory.build();
    const transactionInstance = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    const transactionSpy = jest
      .spyOn(model.sequelize, 'transaction')
      .mockResolvedValueOnce(transactionInstance);

    const createSpyClient = jest
      .spyOn(Clients, 'findOrCreate')
      .mockResolvedValueOnce([{ clientBody }, true]);
    const createSpy = jest
      .spyOn(Software, 'create')
      .mockResolvedValueOnce(body);
    const createSpyUser = jest
      .spyOn(User, 'findByPk')
      .mockResolvedValue(userBody);
    jest.spyOn(userSoftwares, 'create').mockResolvedValue();
    const createSpySoftwareManager = jest
      .spyOn(SoftwareManager, 'create')
      .mockResolvedValueOnce(softwareManagerBody);
    const result = await createSoftware(body);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(body);
  });

  it('should throw an error if there is an issue creating new software', async () => {
    const body = {
      dataValues: { ...softwareFactory.build(), Client: {} },
      managed_by: [1],
    };
    const clientBody = clientFactory.build(10);
    const softwareManagerBody = softwareManagerFactory.build();
    const userBody = userFactory.build();
    const transactionInstance = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    const transactionSpy = jest
      .spyOn(model.sequelize, 'transaction')
      .mockResolvedValueOnce(transactionInstance);
    const createSpyClient = jest
      .spyOn(Clients, 'findOrCreate')
      .mockResolvedValueOnce([{ clientBody }, true]);
    const createSpy = jest
      .spyOn(Software, 'create')
      .mockRejectedValueOnce(new InternalServerError('Database error'));
    const createSpyUser = jest
      .spyOn(User, 'findByPk')
      .mockRejectedValueOnce(userBody);
    const createSpySoftwareManager = jest
      .spyOn(SoftwareManager, 'create')
      .mockRejectedValueOnce(softwareManagerBody);

    await expect(createSoftware(body)).rejects.toThrow('Database error');
    expect(createSpy).toHaveBeenCalledTimes(1);
  });
});

describe('updateSoftware', () => {
  it('should update existing software successfully', async () => {
    const existingSoftware = softwareFactory.build({ managed_by: [1] });
    const body = existingSoftware;
    const clientBody = clientFactory.build(10);
    const softwareManagerBody = softwareManagerFactory.build();
    const userBody = userFactory.build();
    const id = 1;
    const userEmail = body.createdBy;

    const expectedPayload = {
      ...body,
      updatedAt: expect.any(Date()),
      updatedBy: userEmail,
    };
    const expectedUpdatedSoftware = {
      id,
      ...expectedPayload,
      managed_by: [softwareManagerBody.id],
    };

    const transactionInstance = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    const transactionSpy = jest
      .spyOn(model.sequelize, 'transaction')
      .mockResolvedValueOnce(transactionInstance);

    jest
      .spyOn(Clients, 'findOrCreate')
      .mockResolvedValue([{ clientBody }, true]);
    jest.spyOn(Software, 'findByPk').mockResolvedValue(existingSoftware);
    jest
      .spyOn(Software, 'update')
      .mockResolvedValue([1, [expectedUpdatedSoftware]]);
    jest.spyOn(userSoftwares, 'findOrCreate').mockResolvedValue();
    jest.spyOn(SoftwareManager, 'findAll').mockResolvedValue([]);
    jest.spyOn(SoftwareManager, 'destroy').mockResolvedValue(undefined);
    jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 3, name: 'User 3' });
    jest.spyOn(SoftwareManager, 'create').mockResolvedValue(undefined);

    const updatedSoftware = await updateSoftware(id, body, userEmail);

    expect(Clients.findOrCreate).toHaveBeenCalledTimes(1);

    expect(Software.update).toHaveBeenCalled();

    expect(User.findByPk).toHaveBeenCalled();
    expect(SoftwareManager.create).toHaveBeenCalledWith(
      {
        software_id: id,
        manager_id: existingSoftware.managed_by[0],
      },
      { transaction: transactionInstance }
    );

    expect(updatedSoftware).toEqual(expectedUpdatedSoftware);
  });
});

describe('deleteSoftware', () => {
  it('should update the software and UserSoftwares tables with the deletedBy and deletedAt fields', async () => {
    const softwareMock = softwareFactory.build();
    const softwareId = softwareMock.id;
    const softwareUpdateSpy = jest
      .spyOn(Software, 'update')
      .mockResolvedValueOnce(softwareFactory);
    const UserSoftwaresUpdateSpy = jest
      .spyOn(userSoftwares, 'update')
      .mockResolvedValueOnce(softwareFactory);
    const email = 'techholding@email.com';
    const result = await softwareRepository.deleteSoftware(softwareId, email);

    expect(result).toEqual('Software Deleted');
    expect(softwareUpdateSpy).toHaveBeenCalledWith(
      {
        deletedBy: email,
        deletedAt: expect.any(Date),
      },
      { where: { id: softwareId } }
    );
    expect(UserSoftwaresUpdateSpy).toHaveBeenCalledWith(
      {
        deletedBy: email,
        deletedAt: expect.any(Date),
      },
      { where: { software_id: softwareId } }
    );
  });

  it('should throw NotFoundError if software not found', async () => {
    Software.update.mockResolvedValue([0]);
    userSoftwares.update.mockResolvedValue([0]);

    await expect(softwareRepository.deleteSoftware(1)).rejects.toThrow(
      NotFoundError
    );
  });
});

describe('getAllSoftwares', () => {
  const page = 1;
  const pageSize = 10;
  const softwares = softwareFactory.build();
  const totalPages = 5;
  const currentPage = 1;
  const totalResults = 50;
  const status = 'active';
  const orderBy = 'name';
  const order = 'ASC';
  const searchText = '';

  it('should return softwares, totalPages, currentPage, and totalResults', async () => {
    const findAllMock = jest
      .spyOn(Software, 'findAll')
      .mockResolvedValue(softwares);

    const countMock = jest
      .spyOn(Software, 'count')
      .mockResolvedValue(totalResults);

    const result = await getAllSoftwares({
      page,
      pageSize,
      status,
      orderBy,
      order,
      searchText,
    });
    expect(findAllMock).toHaveBeenCalled();
    expect(countMock).toHaveBeenCalled();
    expect(result).toEqual({
      softwares,
      totalPages,
      currentPage,
      totalResults,
    });
  });
});

describe('Testing getSoftwareUsers.', () => {
  const mockSoftwareId = { softwareId: 1 };
  describe('When incorrect software id provided', () => {
    it('Should throw Error.', async () => {
      jest.spyOn(Software, 'findByPk').mockResolvedValueOnce(null);

      await expect(
        softwareRepository.getSoftwareUsers(mockSoftwareId)
      ).rejects.toThrow();
    });
  });

  describe('When correct software id provided.', () => {
    const mockSoftwareResponse = softwareFactory.build({
      id: mockSoftwareId.softwareId,
    });

    describe('When 1 User assigned to software.', () => {
      it('Should return array of users.', async () => {
        const mockUserSoftwareResponse1 = userSoftwareFactory.build({
          softwareId: mockSoftwareResponse.id,
        });
        const mockUserResponse = userFactory.build({
          id: mockUserSoftwareResponse1.user_id,
        });
        mockUserSoftwareResponse1.User = mockUserResponse;
        jest
          .spyOn(Software, 'findByPk')
          .mockResolvedValue(mockSoftwareResponse);
        jest
          .spyOn(userSoftwares, 'findAll')
          .mockResolvedValue([mockUserSoftwareResponse1]);

        const response = await softwareRepository.getSoftwareUsers(
          mockSoftwareId
        );

        expect(response).toEqual([mockUserSoftwareResponse1]);
      });
    });

    describe('When 2 Users assigned to software.', () => {
      it('Should return array of users.', async () => {
        const mockUserSoftwareResponse1 = userSoftwareFactory.build({
          softwareId: mockSoftwareResponse.id,
        });
        const mockUserSoftwareResponse2 = userSoftwareFactory.build({
          softwareId: mockSoftwareResponse.id,
        });
        const mockUserResponse1 = userFactory.build({
          id: mockUserSoftwareResponse1.user_id,
        });
        const mockUserResponse2 = userFactory.build({
          id: mockUserSoftwareResponse2.user_id,
        });
        mockUserSoftwareResponse1.User = mockUserResponse1;
        mockUserSoftwareResponse2.User = mockUserResponse2;
        jest
          .spyOn(Software, 'findByPk')
          .mockResolvedValue(mockSoftwareResponse);
        jest
          .spyOn(userSoftwares, 'findAll')
          .mockResolvedValue([
            mockUserSoftwareResponse1,
            mockUserSoftwareResponse2,
          ]);

        const response = await softwareRepository.getSoftwareUsers(
          mockSoftwareId
        );

        expect(response).toEqual([
          mockUserSoftwareResponse1,
          mockUserSoftwareResponse2,
        ]);
      });
    });

    describe('When no users assigned to software.', () => {
      it('Should return empty array.', async () => {
        jest
          .spyOn(Software, 'findByPk')
          .mockResolvedValueOnce(mockSoftwareResponse);
        jest.spyOn(userSoftwares, 'findAll').mockResolvedValueOnce([]);
        jest
          .spyOn(User, 'findByPk')
          .mockResolvedValueOnce({ dataValues: null });

        expect(
          await softwareRepository.getSoftwareUsers(mockSoftwareId)
        ).toEqual([]);
      });
    });
  });
});
describe('getSoftwaresByClient', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return an array of software names for a valid client ID', async () => {
    const mockSoftware = softwareFactory.build();
    const clientId = mockSoftware.client_id;
    jest.spyOn(Software, 'findAll').mockResolvedValueOnce(mockSoftware.name);
    const response = await softwareRepository.getSoftwaresByClient(clientId);
    expect(response).toEqual(mockSoftware.name);
    expect(Software.findAll).toHaveBeenCalledTimes(1);
  });

  it('should throw an empty array if id not exists', async () => {
    const clientId = clientFactory.build();
    jest.spyOn(Software, 'findAll').mockResolvedValueOnce([]);
    const response = await softwareRepository.getSoftwaresByClient(clientId);

    expect(response).toEqual([]);
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getAllClients Repository', () => {
  const clientList = clientFactory.buildList(10);

  describe('getAllClients Success', () => {
    it('should return all clients list', async () => {
      const mockClients = clientList.map((client) => {
        return { id: client.id, name: client.name };
      });

      jest.spyOn(Clients, 'findAll').mockResolvedValueOnce(mockClients);

      const clients = await getAllClient();
      expect(clients).toEqual(mockClients);
      expect(Clients.findAll).toHaveBeenCalledTimes(1);
    });
  });
});

describe('getAllClients Failure', () => {
  it('should throw an error if findAll method fails', async () => {
    const error = new Error('Database connection error');
    jest.spyOn(Clients, 'findAll').mockRejectedValueOnce(error);

    await expect(getAllClient()).rejects.toThrowError(error);
    expect(Clients.findAll).toHaveBeenCalledTimes(1);
  });
});
