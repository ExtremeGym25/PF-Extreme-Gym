"use server"
import { IComment } from "@/app/tipos"
import axios from "axios"

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export const getCommentsByPublicationId = async (publicationId: string) => {
  const response = await axiosApiBack.get(`/comments/publication/${publicationId}`, {
  })
  return response.data
}

export const createComment = async ( commentData: { content: string; publicationId: string}, token: string) => {
  const response = await axiosApiBack.post(`/comments`, commentData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}
export const updateComment = async (id: string, content: string, token: string) => {
  const response = await axiosApiBack.put(
    `/comments/${id}`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data
};
export const deleteComments = async (id: string, token: string) => {
  const response = await axiosApiBack.delete(`/comments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


