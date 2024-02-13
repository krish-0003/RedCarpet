const moment = require('moment');
const model = require('../../database/models');
const userFactory = require('../../factories/user');
const userSoftwareFactory = require('../../factories/userSoftware');
const softwareFactory = require('../../factories/software');
const {
  sendRevokeSoftwareMail,
  sendAssignSoftwareMail,
} = require('./userSoftwareEmail');
const {
  revokeSoftwareEmail,
  assignSoftwareEmail,
} = require('../../utils/helpers/emailHelper');

const UserSoftwares = model.UserSoftwares;
const Software = model.Softwares;
const User = model.Users;

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('../../utils/helpers/emailHelper');

describe('sendRevokeSoftwareMail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  let mockUserSoftware = {
    ...userSoftwareFactory.build(),
    status: 'active',
    last_email_date: moment().subtract(2, 'days'),
    save: jest.fn().mockResolvedValue({}),
  };
  let mockUser = userFactory.build();
  let mockSoftware = {
    ...softwareFactory.build(),
    Managers: [
      { company_email: 'user1@example.com' },
      { company_email: 'user2@example.com' },
      { company_email: null },
      { company_email: 'user3@example.com' },
    ],
  };
  const mockUserSoftwareIds = [mockUserSoftware.id];

  describe('successfull call', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const req = {};
    it('should send an email', async () => {
      jest
        .spyOn(UserSoftwares, 'findByPk')
        .mockResolvedValueOnce(mockUserSoftware);
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser);
      jest.spyOn(Software, 'findByPk').mockResolvedValueOnce(mockSoftware);

      revokeSoftwareEmail.mockImplementation(
        jest.fn().mockResolvedValueOnce(true)
      );

      const { success, warning, error } = await sendRevokeSoftwareMail(req, {
        userSoftwareIds: mockUserSoftwareIds,
      });

      expect(success).toBeInstanceOf(Array);
      expect(success.length).toBe(1);
      expect(warning.length).toBe(0);
      expect(error.length).toBe(0);
      expect(success[0].userSoftwareId).toBe(mockUserSoftware.id);
      expect(success[0].code).toBe(200);
    });
  });
  describe('when mail is already sent in last 24 hours', () => {
    const req = {};
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should return warning', async () => {
      mockUserSoftware = { ...mockUserSoftware, last_email_date: moment() };
      jest
        .spyOn(UserSoftwares, 'findByPk')
        .mockResolvedValueOnce(mockUserSoftware);
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser);
      jest.spyOn(Software, 'findByPk').mockResolvedValueOnce(mockSoftware);

      const { success, warning, error } = await sendRevokeSoftwareMail(req, {
        userSoftwareIds: mockUserSoftwareIds,
      });

      expect(warning).toBeInstanceOf(Array);
      expect(success.length).toBe(0);
      expect(warning.length).toBe(1);
      expect(error.length).toBe(0);
      expect(warning[0].userSoftwareId).toBe(mockUserSoftware.id);
      expect(warning[0].code).toBe(429);
    });
  });
  describe('it should return error', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const req = {};
    it('when userSoftware not found', async () => {
      jest.spyOn(UserSoftwares, 'findByPk').mockResolvedValueOnce();

      const { success, warning, error } = await sendRevokeSoftwareMail(req, {
        userSoftwareIds: mockUserSoftwareIds,
      });

      expect(error).toBeInstanceOf(Array);
      expect(success.length).toBe(0);
      expect(warning.length).toBe(0);
      expect(error.length).toBe(1);
      expect(error[0].userSoftwareId).toBe(mockUserSoftware.id);
      expect(error[0].code).toBe(404);
    });

    it('when user not found', async () => {
      jest
        .spyOn(UserSoftwares, 'findByPk')
        .mockResolvedValueOnce(mockUserSoftware);
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce();

      const { success, warning, error } = await sendRevokeSoftwareMail(req, {
        userSoftwareIds: mockUserSoftwareIds,
      });

      expect(error).toBeInstanceOf(Array);
      expect(success.length).toBe(0);
      expect(warning.length).toBe(0);
      expect(error.length).toBe(1);
      expect(error[0].userSoftwareId).toBe(mockUserSoftware.id);
      expect(error[0].code).toBe(404);
    });

    it('when software not found', async () => {
      jest
        .spyOn(UserSoftwares, 'findByPk')
        .mockResolvedValueOnce(mockUserSoftware);
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser);
      jest.spyOn(Software, 'findByPk').mockResolvedValueOnce();

      const { success, warning, error } = await sendRevokeSoftwareMail(req, {
        userSoftwareIds: mockUserSoftwareIds,
      });

      expect(error).toBeInstanceOf(Array);
      expect(success.length).toBe(0);
      expect(warning.length).toBe(0);
      expect(error.length).toBe(1);
      expect(error[0].userSoftwareId).toBe(mockUserSoftware.id);
      expect(error[0].code).toBe(404);
    });

    it('when software is already revoked', async () => {
      mockUserSoftware = { ...mockUserSoftware, status: 'revoked' };

      jest
        .spyOn(UserSoftwares, 'findByPk')
        .mockResolvedValueOnce(mockUserSoftware);
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser);
      jest.spyOn(Software, 'findByPk').mockResolvedValueOnce(mockSoftware);

      const { success, warning, error } = await sendRevokeSoftwareMail(req, {
        userSoftwareIds: mockUserSoftwareIds,
      });

      expect(error).toBeInstanceOf(Array);
      expect(success.length).toBe(0);
      expect(warning.length).toBe(0);
      expect(error.length).toBe(1);
      expect(error[0].userSoftwareId).toBe(mockUserSoftware.id);
      expect(error[0].code).toBe(400);
    });

    it('when software is not assigned', async () => {
      mockUserSoftware = { ...mockUserSoftware, status: 'pending' };

      jest
        .spyOn(UserSoftwares, 'findByPk')
        .mockResolvedValueOnce(mockUserSoftware);
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser);
      jest.spyOn(Software, 'findByPk').mockResolvedValueOnce(mockSoftware);

      const { success, warning, error } = await sendRevokeSoftwareMail(req, {
        userSoftwareIds: mockUserSoftwareIds,
      });

      expect(error).toBeInstanceOf(Array);
      expect(success.length).toBe(0);
      expect(warning.length).toBe(0);
      expect(error.length).toBe(1);
      expect(error[0].userSoftwareId).toBe(mockUserSoftware.id);
      expect(error[0].code).toBe(400);
    });

    it('when manager email not found', async () => {
      mockUserSoftware = {
        ...mockUserSoftware,
        last_email_date: moment().subtract(2, 'days'),
        status: 'active',
      };
      mockSoftware = {
        ...mockSoftware,
        Managers: [
          { company_email: null },
          { company_email: null },
          { company_email: null },
        ],
      };

      jest
        .spyOn(UserSoftwares, 'findByPk')
        .mockResolvedValueOnce(mockUserSoftware);
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser);
      jest.spyOn(Software, 'findByPk').mockResolvedValueOnce(mockSoftware);

      const { success, warning, error } = await sendRevokeSoftwareMail(req, {
        userSoftwareIds: mockUserSoftwareIds,
      });

      expect(error).toBeInstanceOf(Array);
      expect(success.length).toBe(0);
      expect(warning.length).toBe(0);
      expect(error.length).toBe(1);
      expect(error[0].userSoftwareId).toBe(mockUserSoftware.id);
      expect(error[0].code).toBe(404);
    });
  });
});

