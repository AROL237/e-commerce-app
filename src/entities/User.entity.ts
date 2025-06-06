// import { Role } from "generated/prisma"

export class User {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  role?: string;
  is_active?: boolean;

  constructor(
    id?: number,
    first_name?: string,
    last_name?: string,
    email?: string,
    password?: string,
    role?: string,
    is_active?: boolean,
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.id = id;
    this.email = email;
    this.role = role;
    this.password = password;
    this.is_active = is_active;
  }

  get full_name(): string {
    return this.first_name + ' ' + this.last_name;
  }

  public convertToEntity(user: any): User {
    return new User(
      user.id,
      user.first_name,
      user.last_name,
      user.email,
      user.password,
      user.role,
      user.is_active,
    );
  }
}
