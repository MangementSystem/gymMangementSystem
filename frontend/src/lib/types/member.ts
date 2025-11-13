export type Member = {
  id: string | number;
  name: string;
  email?: string;
  status?: string;
  plan?: {
    id?: string | number;
    name?: string;
  } | null;
};
