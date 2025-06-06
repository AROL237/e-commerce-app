import { AuthRequestFilterMiddleware } from './auth-request-filter.middleware';

describe('AuthRequestFilterMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthRequestFilterMiddleware()).toBeDefined();
  });
});
