export interface IMetadata {
  [key: string]: string;
}

export interface IEmbeddedEntity {
  id: string;
  name: string;
  shortDescription: string;
  metadata: string;
  embedding: number[];
}
