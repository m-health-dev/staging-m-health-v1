export type ErrorLogType = {
  id: string;
  ray_id: string;
  accessed_at: Date;
  pathname: string;
  ip_address: string;
  browser: string;
  os: string;
  device: string;
  error_message: string;
  error_code: string;
};
