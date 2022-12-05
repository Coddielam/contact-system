export class CustomError extends Error {
  public sucess = false;
  public status: number;
  public stack: any;

  constructor(message: string, status: number = 500, stack: any = "") {
    super(message);
    this.status = status;
    this.stack = stack;
  }
}
