import { describe, it, expect } from 'vitest'
import { ARC_DEFINITIONS, MODULE_ORDER, ACHIEVEMENTS } from '../constants'

describe('ARC_DEFINITIONS', () => {
  it('has exactly 4 arcs', () => {
    expect(ARC_DEFINITIONS).toHaveLength(4)
  })

  it('contains foundation, practitioner, power-user, expert arcs', () => {
    const ids = ARC_DEFINITIONS.map((a) => a.id)
    expect(ids).toEqual(['foundation', 'practitioner', 'power-user', 'expert'])
  })

  it('each arc has required fields: id, name, color, description', () => {
    for (const arc of ARC_DEFINITIONS) {
      expect(arc).toHaveProperty('id')
      expect(arc).toHaveProperty('name')
      expect(arc).toHaveProperty('color')
      expect(arc).toHaveProperty('description')
      expect(typeof arc.id).toBe('string')
      expect(typeof arc.name).toBe('string')
      expect(typeof arc.color).toBe('string')
      expect(typeof arc.description).toBe('string')
      expect(arc.id.length).toBeGreaterThan(0)
      expect(arc.name.length).toBeGreaterThan(0)
      expect(arc.color.length).toBeGreaterThan(0)
      expect(arc.description.length).toBeGreaterThan(0)
    }
  })

  it('each arc has a range field', () => {
    for (const arc of ARC_DEFINITIONS) {
      expect(arc).toHaveProperty('range')
      expect(typeof arc.range).toBe('string')
    }
  })

  it('arc colors are valid hex codes', () => {
    for (const arc of ARC_DEFINITIONS) {
      expect(arc.color).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })
})

describe('MODULE_ORDER', () => {
  it('has 13 modules', () => {
    expect(MODULE_ORDER).toHaveLength(13)
  })

  it('starts with claude-fundamentals and ends with capstone', () => {
    expect(MODULE_ORDER[0]).toBe('claude-fundamentals')
    expect(MODULE_ORDER[MODULE_ORDER.length - 1]).toBe('capstone')
  })

  it('all entries are non-empty strings', () => {
    for (const mod of MODULE_ORDER) {
      expect(typeof mod).toBe('string')
      expect(mod.length).toBeGreaterThan(0)
    }
  })

  it('has no duplicate entries', () => {
    const unique = new Set(MODULE_ORDER)
    expect(unique.size).toBe(MODULE_ORDER.length)
  })
})

describe('ACHIEVEMENTS', () => {
  it('has at least 12 achievements', () => {
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(12)
  })

  it('each achievement has required fields: id, title, description, icon', () => {
    for (const achievement of ACHIEVEMENTS) {
      expect(achievement).toHaveProperty('id')
      expect(achievement).toHaveProperty('title')
      expect(achievement).toHaveProperty('description')
      expect(achievement).toHaveProperty('icon')
      expect(typeof achievement.id).toBe('string')
      expect(typeof achievement.title).toBe('string')
      expect(typeof achievement.description).toBe('string')
      expect(typeof achievement.icon).toBe('string')
      expect(achievement.id.length).toBeGreaterThan(0)
      expect(achievement.title.length).toBeGreaterThan(0)
      expect(achievement.description.length).toBeGreaterThan(0)
      expect(achievement.icon.length).toBeGreaterThan(0)
    }
  })

  it('each achievement has a condition field', () => {
    for (const achievement of ACHIEVEMENTS) {
      expect(achievement).toHaveProperty('condition')
      expect(typeof achievement.condition).toBe('string')
    }
  })

  it('achievement IDs are unique', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('includes the first-lesson achievement', () => {
    const first = ACHIEVEMENTS.find((a) => a.id === 'first-lesson')
    expect(first).toBeDefined()
    expect(first!.title).toBe('First Steps')
  })

  it('includes arc-completion achievements', () => {
    const arcAchievements = ACHIEVEMENTS.filter((a) => a.id.endsWith('-arc'))
    expect(arcAchievements.length).toBeGreaterThanOrEqual(3)
  })

  it('includes streak achievements', () => {
    const streakAchievements = ACHIEVEMENTS.filter((a) => a.id.startsWith('streak-'))
    expect(streakAchievements.length).toBeGreaterThanOrEqual(3)
  })
})
