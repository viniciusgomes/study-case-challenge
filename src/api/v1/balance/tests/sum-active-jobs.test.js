const test = require('ava')
const { Op, Sequelize } = require('sequelize')
const sinon = require('sinon')
const sumActiveJobsMock = require('./mocks/sum-active-jobs.mock')

const {
  sumActiveJobs,
} = require('../repository/sum/sum-active-jobs').test


test('#sumActiveJobs() - Success retrieve a client data', async (t) => {
  const findOneStub = sinon.stub().returns(sumActiveJobsMock);
  const Contract = {
    findOne: findOneStub,
  }
  const Job = {
    findOne: findOneStub,
  }

  const client = {
    id: 2
  }

  const amount = 100

  const actual = await sumActiveJobs(amount, client.id, Job, Contract);
  const actualOptions = findOneStub.getCall(0).args[0];
  const expectedOptions = {
      attributes: [
          [Sequelize.fn('sum', Sequelize.col('price')), 'totalJobAmount'],
      ],
      where: {
          paid: {
              [Op.is]: null,
          },
      },
      include: [{
          model: Contract,
          where: {
              status: 'in_progress',
              ClientId: 2,
          },
      }],
  }
  t.deepEqual(actualOptions, expectedOptions, 'Should call sumActiveJobs with expected options')
  t.deepEqual(actual, sumActiveJobsMock.dataValues.totalJobAmount, 'Should return a summed jobs object')
})
