const endpointString = {
  home: '/',
  byid: '/:id',
};

const userEndpoints = {
  login: '/login',
  refreshToken: '/refresh-token',
  logout: '/logout',
  //user crud route strings
  getAll: '/users',
  get: '/users/:userId',
  post: '/users',
  patch: '/users/:userId',
  delete: '/users/:userId',
  getUserSoftwares: '/users/:userId/softwares',
  getUserHistory: '/users/:userId/history',
  multipleUsers: '/allusers',
  //skills endpoints
  skills: '/users/:userId/skills',
  allSkills: '/skills',
  deleteUserSkills: '/users/:userId/skills',
};

const healthCheckEndpoints = {
  healthCheck: '/health-check',
};

const userSoftwareEndpoints = {
  addUserSoftware: '/users/:userId/softwares',
  updateUserSoftware: '/users/software/:userSoftwareId',
  revokeSoftwareMail: '/users/software/revoke-email',
  assignSoftwareMail: '/users/software/assign-email',
  deleteSoftware: '/users-softwares',
};

const systemRoles = {
  admin: 'admin',
  hrManager: 'hr manager',
  employee: 'employee',
  manager: 'manager',
  owner: 'owner',
  lead: 'lead',
};

const userSoftwareStatus = {
  active: 'active',
  revoked: 'revoked',
  pending: 'pending',
};

const softwareStatus = {
  active: 'active',
  inactive: 'inactive',
};

const userStatus = {
  active: 'active',
  offboarding: 'offboarding',
  pending: 'pending',
  offboarded: 'offboarded',
};
const userEmployementType = {
  inter: 'intern',
  fullTime: 'full-time',
  contractor: 'contractor',
  partTime: 'part-time',
};

const rolesWithloginAccess = [
  systemRoles.hrManager,
  systemRoles.owner,
  systemRoles.manager,
];

const rolesWithApproveEmployeeAccess = [systemRoles.owner];

const statusWithoutLoginAccess = [userStatus.pending, userStatus.offboarded];

const softwareEndpoints = {
  patch: '/softwares/:softwareId',
  post: '/softwares',
  delete: '/softwares/:softwareId',
  getAll: '/softwares',
  get: '/softwares/:softwareId',
  getSoftwareUsers: '/softwares/:softwareId/users',
  getSoftwareByClientId: '/softwares/clients/:clientId',
};

const getUsersStrings = {
  requiredAttribute: [
    'id',
    'employee_id',
    'first_name',
    'last_name',
    'capacity',
    'job_title',
    'status',
    'company_email',
    'createdAt',
  ],
  branchTableAttribute: ['name'],
};

const checkListEndpoints = {
  checklist: '/users/:userId/checklist',
};

const locations = {
  india: 'India',
  us: 'US',
  indiaBranchIds: [1, 2, 3],
  usBranchIds: [4, 5],
  remoteBranchIds: [6],
  indianPhoneCode: '+91',
};

const roles = {
  ownerRole: 1,
  hrManagerRole: 2,
  managerRole: 3,
  leadRole: 4,
  employeeRole: 5,
};
const softwareClientEndpoints = {
  getAllClients: '/clients',
};

const emailRedirectEndpoints = {
  approveEmployee: `${process.env.FRONTEND_ORIGIN_URL}/employees/{employeeId}/approve`,
  assignSoftware: `${process.env.FRONTEND_ORIGIN_URL}/employees/{employeeId}/#softwares`,
  revokeSoftware: `${process.env.FRONTEND_ORIGIN_URL}/employees/{employeeId}/#softwares`,
};

const noteString = {
  assigned: 'assigned',
  revoked: 'revoked',
};

const uniqueConstraintErrorMessages = {
  agency: {
    emailMsg: 'Agency Email must be unique',
  },
  client: {
    nameMsg: 'Client name must be unique',
  },
  skill: {
    nameMsg: 'Skill name must be unique',
  },
  token: {
    userIdMsg: 'User Id must be unique',
    refreshTokenMsg: 'Refresh Token must be unique',
  },
  user: {
    employeeIdMsg: 'Employee ID must be unique',
    companyEmailMsg: 'Company email must be unique',
    phoneNumberMsg: 'Phone number must be unique',
    personalEmailMsg: 'Personal email must be unique',
  },
};

module.exports = {
  endpointString,
  userEndpoints,
  softwareEndpoints,
  systemRoles,
  getUsersStrings,
  rolesWithloginAccess,
  userStatus,
  userEmployementType,
  checkListEndpoints,
  softwareStatus,
  userSoftwareStatus,
  userSoftwareEndpoints,
  locations,
  softwareClientEndpoints,
  emailRedirectEndpoints,
  healthCheckEndpoints,
  noteString,
  uniqueConstraintErrorMessages,
  statusWithoutLoginAccess,
  rolesWithApproveEmployeeAccess,
  roles,
};