describe('sendAssignSoftwareMail', () => {
  const req = {};
  beforeEach(() => {
    jest.clearAllMocks();
  });
  let mockUserSoftware = {
    ...userSoftwareFactory.build(),
    status: 'pending',
    last_email_date: moment().subtract(2, 'days'),
    save: jest.fn().mockResolvedValue({}),
  };
  let mockUser = userFactory.build();
  let mockSoftware = {
    ...softwareFactory.build(),
    Managers: [
      { company_email: 'user1@example.com' },
      { company_email: 'user2@example.com' },
      { company_email: null },
      { company_email: 'user3@example.com' },
    ],
  };
  const mockUserSoftwareIds = [mockUserSoftware.id];

  describe('successfull call', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should send an email', async () => {
      jest
        .spyOn(UserSoftwares, 'findByPk')
        .mockResolvedValueOnce(mockUserSoftware);
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser);
      jest.spyOn(Software, 'findByPk').mockResolvedValueOnce(mockSoftware);

      assignSoftwareEmail.mockImplementation(
        jest.fn().mockResolvedValueOnce(true)
      );

      const { success, warning, error } = await sendAssignSoftwareMail(req, {
        userSoftwareIds: mockUserSoftwareIds,
      });

      expect(success).toBeInstanceOf(Array);
      expect(success.length).toBe(1);
      expect(warning.length).toBe(0);
      expect(error.length).toBe(0);
      expect(success[0].userSoftwareId).toBe(mockUserSoftware.id);
      expect(success[0].code).toBe(200);
    });
  });
  describe('when mail is already sent in last 24 hours', () => {
    it('should return warning', async () => {
      mockUserSoftware = { ...mockUserSoftware, last_email_date: moment() };
      jest
        .spyOn(UserSoftwares, 'findByPk')
        .mockResolvedValueOnce(mockUserSoftware);
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser);
      jest.spyOn(Software, 'findByPk').mockResolvedValueOnce(mockSoftware);

      const { success, warning, error } = await sendAssignSoftwareMail(req, {
        userSoftwareIds: mockUserSoftwareIds,
      });

      expect(warning).toBeInstanceOf(Array);
      expect(success.length).toBe(0);
      expect(warning.length).toBe(1);
      expect(error.length).toBe(0);
      expect(warning[0].userSoftwareId).toBe(mockUserSoftware.id);
      expect(warning[0].code).toBe(429);
    });
  });

  describe('it should return error', () => {
    const req = {};
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('when userSoftware not found', async () => {
      jest.spyOn(UserSoftwares, 'findByPk').mockResolvedValueOnce();

      const { success, warning, error } = await sendAssignSoftwareMail(req, {
        userSoftwareIds: mockUserSoftwareIds,
      });

      expect(error).toBeInstanceOf(Array);
      expect(success.length).toBe(0);
      expect(warning.length).toBe(0);
      expect(error.length).toBe(1);
      expect(error[0].userSoftwareId).toBe(mockUserSoftware.id);
      expect(error[0].code).toBe(404);
    });

    it('when user not found', async () => {
      jest
        .spyOn(UserSoftwares, 'findByPk')
        .mockResolvedValueOnce(mockUserSoftware);
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce();

      const { success, warning, error } = await sendAssignSoftwareMail(req, {
        userSoftwareIds: mockUserSoftwareIds,
      });

      expect(error).toBeInstanceOf(Array);
      expect(success.length).toBe(0);
      expect(warning.length).toBe(0);
      expect(error.length).toBe(1);
      expect(error[0].userSoftwareId).toBe(mockUserSoftware.id);
      expect(error[0].code).toBe(404);
    });

    it('when software not found', async () => {
      jest
        .spyOn(UserSoftwares, 'findByPk')
        .mockResolvedValueOnce(mockUserSoftware);
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser);
      jest.spyOn(Software, 'findByPk').mockResolvedValueOnce();

      const { success, warning, error } = await sendAssignSoftwareMail(req, {
        userSoftwareIds: mockUserSoftwareIds,
      });

      expect(error).toBeInstanceOf(Array);
      expect(success.length).toBe(0);
      expect(warning.length).toBe(0);
      expect(error.length).toBe(1);
      expect(error[0].userSoftwareId).toBe(mockUserSoftware.id);
      expect(error[0].code).toBe(404);
    });

    it('when software is assigned', async () => {
      mockUserSoftware = { ...mockUserSoftware, status: 'active' };

      jest
        .spyOn(UserSoftwares, 'findByPk')
        .mockResolvedValueOnce(mockUserSoftware);
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser);
      jest.spyOn(Software, 'findByPk').mockResolvedValueOnce(mockSoftware);

      const { success, warning, error } = await sendAssignSoftwareMail(req, {
        userSoftwareIds: mockUserSoftwareIds,
      });

      expect(error).toBeInstanceOf(Array);
      expect(success.length).toBe(0);
      expect(warning.length).toBe(0);
      expect(error.length).toBe(1);
      expect(error[0].userSoftwareId).toBe(mockUserSoftware.id);
    });

    it('when manager email not found', async () => {
      mockUserSoftware = {
        ...mockUserSoftware,
        last_email_date: moment().subtract(2, 'days'),
        status: 'pending',
      };
      mockSoftware = {
        ...mockSoftware,
        Managers: [
          { company_email: null },
          { company_email: null },
          { company_email: null },
        ],
      };

      jest
        .spyOn(UserSoftwares, 'findByPk')
        .mockResolvedValueOnce(mockUserSoftware);
      jest.spyOn(User, 'findByPk').mockResolvedValueOnce(mockUser);
      jest.spyOn(Software, 'findByPk').mockResolvedValueOnce(mockSoftware);

      const { success, warning, error } = await sendAssignSoftwareMail(req, {
        userSoftwareIds: mockUserSoftwareIds,
      });

      expect(error).toBeInstanceOf(Array);
      expect(success.length).toBe(0);
      expect(warning.length).toBe(0);
      expect(error.length).toBe(1);
      expect(error[0].userSoftwareId).toBe(mockUserSoftware.id);
      expect(error[0].code).toBe(404);
    });
  });
});
