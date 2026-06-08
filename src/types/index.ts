export type Revision = {
  id: string;
  parentId: string | null;
  label: string;
  timestamp: number;
  imageDataUrl: string;
  userRequest: string | null;
  summary: string | null;
  changes: string[];
  renderPrompt: string | null;
};

export type ReviseRequest = {
  imageBase64: string;
  mimeType: string;
  userRequest: string;
  history: { userRequest: string; summary: string }[];
};

export type ReviseResponse = {
  summary: string;
  changes: string[];
  renderPrompt: string;
  imageBase64: string;
  mimeType: string;
};

export type ReviseError = {
  error: string;
};
