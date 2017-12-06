import React from 'react';
import { Table, Button, Modal, Input, Form } from 'antd';
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
]

export default class extends React.Component {
    state = {
        items: [],
        modalVisible: false,
        name: '',
        description: '',
    }

    nameInput = null
    descriptionInput = null

    fetchItems() {
        api.season.all()(items => this.setState({ items }))
    }

    componentWillMount() {
        this.fetchItems();
    }

    closeModal() {
        this.setState({ modalVisible: false })
    }

    modalSaveClick() {
        const { name, description } = this.state;
        if (name === '') {
            this.nameInput.focus();
            return;
        } else if (description === '') {
            this.descriptionInput.focus();
            return;
        }
        api.season.save(name, description)(() =>
            this.setState({ name: '', description: '', modalVisible: false })
        );
    }

    getFormContent() {
        const { name, description } = this.state;
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
            </div>
        )
    }

    render() {
        const { items, modalVisible } = this.state;
        return (
            <div>
                <Button
                    icon="plus"
                    type="primary"
                    onClick={() => this.setState({ modalVisible: true })}
                    style={{ marginBottom: 20 }}>Új season</Button>
                <Table
                    dataSource={items.map(x => ({ ...x, key: x.id }))}
                    columns={columns}
                />
                <Modal
                    visible={modalVisible}
                    title="Új season"
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