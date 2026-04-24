export class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly createdAt: Date
  ) {}

  static create(id: string, email: string, createdAt: Date): User {
    return new User(id, email, createdAt);
  }

  static createNow(id: string, email: string): User {
    return User.create(id, email, new Date());
  }
}
