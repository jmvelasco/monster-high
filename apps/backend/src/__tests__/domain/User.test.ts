import { User } from '../../domain/entities/User';

describe('The User', () => {
  it('creates a user with an id, email, and creation date', () => {
    const createdAt = new Date('2026-01-01');

    const user = User.create('user-1', 'frankie@monsterhigh.edu', createdAt);

    expect(user).toBeInstanceOf(User);
    expect(user.email).toBe('frankie@monsterhigh.edu');
    expect(user.createdAt).toBe(createdAt);
  });

  it('sets the creation date to now when not provided', () => {
    const before = new Date();

    const user = User.createNow('user-2', 'draculaura@monsterhigh.edu');

    const after = new Date();
    expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(user.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('rejects an empty email', () => {
    expect(() => User.create('user-1', '', new Date())).toThrow();
  });

  it('rejects an invalid email format', () => {
    expect(() => User.create('user-1', 'not-an-email', new Date())).toThrow();
  });

  it('knows if it was created before a given date', () => {
    const user = User.create('user-1', 'clawdeen@monsterhigh.edu', new Date('2026-01-15'));

    expect(user.wasCreatedBefore(new Date('2026-02-01'))).toBe(true);
    expect(user.wasCreatedBefore(new Date('2026-01-01'))).toBe(false);
  });
});
