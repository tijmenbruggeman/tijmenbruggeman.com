const token = 'secret_tsDCiwKhlxbP5KTN1ng2owQD3OWE37mnuUBhmgnnabM';
import { Client } from '@notionhq/client';

// Initializing a client
export const notion = new Client({
  auth: token,
});