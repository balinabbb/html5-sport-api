import { call } from './';

const baseUrl = 'championship';

export default {
    all: () => call(`${baseUrl}/entity/all`),
    idName: () => call(`${baseUrl}/idname/all`),
    nameDescription: () => call(`${baseUrl}/namedescription/all`),
    getById: (championshipId) => call(`${baseUrl}/${championshipId}`),
    getEventsById: (championshipId) => call(`${baseUrl}/events/idname/${championshipId}`),

    save: (body) => call(`${baseUrl}/save`, 'post', { body }),
    addRound: (body) => call(`${baseUrl}/addround`, 'post', { body }),
    addSport: (body) => call(`${baseUrl}/addsport`, 'post', { body }),
}