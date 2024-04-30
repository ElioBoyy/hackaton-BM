import axios, { AxiosResponse } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

export async function axiosQuery(endpoint: string, method: string, payload: any, auth: any): Promise<AxiosResponse<any> | null> {
  try {
    return await axiosType({ endpoint, method, payload, auth });
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return null;
  }
}

const axiosType = async (props: { endpoint: string, method: string, payload: any, auth: any }): Promise<AxiosResponse<any>> => {
  const baseUrl = 'http://localhost:3333';
  const url = baseUrl + props.endpoint;

  if (props.method === 'GET') {
    return await axios.get(url, { headers: { Authorization: `Bearer ${props.auth}` } });
  } else if (props.method === 'POST') {
    return await axios.post(url, props.payload, { headers: { Authorization: `Bearer ${props.auth}` } });
  } else if (props.method === 'PUT') {
    return await axios.put(url, props.payload, { headers: { Authorization: `Bearer ${props.auth}` } });
  } else if (props.method === 'DELETE') {
    return await axios.delete(url, { headers: { Authorization: `Bearer ${props.auth}` } });
  } else {
    throw new Error(`Unsupported method: ${props.method}`);
  }
}
