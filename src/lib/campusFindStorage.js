import initialItems from '../data/items.json'

const ITEMS_KEY = 'campusfind.items.v1'
const ACCOUNTS_KEY = 'campusfind.accounts.v1'
const SESSION_KEY = 'campusfind.session.v1'
const PASSWORD_HASH_ITERATIONS = 210_000

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) {
    throw new Error('Secure password hashing is unavailable in this browser. Use a modern browser on localhost or HTTPS.')
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PASSWORD_HASH_ITERATIONS },
    key,
    256,
  )
  return bytesToHex(new Uint8Array(bits))
}

export function loadItems() {
  const storedItems = localStorage.getItem(ITEMS_KEY)
  if (storedItems === null) return initialItems

  const items = JSON.parse(storedItems)
  if (!Array.isArray(items)) {
    throw new Error('Saved item data is invalid. Clear this site’s CampusFind storage to reload the sample data.')
  }

  return items
}

export function saveItems(items) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items))
}

export function loadAccounts() {
  const storedAccounts = localStorage.getItem(ACCOUNTS_KEY)
  if (storedAccounts === null) return []

  const accounts = JSON.parse(storedAccounts)
  if (!Array.isArray(accounts) || accounts.some((account) =>
    typeof account.email !== 'string' ||
    typeof account.name !== 'string' ||
    typeof account.passwordHash !== 'string' || !/^[a-f0-9]{64}$/i.test(account.passwordHash) ||
    typeof account.salt !== 'string' || !/^[a-f0-9]{32}$/i.test(account.salt)
  )) {
    throw new Error('Saved account data is invalid. Clear this site’s CampusFind storage to continue.')
  }

  return accounts
}

export async function registerAccount(name, email, password) {
  if (!name.trim()) throw new Error('Enter your name to create an account.')
  if (!email.trim()) throw new Error('Enter an email address to create an account.')
  if (password.length < 8) throw new Error('Use a password with at least 8 characters.')
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Secure password hashing is unavailable in this browser. Use a modern browser on localhost or HTTPS.')
  }

  const accounts = loadAccounts()
  const normalizedEmail = normalizeEmail(email)
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error('An account with this email already exists. Sign in instead.')
  }

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const account = {
    email: normalizedEmail,
    name: name.trim(),
    salt: bytesToHex(salt),
    passwordHash: await hashPassword(password, salt),
  }
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]))
  return { email: account.email, name: account.name }
}

export async function authenticateAccount(email, password) {
  const normalizedEmail = normalizeEmail(email)
  const account = loadAccounts().find((candidate) => candidate.email === normalizedEmail)
  if (!account) throw new Error('Email or password is incorrect.')

  const salt = new Uint8Array(account.salt.match(/.{2}/g).map((byte) => Number.parseInt(byte, 16)))
  const passwordHash = await hashPassword(password, salt)
  if (passwordHash !== account.passwordHash) {
    throw new Error('Email or password is incorrect.')
  }

  return { email: account.email, name: account.name }
}

export function loadSession() {
  const storedSession = localStorage.getItem(SESSION_KEY)
  if (storedSession === null) return null

  const session = JSON.parse(storedSession)
  if (typeof session.email !== 'string' || typeof session.name !== 'string') {
    throw new Error('Saved sign-in data is invalid. Sign in again.')
  }
  if (!loadAccounts().some((account) => account.email === session.email && account.name === session.name)) {
    throw new Error('This browser no longer has the account for this sign-in. Sign in again.')
  }

  return session
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
