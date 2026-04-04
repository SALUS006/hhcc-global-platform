import axios, { AxiosRequestConfig, Method } from 'axios';
import { Request, Response } from 'express';

/**
 * Reusable Axios proxy helper.
 * Forwards the request to the target microservice URL, passing along
 * the X-Mock-User-Id header and request body.
 */
export async function proxyRequest(
  method: Method,
  targetUrl: string,
  req: Request,
  res: Response
): Promise<void> {
  const config: AxiosRequestConfig = {
    method,
    url: targetUrl,
    headers: {
      'Content-Type': req.headers['content-type'] || 'application/json',
      ...((req as any).user
        ? { 
            'X-User-Id': String((req as any).user.userId),
            'X-User-Role': (req as any).user.role 
          }
        : {}),
    },
    params: req.query,
  };

  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    config.data = req.body;
  }

  try {
    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(502).json({ error: 'Bad Gateway', message: 'Downstream service unavailable' });
    }
  }
}
