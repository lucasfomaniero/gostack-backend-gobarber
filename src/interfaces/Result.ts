export default class Result<T> {
  onSuccess?: T;

  onError?: Error;

  constructor(type?: T, error?: Error) {
    this.onSuccess = type;
    this.onError = error;
  }
}
