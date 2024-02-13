const { getAllBranches } = require('../branch/branchRepository');
const model = require('../../database/models');
const branchFactory = require('../../factories/branch');

describe('getAllBranches', () => {
  it('should return all branches', async () => {
    const branchData = branchFactory.build();

    const findAllMock = jest
      .spyOn(model.Branches, 'findAll')
      .mockResolvedValue(branchData);
    const branches = await getAllBranches();

    expect(findAllMock).toHaveBeenCalledTimes(1);
    expect(branches).toEqual(branchData);

    findAllMock.mockRestore();
  });
});
