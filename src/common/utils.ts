import fuzzy from 'fuzzy';

export function fuzzySearch(input: string, source: string[]) {
    return Promise.resolve(fuzzy.filter(input, source).map((result) => result.original));
}
