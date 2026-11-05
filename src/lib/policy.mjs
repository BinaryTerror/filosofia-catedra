export const authenticated = ({ req }) => Boolean(req.user)
export const publishedOnly = ({ req }) => req.user ? true : { _status: { equals: 'published' } }
export function slugify(value) {
 return String(value || '').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
}
