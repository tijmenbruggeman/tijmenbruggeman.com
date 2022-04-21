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
export async function queryDatabase(databaseId = '93ad2c68a89f4a56be60d83af001240b') {
    if (databases[databaseId]) return databases[databaseId];

    const { results } = await notion.databases.query({
        database_id: databaseId,
    });
    const pagesPromise = results.map(async (page: any) => {
        const { properties, created_time, last_edited_time } = page;
        const { title: titleCol } = properties;
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
        }
    });

    const pages = await Promise.all(pagesPromise);

    databases[databaseId] = pages;
    return pages;
}