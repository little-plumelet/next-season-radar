import { describe, it, expect } from 'vitest'
import { cx } from '../cx'

describe('cx', () => {
  it('joins multiple class names', () => {
    expect(cx('a', 'b', 'c')).toBe('a b c')
  })

  it('filters out false values', () => {
    expect(cx('a', false, 'b')).toBe('a b')
  })

  it('filters out undefined values', () => {
    expect(cx('a', undefined, 'b')).toBe('a b')
  })

  it('returns empty string when all values are falsy', () => {
    expect(cx(false, undefined, false)).toBe('')
  })

  it('returns empty string with no arguments', () => {
    expect(cx()).toBe('')
  })

  it('handles a single class name', () => {
    expect(cx('only')).toBe('only')
  })
})
