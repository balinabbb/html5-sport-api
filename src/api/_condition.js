import { call } from './';

const baseUrl = 'condition';

export default {
    all: (conditionTypeId) => call(`${baseUrl}/entity/all/${conditionTypeId}`),
    page: (conditionTypeId, order, offset, limit) => call(`${baseUrl}/entity/page/${conditionTypeId}?order=${order}&offset=${offset}&limit=${limit}`),
    idName: (conditionTypeId) => call(`${baseUrl}/idname/all/${conditionTypeId}`),
    nameDescription: (conditionTypeId) => call(`${baseUrl}/namedescription/all/${conditionTypeId}`),
    getById: (id) => call(`${baseUrl}/${id}`),
    pickList: (sportId) => call(`${baseUrl}/${sportId}`),

    save: (body) => call(`${baseUrl}/save`, 'post', { body }),
}