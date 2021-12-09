

type NotionPage = {
    object: 'page',
    id: string;
    created_time: string;
    last_edited_time: string;
    cover: {
        type: 'external',
        external: {
            url: string;
        }
    },
    icon: null;
    parent: {
        type: 'workspace'
    },
    archived: boolean;
    properties: {
        title: {
            id: 'title',
            type: 'title',
            title: Array<any>,
        }
    },
    url: string;
}

type NotionObjectText = {
    type: 'text';
    text: {
        content: string;
        link: string;
    };
    annotations: {
        bold: boolean;
        italic: boolean;
        strikethrough: boolean;
        underline: boolean;
        code: boolean;
        color: string;
    };
    plain_text: string;
    href: string;
}