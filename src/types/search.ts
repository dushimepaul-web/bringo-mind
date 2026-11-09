export type SearchScope = 'tasks' | 'documents';

export type SearchResult = {
  id: string;
  scope: SearchScope;
  title: string;
};
