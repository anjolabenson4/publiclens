// tests/citizen-identity.test.ts
import { describe, it, expect, beforeEach } from 'vitest'

type Citizen = {
  verified: boolean
  reputation: number
  alias: string | null
}

const mockContract = {
  admin: 'ST1ADMIN1111111111111111111111111111111111',
  registry: new Map<string, Citizen>(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  registerCitizen(caller: string, alias: string) {
    if (this.registry.has(caller)) {
      return { error: 101 } // ERR-ALREADY-VERIFIED
    }
    this.registry.set(caller, {
      verified: false,
      reputation: 0,
      alias,
    })
    return { value: true }
  },

  verifyCitizen(caller: string, citizen: string) {
    if (!this.isAdmin(caller)) return { error: 100 } // ERR-NOT-AUTHORIZED
    const entry = this.registry.get(citizen)
    if (!entry) return { error: 102 } // ERR-NOT-REGISTERED
    this.registry.set(citizen, {
      ...entry,
      verified: true,
    })
    return { value: true }
  },

  isVerified(citizen: string) {
    const entry = this.registry.get(citizen)
    return { value: entry ? entry.verified : false }
  },

  getReputation(citizen: string) {
    const entry = this.registry.get(citizen)
    if (!entry) return { error: 102 } // ERR-NOT-REGISTERED
    return { value: entry.reputation }
  },

  adjustReputation(caller: string, citizen: string, delta: number) {
    if (!this.isAdmin(caller)) return { error: 100 }
    const entry = this.registry.get(citizen)
    if (!entry) return { error: 102 }
    this.registry.set(citizen, {
      ...entry,
      reputation: entry.reputation + delta,
    })
    return { value: true }
  },

  updateAlias(caller: string, alias: string) {
    const entry = this.registry.get(caller)
    if (!entry) return { error: 102 }
    this.registry.set(caller, {
      ...entry,
      alias,
    })
    return { value: true }
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: 100 }
    this.admin = newAdmin
    return { value: true }
  },
}

describe('Citizen Identity Contract', () => {
  const admin = mockContract.admin
  const citizen1 = 'ST2CITIZEN111111111111111111111111111111111'
  const citizen2 = 'ST3CITIZEN222222222222222222222222222222222'

  beforeEach(() => {
    mockContract.registry = new Map()
    mockContract.admin = admin
  })

  it('should register a citizen', () => {
    const result = mockContract.registerCitizen(citizen1, 'alice')
    expect(result).toEqual({ value: true })
    expect(mockContract.registry.has(citizen1)).toBe(true)
  })

  it('should not allow duplicate registration', () => {
    mockContract.registerCitizen(citizen1, 'alice')
    const result = mockContract.registerCitizen(citizen1, 'alice')
    expect(result).toEqual({ error: 101 }) // ERR-ALREADY-VERIFIED
  })

  it('should verify a registered citizen by admin', () => {
    mockContract.registerCitizen(citizen1, 'alice')
    const result = mockContract.verifyCitizen(admin, citizen1)
    expect(result).toEqual({ value: true })
    expect(mockContract.registry.get(citizen1)?.verified).toBe(true)
  })

  it('should fail verification by non-admin', () => {
    mockContract.registerCitizen(citizen1, 'alice')
    const result = mockContract.verifyCitizen(citizen1, citizen1)
    expect(result).toEqual({ error: 100 })
  })

  it('should retrieve correct verification status', () => {
    mockContract.registerCitizen(citizen1, 'alice')
    expect(mockContract.isVerified(citizen1)).toEqual({ value: false })
    mockContract.verifyCitizen(admin, citizen1)
    expect(mockContract.isVerified(citizen1)).toEqual({ value: true })
  })

  it('should retrieve reputation', () => {
    mockContract.registerCitizen(citizen1, 'alice')
    const rep = mockContract.getReputation(citizen1)
    expect(rep).toEqual({ value: 0 })
  })

  it('should fail reputation fetch for unregistered citizen', () => {
    expect(mockContract.getReputation(citizen2)).toEqual({ error: 102 })
  })

  it('should adjust reputation by admin', () => {
    mockContract.registerCitizen(citizen1, 'alice')
    const result = mockContract.adjustReputation(admin, citizen1, 10)
    expect(result).toEqual({ value: true })
    expect(mockContract.getReputation(citizen1)).toEqual({ value: 10 })
  })

  it('should reject reputation adjustment by non-admin', () => {
    mockContract.registerCitizen(citizen1, 'alice')
    const result = mockContract.adjustReputation(citizen1, citizen1, 5)
    expect(result).toEqual({ error: 100 })
  })

  it('should allow citizen to update alias', () => {
    mockContract.registerCitizen(citizen1, 'alice')
    const result = mockContract.updateAlias(citizen1, 'new-alias')
    expect(result).toEqual({ value: true })
    expect(mockContract.registry.get(citizen1)?.alias).toBe('new-alias')
  })

  it('should reject alias update for unregistered citizen', () => {
    const result = mockContract.updateAlias(citizen2, 'ghost')
    expect(result).toEqual({ error: 102 })
  })

  it('should transfer admin rights', () => {
    const result = mockContract.transferAdmin(admin, citizen1)
    expect(result).toEqual({ value: true })
    expect(mockContract.admin).toBe(citizen1)
  })

  it('should prevent non-admin from transferring admin rights', () => {
    const result = mockContract.transferAdmin(citizen1, citizen2)
    expect(result).toEqual({ error: 100 })
  })
})
