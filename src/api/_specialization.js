import { call } from './';

const baseUrl = 'sportspecialization';

export default {
    all: (sportId) => call(`${baseUrl}/entity/${sportId}`),
    idName: (sportId) => call(`${baseUrl}/idname/${sportId}`),
    nameDescription: (sportId) => call(`${baseUrl}/namedescription/${sportId}`),

    save: (sportId, name, description) => call(`${baseUrl}/save`, 'post', {
        body: {
            name,
            description,
            parendid: sportId
        }
    }),
}