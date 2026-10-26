
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const termsDirectory = join(process.cwd(), 'src/content/terms');

function loadTerms() {
    const terms = [];

    for (const filename of readdirSync(termsDirectory)) {
        if (!/\.mdx?$/.test(filename)) continue;

        const slug = filename.replace(/\.mdx?$/, '');
        const source = readFileSync(
            join(termsDirectory, filename),
            'utf8'
        );

        
const frontmatter = source.match(
    /^\s*---\r?\n([\s\S]*?)\r?\n---/
);


        

if (!frontmatter) continue;



        function getField(name) {
            const line = frontmatter[1]
                .split(/\r?\n/)
                .find((line) => line.startsWith(`${name}:`));

            return line
                ?.slice(name.length + 1)
                .trim()
                .replace(/^["']|["']$/g, '');
        }

        const title = getField('title')
            ?.replace(/とは[？?]$/, '')
            .trim();

        const english = getField('english');

        for (const label of [title, english]) {
            if (label) {
                terms.push({ label, slug });
            }
        }
    }

    return terms.sort(
        (a, b) => b.label.length - a.label.length
    );
}

function linkText(value, terms, linked) {
    const result = [];
    let position = 0;

    while (position < value.length) {
        let best = null;

        for (const term of terms) {
            if (linked.has(term.slug)) continue;

            let index = value.indexOf(term.label, position);

            while (index !== -1) {
                const before = value[index - 1] ?? '';
                const after = value[index + term.label.length] ?? '';

                const leftOK =
                    !/^[A-Za-z0-9]/.test(term.label) ||
                    !/[A-Za-z0-9]/.test(before);

                const rightOK =
                    !/[A-Za-z0-9]$/.test(term.label) ||
                    !/[A-Za-z0-9]/.test(after);

                if (leftOK && rightOK) break;

                index = value.indexOf(term.label, index + 1);
            }

            if (
                index !== -1 &&
                (
                    !best ||
                    index < best.index ||
                    (
                        index === best.index &&
                        term.label.length > best.term.label.length
                    )
                )
            ) {
                best = { index, term };
            }
        }

        if (!best) break;

        if (best.index > position) {
            result.push({
                type: 'text',
                value: value.slice(position, best.index),
            });
        }

        result.push({
            type: 'link',
            url: `/terms/${best.term.slug}/`,
            children: [{
                type: 'text',
                value: best.term.label,
            }],
        });

        linked.add(best.term.slug);
        position = best.index + best.term.label.length;
    }

    if (position < value.length) {
        result.push({
            type: 'text',
            value: value.slice(position),
        });
    }

    return result.length
        ? result
        : [{ type: 'text', value }];
}


export default function autoLinkTerms() {
    const terms = loadTerms();



    return (tree, file) => {

        const sourcePath = (file.path ?? '').replaceAll('\\', '/');
        const ownSlug = sourcePath.match(/\/([^/]+)\.mdx?$/)?.[1];

        const linked = new Set(ownSlug ? [ownSlug] : []);

        function collectExistingLinks(node) {
            if (node.type === 'link') {
                const match = node.url?.match(
                    /^\/terms\/([^/?#]+)\/?(?:[?#].*)?$/
                );

                if (match) linked.add(match[1]);
            }

            for (const child of node.children ?? []) {
                collectExistingLinks(child);
            }
        }

        collectExistingLinks(tree);

        function walk(node) {
            if ([
                'heading',
                'link',
                'linkReference',
                'code',
                'inlineCode',
                'html',
            ].includes(node.type)) {
                return;
            }

            if (!node.children) return;

            const children = [];

            for (const child of node.children) {
                if (child.type === 'text') {
                    children.push(
                        ...linkText(child.value, terms, linked)
                    );
                } else {
                    walk(child);
                    children.push(child);
                }
            }

            node.children = children;
        }

        walk(tree);
    };
}
