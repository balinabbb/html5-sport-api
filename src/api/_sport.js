import { call } from './';

const baseUrl = 'sport';

export default {
    all: () => call(`${baseUrl}/entity/all`),
    page: (order, offset, limit) => call(`${baseUrl}/entity/page?order=${order}&offset=${offset}&limit=${limit}`),
    idName: () => call(`${baseUrl}/idname/all`),
    nameDescription: () => call(`${baseUrl}/namedescription/all`),
    getById: (id) => call(`${baseUrl}/${id}`),

    save: (name, description) => call(`${baseUrl}/save`, 'post', { body: {name, description}}),
}