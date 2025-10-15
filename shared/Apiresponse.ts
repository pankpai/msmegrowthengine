export class ApiResponse<T = any> {
  public success: boolean;
  public message: string;
  public data?: T;
  public error?: any;

  constructor(success: boolean, message: string, data?: T, error?: any) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}
