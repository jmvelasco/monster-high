import { User } from '../../domain/User';

describe('The User', () => {
  // [x] 1. creates a user with an id, email, and creation date
  // [x] 2. exposes its email
  // [x] 3. exposes its creation date
  // [ ] 4. creation date is set to now when using the factory method
  // [ ] 5. rejects an empty email
  // [ ] 6. rejects an invalid email format
  // [ ] 7. knows if it was created before a given date

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
});
