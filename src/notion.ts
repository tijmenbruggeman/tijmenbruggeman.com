import slugify from 'slugify';
const token = 'secret_tsDCiwKhlxbP5KTN1ng2owQD3OWE37mnuUBhmgnnabM';
import { Client } from '@notionhq/client';

// Initializing a client
export const notion = new Client({
  auth: token,
});

let databases = {};
async function retrieveBlockChildren(blockId: string) {
    const { results } = await notion.blocks.children.list({
        block_id: blockId,
    });
    return results;
}
export async function queryDatabase(databaseId: string) {
    if (databases[databaseId]) return databases[databaseId];

    const { results } = await notion.databases.query({
        database_id: databaseId,
        filter: {
            select: {
                equals: 'public'
            },
            property: 'visibility',
            type: "select",
        }
    });
    const pagesPromise = results.map(async (page: any) => {
        const { properties, created_time, last_edited_time } = page;
        const { title: titleCol } = properties;
        if (!titleCol) return undefined;
        const { title: titleArray } = titleCol;
        const [{ plain_text: title }] = titleArray;
        const children = await retrieveBlockChildren(page.id);
        return {
            id: page.id,
            updatedAt: last_edited_time.split('T')[0],
            createdAt: created_time,
            title,
            slug: slugify(title, { lower: true, trim: true }),
            children,
            properties,
        }
    });

    const pages = await Promise.all(pagesPromise);
    const validPages = pages.filter(Boolean);
    databases[databaseId] = validPages;
    return validPages;
}

function queryPage(pageId: string) {
    return notion.pages.retrieve({ page_id: pageId });
}

export async function getPage(pageId: string): Promise<any> {
    const [page, children] = await Promise.all([
        queryPage(pageId),
        retrieveBlockChildren(pageId),
    ]);
    return {
        page,
        children,
    }
}