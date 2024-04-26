import axios from "axios";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function axiosQuery(endpoint: string, method: string, payload: any) {
  let response = null

  const fetchData = async () => {
    try {
      response = await axiosType
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }
  fetchData()

  return response
}

const axiosType = async (props: { endpoint: string, method: string, payload: any }) => {
  if (props.method === 'GET') {
    return await axios.get('http://localhost:3333' + props.endpoint)
  } else if (props.method === 'POST') {
    return await axios.post('http://localhost:3333' + props.endpoint, props.payload)
  } else if (props.method === 'PUT') {
    return await axios.put('http://localhost:3333' + props.endpoint, props.payload)
  } else if (props.method === 'DELETE') {
    return await axios.delete('http://localhost:3333' + props.endpoint)
  } else {
    return null
  }
}