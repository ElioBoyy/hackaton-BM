import axios, { AxiosResponse } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

export async function axiosQuery(endpoint: string, method: string, payload: any): Promise<AxiosResponse<any> | null> {
  try {
    return await axiosType({ endpoint, method, payload });
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return null;
  }
}

const axiosType = async (props: { endpoint: string, method: string, payload: any }): Promise<AxiosResponse<any>> => {
  const baseUrl = 'http://localhost:3333';
  const url = baseUrl + props.endpoint;

  if (props.method === 'GET') {
    return await axios.get(url);
  } else if (props.method === 'POST') {
    return await axios.post(url, props.payload);
  } else if (props.method === 'PUT') {
    return await axios.put(url, props.payload);
  } else if (props.method === 'DELETE') {
    return await axios.delete(url);
  } else {
    throw new Error(`Unsupported method: ${props.method}`);
  }
}