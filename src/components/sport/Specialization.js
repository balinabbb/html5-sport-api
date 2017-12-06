import React from 'react';
import { Button, Table, Modal, Form, Input } from 'antd';
import api from '../../api';

const defaultState = {
    modalVisible: false,
    name: '',
    description: ''
}

export default class extends React.Component {
    state = defaultState

    modalSaveClick() {
        const { sportId, didAddSpecialization } = this.props;
        const { name, description } = this.state;
        api.specialization.save(sportId, name, description)(
            () => this.setState(defaultState,
                () => didAddSpecialization(name, description))
        );
    }

    render() {
        const { modalVisible, name, description } = this.state;
        const { items, columns } = this.props;
        return (
            <div>
                <Button
                    icon="plus"
                    type="primary"
                    onClick={() => this.setState({ modalVisible: true })}
                    style={{ marginBottom: 20 }}>Új specializáció</Button>
                <Table
                    dataSource={items.map(x => ({ ...x, key: x.id }))}
                    columns={columns}
                />
                <Modal
                    title='Új specializáció'
                    visible={modalVisible}
                    onCancel={() => this.setState({ modalVisible: false })}
                    okText="Mentés"
                    cancelText="Mégsem"
                    onOk={() => this.modalSaveClick()}
                >
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
                </Modal>
            </div>
        )
    }
}