import './setup'

describe('Basic Test', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should test custom matcher', () => {
    expect(5).toBeWithinRange(1, 10)
  })
})
