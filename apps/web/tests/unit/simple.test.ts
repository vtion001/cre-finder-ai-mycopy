describe('Simple Test Suite', () => {
  it('should pass basic arithmetic', () => {
    expect(2 + 2).toBe(4)
    expect(10 - 5).toBe(5)
    expect(3 * 4).toBe(12)
  })

  it('should handle strings', () => {
    expect('hello').toBe('hello')
    expect('world').toContain('or')
  })

  it('should work with arrays', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(arr).toHaveLength(5)
    expect(arr).toContain(3)
  })
})
