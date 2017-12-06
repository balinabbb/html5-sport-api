import React from 'react';
import { Table, Button, Modal, Input, Form, Select } from 'antd';
import api from '../../api';

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
        title: 'Sport Név',
        dataIndex: 'sportName',
        key: 'sportName',
    },
    {
        title: 'Minimum',
        dataIndex: 'minimum',
        key: 'minimum',
    },
    {
        title: 'Maximum',
        dataIndex: 'maximum',
        key: 'maximum',
    },
    {
        title: 'Equal',
        dataIndex: 'equal',
        key: 'equal',
    },
]
//TODO condition picklist ????WTF
const defaultFormState = {
    name: '',
    description: '',
    minimum: '',
    maximum: '',
    equal: '',
    sportId: null
}

export default class extends React.Component {
    state = {
        items: [],
        conditionTypes: [],
        sports: [],
        selectedCondition: null,
        modalVisible: false,
        ...defaultFormState
    }

    nameInput = null
    descriptionInput = null

    fetchItems() {
        const { selectedCondition } = this.state;
        api.condition.all(selectedCondition)(items =>
            this.setState({ items })
        )
    }

    componentWillMount() {
        api.conditionType.idName()(conditionTypes =>
            this.setState({
                conditionTypes,
                selectedCondition: conditionTypes.length > 0 && conditionTypes[0].id
            }, () =>
                    conditionTypes.length > 0 && this.fetchItems()
            ))
        api.sport.idName()(sports =>
            this.setState({ sports, sportId: sports.length > 0 && sports[0].id })
        )
    }

    closeModal() {
        this.setState({ modalVisible: false })
    }

    modalSaveClick() {
        const {
            name, description,
            minimum, maximum, equal,
            sportId, selectedCondition
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
            minimum, maximum, equal,
            sportid: sportId, typeid: selectedCondition
        }
        api.conditionType.save(body)(() =>
            this.setState(defaultFormState, () => this.fetchItems())
        );
    }

    getFormContent() {
        const { name, description, minimum, maximum, equal, sports, sportId } = this.state;
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
                <Form.Item label="Minimum">
                    <Input
                        value={minimum}
                        onChange={e => this.setState({ minimum: e.target.value })} />
                </Form.Item>
                <Form.Item label="Maximum">
                    <Input
                        value={maximum}
                        onChange={e => this.setState({ maximum: e.target.value })} />
                </Form.Item>
                <Form.Item label="Equal">
                    <Input
                        value={equal}
                        onChange={e => this.setState({ equal: e.target.value })} />
                </Form.Item>
                <Form.Item label="Sport">
                    <Select
                        value={sportId}
                        onChange={e => this.setState({ sportId: e })}
                        style={{ width: '100%' }}
                    >
                        {sports.map(({ id, name }) => (
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
        const { items, modalVisible, selectedCondition, conditionTypes } = this.state;
        const { name: selectedConditionName } = conditionTypes.find(({ id }) => id === selectedCondition) || {};
        return (
            <div>
                <Select
                    value={selectedCondition}
                    onChange={e => this.setState({ selectedCondition: e }, () => this.fetchItems())}
                    style={{ minWidth: 200, marginRight: 20 }}
                >
                    {conditionTypes.map(({ id, name }) => (
                        <Select.Option key={id} value={id}>
                            {name}
                        </Select.Option>
                    ))}
                </Select>
                <Button
                    icon="plus"
                    type="primary"
                    onClick={() => this.setState({ modalVisible: true })}
                    style={{ marginBottom: 20 }}>Új condition</Button>
                <Table
                    dataSource={items.map(x => ({
                        ...x,
                        key: x.id,
                        sportName: x.sport && x.sport.name
                    }))}
                    columns={columns}
                />
                <Modal
                    visible={modalVisible}
                    title={`Új condition (${selectedConditionName})`}
                    onCancel={() => this.closeModal()}
                    footer={(
                        <Button
                            type="primary"
                            onClick={() => this.modalSaveClick()}
                        >
                            Mentés
                        </Button>
                    )}
                >
                    {this.getFormContent()}
                </Modal>
            </div>
        )
    }
}