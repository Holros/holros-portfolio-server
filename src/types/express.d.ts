declare global {
  namespace Express {
    interface Request {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      safeQuery?: any;
      user: UserData;
    }
  }
}

export {};
