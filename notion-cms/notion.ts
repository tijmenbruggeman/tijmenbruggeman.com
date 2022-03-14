const token = 'secret_tsDCiwKhlxbP5KTN1ng2owQD3OWE37mnuUBhmgnnabM';
import { Client } from '@notionhq/client';

// Initializing a client
export const notion = new Client({
  auth: token,
});

async function fetchChildBlocks(parentId: string, startCursor?: string) {
  const { has_more, results } = await notion.blocks.children.list({
    block_id: parentId,
    page_size: 100,
    start_cursor: startCursor,
  });
  return {
    hasMoreChildren: has_more,
    results,
  };
}

export async function fetchChildren(parentId: string) {
  let hasMore = true;
  let queryResult = [];
  let lastKey = undefined;

  while (hasMore) {
    const { results, hasMoreChildren } = await fetchChildBlocks(parentId, lastKey);
    const withParent = results.map((r) => ({ ...r, parentId }));
    queryResult.push(...withParent);
    hasMore = hasMoreChildren;
  }
  return queryResult;
}

export async function fetchPage(pageId: string) {
  const result = await notion.pages.retrieve({
    page_id: pageId,
  });
  return result;
}

export async function fetchNotionContent(rootPageId: string) {
  // fetch page
  const page = await fetchPage(rootPageId);
  console.log('page:', page);
  // fetch children
  const children = await fetchChildren(rootPageId);
  const childrenWithChildren = children.filter((c) => c.has_children);
  const childrenOfChildren = await Promise.all(childrenWithChildren.map(({ id }) => fetchChildren(id)));

  return [page, ...children, ...childrenOfChildren].flat(2);
}
