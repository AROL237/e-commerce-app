export type ApiResponse = {
  status_code: number | string;
  data?:any
  message: string
  error_type?: string;
};
