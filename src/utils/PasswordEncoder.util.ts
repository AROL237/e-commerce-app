// src/common/utils/passwordEncoder.util.ts
import * as bcrypt from 'bcrypt';

export async function encode(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function match(plain: string, encoded: string): Promise<boolean> {
  return bcrypt.compare(plain, encoded);
}
