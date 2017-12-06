import React from 'react';
import moment from 'moment';
import { Table, Button, Modal, Input, Form, Select, DatePicker } from 'antd';
import api from '../../api';
import Events from './Events';

const columns = [
    {
        title: 'Azonosító',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Név',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Leírás',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Seria',
        dataIndex: 'seriaName',
        key: 'seriaName',
    },
    {
        title: 'Season',
        dataIndex: 'seasonName',
        key: 'seasonName',
    },
    {
        title: 'Kezdő dátum',
        dataIndex: 'startDate',
        key: 'startDate',
    },
    {
        title: 'Befejező dátum',
        dataIndex: 'endDate',
        key: 'endDate',
    },
]
const defaultFormState = {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    seasonId: null,
    seriaId: null,
    conditions: []
}

export default class extends React.Component {
    state = {
        items: [],
        seasons: [],
        serie: [],
        possibleConditions: [],
        selectedChampionship: null,
        modalVisible: false,
        ...defaultFormState
    }

    nameInput = null
    descriptionInput = null

    fetchItems() {
        api.championship.all()(items => this.setState({ items }));

        api.seria.idName()(serie => this.setState({ serie, seriaId: serie[0] && serie[0].id }))
        api.season.idName()(seasons => this.setState({ seasons, seasonId: seasons[0] && seasons[0].id }))
        api.conditionType.idName()(possibleConditions => this.setState({ possibleConditions }))
    }

    componentWillMount() {
        this.fetchItems();
    }

    closeModal() {
        this.setState({ modalVisible: false, selectedChampionship: null })
    }

    modalSaveClick() {
        const {
            name, description,
            startDate, endDate,
            seasonId, seariaId, conditions
        } = this.state;

        if (name === '') {
            this.nameInput.focus();
            return;
        } else if (description === '') {
            this.descriptionInput.focus();
            return;
        }
        const body = {
            name, description,
            startDate, endDate,
            seasonid: seasonId,
            seariaid: seariaId,
            conditionid: conditions
        };
        api.conditionType.save(body)(() =>
            this.setState(defaultFormState, () => this.fetchItems())
        );
    }

    getFormContent() {
        const { name, description, startDate, endDate, seasonId, seriaId, serie, seasons, conditions, possibleConditions } = this.state;
        return (
            <div>
                <Form.Item label="Név" help="A mező megadása kötelező" required>
                    <Input
                        value={name}
                        ref={e => this.nameInput = e}
                        onChange={e => this.setState({ name: e.target.value })} />
                </Form.Item>
                <Form.Item label="Leírás" help="A mező megadása kötelező" required>
                    <Input
                        value={description}
                        ref={e => this.descriptionInput = e}
                        onChange={e => this.setState({ description: e.target.value })} />
                </Form.Item>
                <Form.Item label="Kezdő dátum">
                    <DatePicker
                        style={{ width: '100%' }}
                        value={startDate ? moment(startDate) : moment()}
                        onChange={e => this.setState({ startDate: e.format() })} />
                </Form.Item>
                <Form.Item label="Befejező dátum">
                    <DatePicker
                        style={{ width: '100%' }}
                        value={endDate ? moment(endDate) : moment().add(1, 'months')}
                        onChange={e => this.setState({ endDate: e.format() })} />
                </Form.Item>
                <Form.Item label="Seria">
                    <Select
                        value={seriaId}
                        onChange={e => this.setState({ seriaId: e })}
                        style={{ width: '100%' }}
                    >
                        {serie.map(({ id, name }) => (
                            <Select.Option key={id} value={id}>
                                {name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Season">
                    <Select
                        value={seasonId}
                        onChange={e => this.setState({ seasonId: e })}
                        style={{ width: '100%' }}
                    >
                        {seasons.map(({ id, name }) => (
                            <Select.Option key={id} value={id}>
                                {name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Feltételek">
                    <Select
                        mode='multiple'
                        value={conditions}
                        onChange={e => this.setState({ conditions: e })}
                        style={{ width: '100%' }}
                    >
                        {possibleConditions.map(({ id, name }) => (
                            <Select.Option key={id} value={id}>
                                {name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>
        )
    }

    render() {
        const { items, modalVisible, selectedChampionship } = this.state;
        return (
            <div>
                <Button
                    icon="plus"
                    type="primary"
                    onClick={() => this.setState({ modalVisible: true })}
                    style={{ marginBottom: 20 }}>Új championship</Button>
                <Table
                    dataSource={items.map(x => ({
                        ...x,
                        key: x.id,
                        seriaName: x.seria && x.seria.name,
                        seasonName: x.season && x.season.name,
                    }))}
                    columns={columns}
                    onRow={(selectedChampionship) => ({
                        onClick: () => this.setState({ selectedChampionship, modalVisible: true }),
                        style: { cursor: 'pointer' }
                    })}
                />
                <Modal
                    visible={modalVisible}
                    title={selectedChampionship ?
                        `${selectedChampionship.name} - események`
                        : 'Új championship'}
                    onCancel={() => this.closeModal()}
                    width={selectedChampionship ? '80%' : undefined}
                    footer={(
                        <Button
                            type="primary"
                            onClick={() => selectedChampionship ? this.closeModal() : this.modalSaveClick()}
                        >
                            {selectedChampionship ? 'OK' : 'Mentés'}
                        </Button>
                    )}
                >
                    {selectedChampionship ?
                        <Events
                            championship={selectedChampionship}
                            roundAdded={({ name }) => console.log(name)}/>
                        : this.getFormContent()}
                </Modal>
            </div>
        )
    }
}