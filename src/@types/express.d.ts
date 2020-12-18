declare namespace Express {
  export interface IRequest {
    user: {
      id: string;
    };
  }
}

declare module '*.json';
