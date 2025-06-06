import { Role } from '@prisma/client';

/**
 *
 */
export class Principal {
  /**
   * @param username @type
   * @param role @tyepe string | Array<string> | Array<Role>
   * @param access_token @type string | undefined
   * @param refresh_token @type string | undefined
   * @constructor
   */
  constructor(
    private username: string,
    private role: string | Array<string> | Array<Role>,
    // private access_token?: string,
    // private refresh_token?: string,
  ) {}

  public get getRole(): string | Array<string> | Array<Role> {
    return this.role;
  }

  public get getUsername(): string {
    return this.username;
  }
  // public get getAccessToken(): string | undefined {
  //   return this.access_token;
  // }
  // public get getRefreshToken(): string | undefined {
  //   return this.refresh_token;
  // }
}
