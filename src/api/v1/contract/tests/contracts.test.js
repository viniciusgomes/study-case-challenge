const test = require('ava')
const sinon = require('sinon')
const contractMock = require('./mocks/contract.mock')

const {
  sendResponse,
} = require('../controller/contracts').test

const resFactory = (sandbox) => {
  const res = {
    status() { return this; },
    json: () => {},
  }

  sandbox.spy(res, 'status')
  sandbox.spy(res, 'json')
  return res
}

test('#sendResponse() - Send a response json', (t) => {
  const contract = { ...contractMock }
  const res = resFactory(sinon)

  sendResponse(res, contract)
  t.true(res.status.calledOnceWithExactly(200), 'Should set 200 status to the response')
  t.true(res.json.calledOnceWithExactly(contract), 'Should call json with the contract data')
});
