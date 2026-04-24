export class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly createdAt: Date
  ) {}

  static create(id: string, email: string, createdAt: Date): User {
    return new User(id, email, createdAt);
  }

  static createNow(_id: string, _email: string): User {
    return null as unknown as User;
  }
}
