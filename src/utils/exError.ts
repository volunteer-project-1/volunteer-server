class ExError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
  }
}

export default ExError;
