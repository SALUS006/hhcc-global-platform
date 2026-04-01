export const PROFILE_SERVICE_URL =
  process.env.PROFILE_SERVICE_URL || 'http://ms-profile-service:8080/api/v1';

export const SCHEDULING_SERVICE_URL =
  process.env.SCHEDULING_SERVICE_URL || 'http://ms-scheduling-service:8081/api/v1';

export const PAYMENT_SERVICE_URL =
  process.env.PAYMENT_SERVICE_URL || 'http://ms-payment-service:8082/api/v1';

export const STUB_MODE = process.env.STUB_MODE === 'true';
