// DEPRECATED: Use services/api.ts instead.
// This file is kept temporarily to prevent breaking any residual imports during refactor.
import { api } from './api';

export const generateNewsContent = async (rawText: string) => {
  console.warn("Using deprecated client-side AI service. Please switch to api.generateContent()");
  const data = await api.generateContent(rawText);
  return {
    title: data.headline,
    summary: data.summary,
    category: data.category,
    tags: data.tags,
    isAiGenerated: true
  };
};