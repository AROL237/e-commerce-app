import { Role } from '@prisma/client';

/**
 *  class for user principal
 */
export class UserContext {
  private _email: string;
  private _password: string;
  private _authorities: string | Array<Role> | Array<string>;
  private _authenticated: boolean;
  private _access_token: string;
  private _refresh_token: string;

  constructor(
    email: string,
    password: string,
    authorities?: Array<string> | string | Array<Role>,
    authenticated?: boolean,
  ) {
    this._email = email;
    this._authorities = authorities ? authorities : '';
    this._password = password;
    this._authenticated = authenticated ? authenticated : false;
  }

  public get email(): string {
    return this._email;
  }

  public set setPassword(password: string) {
    this._password = password;
  }
  public get password(): string {
    return this._password;
  }
  public set setAuthority(authority: Array<string> | string | Array<Role>) {
    this._authorities = authority;
  }

  public get authorities(): string | Array<string> | Array<Role> {
    return this._authorities;
  }

  public get authenticated(): boolean {
    return this._authenticated;
  }

  public set setAccess_token(str: string) {
    this._access_token = str;
  }
  public get access_token(): string {
    return this._access_token;
  }
  public set setRefresh_token(str: string) {
    this._refresh_token = str;
  }
  public get refresh_token(): string {
    return this._refresh_token;
  }
}
