const token = 'secret_tsDCiwKhlxbP5KTN1ng2owQD3OWE37mnuUBhmgnnabM';
import { Client } from '@notionhq/client';

export const ROOT_ID = '7d0f31048c764881a1e6df6c8684530d';

// Initializing a client
export const notion = new Client({
  auth: token,
});

export async function fetchChildPages(parentId: string) {
  const { results: allChildren } = await notion.blocks.children.list({
    block_id: parentId,
  });

  const withChildren = allChildren.filter(({ has_children }: any) => has_children);
  const childrenOfChildren = await Promise.all(withChildren.map(({ id }) => fetchChildPages(id)));
  const childPages = allChildren.filter(({ type }: any) => type === 'child_page');
  return [childPages, childrenOfChildren].flat(10);
}
