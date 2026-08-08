import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const identity = readFileSync(join(root, 'openwave-identity-v1.0.yaml'), 'utf8')
const payments = readFileSync(join(root, 'openwave-payments-v1.yaml'), 'utf8')

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function pathBlock(source, path) {
  const pattern = new RegExp(`^  ${escapeRegExp(path)}:\\n([\\s\\S]*?)(?=^  \/|^components:)`, 'm')
  const match = source.match(pattern)
  assert.ok(match, `Missing OpenAPI path: ${path}`)
  return match[0]
}

function requireMarkers(source, label, markers) {
  for (const marker of markers) {
    assert.ok(source.includes(marker), `${label} is missing ${marker}`)
  }
}

function responseStatuses(operation, label) {
  const statuses = [...operation.matchAll(/^        ["']?(\d{3})["']?:/gm)].map((match) => match[1])
  assert.ok(statuses.length > 0, `${label} has no response statuses`)
  return statuses
}

function requireExactStatuses(operation, label, expected) {
  assert.deepEqual(
    responseStatuses(operation, label).sort(),
    [...expected].sort(),
    `${label} response statuses changed`,
  )
}

function responseBlock(operation, status, label) {
  const marker = new RegExp(`^        ["']?${status}["']?:`, 'm')
  const match = operation.match(marker)
  assert.ok(match, `${label} is missing HTTP ${status}`)

  const start = match.index
  const remainder = operation.slice(start + match[0].length)
  const nextStatus = remainder.search(/^        ["']?\d{3}["']?:/m)
  return nextStatus === -1
    ? operation.slice(start)
    : operation.slice(start, start + match[0].length + nextStatus)
}

function componentBlock(source, name) {
  const marker = `    ${name}:\n`
  const start = source.indexOf(marker)
  assert.notEqual(start, -1, `Missing component schema: ${name}`)

  const remainder = source.slice(start + marker.length)
  const nextComponent = remainder.search(/^    [A-Za-z][A-Za-z0-9]+:\n/m)
  return nextComponent === -1
    ? source.slice(start)
    : source.slice(start, start + marker.length + nextComponent)
}

requireMarkers(identity, 'Identity spec', [
  'version: "1.1.0"',
  'HandleAvailabilityStatus:',
  'enum: [AVAILABLE, TAKEN, RETIRED, INVALID]',
  'HANDLE_RETIRED',
  'HANDLE_RENAME_NOT_PERMITTED',
  'HANDLE_RENAME_TOO_SOON',
])

const identityAvailability = pathBlock(identity, '/identity/handles/{handle}/availability')
requireMarkers(identityAvailability, 'Identity availability', [
  'operationId: getHandleAvailability',
  'BankKey:',
  'HandleAvailabilityResponse',
])
requireExactStatuses(identityAvailability, 'Identity availability', ['200', '403'])

const identityRename = pathBlock(identity, '/identity/{npt_handle}/handle')
requireMarkers(identityRename, 'Identity rename', [
  'operationId: renameHandle',
  'RenameHandleRequest',
  '"200":',
  '"400":',
  '"403":',
  '"404":',
  '"409":',
  '"410":',
  '"429":',
])
requireExactStatuses(identityRename, 'Identity rename', ['200', '400', '403', '404', '409', '410', '429'])

for (const [status, schema] of Object.entries({
  400: 'HandleValidationErrorResponse',
  403: 'HandleRenameNotPermittedErrorResponse',
  404: 'HandleRenameNotFoundErrorResponse',
  409: 'HandleTakenErrorResponse',
  410: 'HandleRetiredErrorResponse',
  429: 'HandleRenameTooSoonErrorResponse',
})) {
  requireMarkers(responseBlock(identityRename, status, 'Identity rename'), `Identity rename HTTP ${status}`, [schema])
}

requireMarkers(componentBlock(identity, 'HandleAvailabilityResponse'), 'Identity availability schema', [
  'required: [handle, status, available]',
  'HandleAvailabilityStatus',
])

const identityRenameRequest = componentBlock(identity, 'RenameHandleRequest')
requireMarkers(identityRenameRequest, 'Identity rename request schema', [
  'required: [newHandle, nationalId]',
  'newHandle:',
  'nationalId:',
])
assert.equal(/^        (?:new_handle|national_id):/m.test(identityRenameRequest), false,
  'Identity rename request canonical fields must be camelCase')

const identityRenameResponse = componentBlock(identity, 'IdentityRenameResponse')
requireMarkers(identityRenameResponse, 'Identity rename response schema', [
  'nptHandle:',
  'retiredHandle:',
  'reauthenticationRequired:',
  'nextStep:',
  'CustomerPortalAccessResponse',
])
assert.equal(/^        (?:npt_handle|retired_handle|reauthentication_required|next_step):/m.test(identityRenameResponse), false,
  'Identity rename response must match the shipped camelCase DTO')
requireMarkers(responseBlock(identityRename, '200', 'Identity rename'), 'Identity rename HTTP 200', [
  'IdentityRenameResponse',
])

requireMarkers(pathBlock(identity, '/identity/resolve'), 'Identity resolution', [
  '"410":',
  'HANDLE_RETIRED',
])

requireMarkers(pathBlock(identity, '/identity/claim'), 'Identity claim', [
  '"410":',
  'HANDLE_RETIRED',
])

const portalLogin = pathBlock(identity, '/auth/login')
requireMarkers(portalLogin, 'Identity portal login', [
  'PortalLoginRequest',
  'BankAppLoginChallengeResponse',
  'TotpLoginChallengeResponse',
  'PortalSessionResponse',
  'RoleMismatchResponse',
])
requireExactStatuses(portalLogin, 'Identity portal login', ['200', '202', '400', '401', '409'])

const portalTotpVerify = pathBlock(identity, '/auth/login/totp/verify')
requireMarkers(portalTotpVerify, 'Identity portal TOTP verification', [
  'TotpLoginVerifyRequest',
  'BankAppLoginChallengeResponse',
  'PortalSessionResponse',
  'TotpLoginErrorResponse',
])
requireExactStatuses(portalTotpVerify, 'Identity portal TOTP verification', ['200', '202', '400', '401'])

const loginStatus = pathBlock(identity, '/auth/login/bank-approval/{challenge_id}')
requireMarkers(loginStatus, 'Identity login approval status', [
  'LoginStatusToken',
  'BankLoginApprovalStatusResponse',
])
requireExactStatuses(loginStatus, 'Identity login approval status', ['200', '403', '404'])

const loginApprovalList = pathBlock(identity, '/identity/login-approvals')
requireMarkers(loginApprovalList, 'Identity bank login approval list', [
  'BankKey:',
  'BankPortalSession:',
  'BankLoginApprovalListResponse',
  'LoginApprovalInvalidFilterErrorResponse',
])
requireExactStatuses(loginApprovalList, 'Identity bank login approval list', ['200', '400', '403'])

const loginApprovalPending = pathBlock(identity, '/identity/login-approvals/pending')
requireMarkers(loginApprovalPending, 'Identity pending bank login approvals', [
  'name: customerRef',
  'BankLoginApprovalQueueItem',
])
requireExactStatuses(loginApprovalPending, 'Identity pending bank login approvals', ['200', '400', '403'])

const loginApprovalDetail = pathBlock(identity, '/identity/login-approvals/{challenge_id}')
requireMarkers(loginApprovalDetail, 'Identity bank login approval detail', [
  'BankLoginApprovalQueueItem',
  'LoginApprovalNotFoundErrorResponse',
])
requireExactStatuses(loginApprovalDetail, 'Identity bank login approval detail', ['200', '403', '404'])

for (const action of ['approve', 'reject']) {
  const operation = pathBlock(identity, `/identity/login-approvals/{challenge_id}/${action}`)
  requireMarkers(operation, `Identity bank login ${action}`, [
    'BankLoginApprovalActionRequest',
    'BankLoginApprovalActionResponse',
    'LoginApprovalNotPermittedErrorResponse',
    'LoginApprovalNotFoundErrorResponse',
    'LoginApprovalAlreadyActionedErrorResponse',
    'LoginApprovalExpiredErrorResponse',
  ])
  requireExactStatuses(operation, `Identity bank login ${action}`, ['200', '400', '403', '404', '409', '410'])
}

requireMarkers(componentBlock(identity, 'BankAppLoginChallengeResponse'), 'Identity bank-app challenge schema', [
  'default_bank_handle:',
  'BankLoginChoice',
  'status_token:',
])
requireMarkers(componentBlock(identity, 'BankLoginChoice'), 'Identity multi-bank choice schema', [
  'required: [bankHandle, alias, isDefault]',
])
requireMarkers(componentBlock(identity, 'BankLoginApprovalActionRequest'), 'Identity bank login action request', [
  'required: [customerRef]',
])

const actionResponse = componentBlock(identity, 'BankLoginApprovalActionResponse')
assert.equal(/^        session:/m.test(actionResponse), false,
  'Bank approve/reject responses must not expose the customer portal session')

requireMarkers(payments, 'Payments spec', [
  'version: "1.1.0"',
  'AliasAvailabilityStatus:',
  'enum: [AVAILABLE, TAKEN, RETIRED, INVALID, UNKNOWN]',
  'previous_retired:',
])

const gatewayAvailability = pathBlock(payments, '/alias/{alias_username}/availability')
requireMarkers(gatewayAvailability, 'Gateway availability', [
  'operationId: getAliasAvailability',
  'BankPartnerKey:',
  'AliasAvailabilityResponse',
])
requireExactStatuses(gatewayAvailability, 'Gateway availability', ['200'])

const gatewayRename = pathBlock(payments, '/alias/rename')
requireMarkers(gatewayRename, 'Gateway rename', [
  'operationId: renameAlias',
  'RenameAliasRequest',
  "'200':",
  "'400':",
  "'403':",
  "'404':",
  "'409':",
  "'410':",
  "'429':",
  "'502':",
  "'503':",
  'IDENTITY_UNAVAILABLE',
  'IDENTITY_DISABLED',
])
requireExactStatuses(gatewayRename, 'Gateway rename', ['200', '400', '403', '404', '409', '410', '429', '502', '503'])

for (const [status, schema] of Object.entries({
  400: 'AliasInvalidErrorResponse',
  403: 'AliasRenameNotPermittedErrorResponse',
  404: 'AliasNotFoundErrorResponse',
  409: 'AliasTakenErrorResponse',
  410: 'AliasRetiredErrorResponse',
  429: 'AliasRenameTooSoonErrorResponse',
  502: 'AliasDependencyErrorResponse',
  503: 'IdentityDisabledErrorResponse',
})) {
  requireMarkers(responseBlock(gatewayRename, status, 'Gateway rename'), `Gateway rename HTTP ${status}`, [schema])
}

requireMarkers(componentBlock(payments, 'AliasAvailabilityResponse'), 'Gateway availability schema', [
  'required: [alias_username, status, available]',
  'AliasAvailabilityStatus',
])

requireMarkers(componentBlock(payments, 'AliasDependencyErrorResponse'), 'Gateway dependency schema', [
  'enum: [IDENTITY_UNAVAILABLE]',
  'enum: [UNAVAILABLE, DISABLED]',
])

const successorField = /^\s+(?:replaced_by_handle|replacement_handle|successor_handle|replacedByHandle|replacementHandle|successorHandle):/m
assert.equal(successorField.test(identity), false, 'Identity spec must not expose a successor handle field')
assert.equal(successorField.test(payments), false, 'Payments spec must not expose a successor handle field')

const retiredError = componentBlock(identity, 'HandleRetiredErrorResponse')
assert.equal(/(?:nptHandle|npt_handle|newHandle|new_handle|replacement|successor)/i.test(retiredError), false,
  'Retired-handle errors must not disclose the replacement handle')

console.log('NPT lifecycle contract check passed.')
