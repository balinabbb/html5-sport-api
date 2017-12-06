import React from 'react';
import { Table, Breadcrumb, Modal, Button, Form, Input } from 'antd';
import api from '../../api';

const eventColumns = [
    {
        title: 'Azonosító',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Sport',
        dataIndex: 'sportName',
        key: 'sportName'
    },
    {
        title: 'Specializáció',
        dataIndex: 'specializationName',
        key: 'specializationName'
    },
    {
        title: 'Fordulók',
        dataIndex: 'roundNames',
        key: 'roundNames'
    },
]

export default class extends React.Component {
    state = {
        selectedEvent: null,
        addRoundName: '', addRoundDescription: ''
    }

    addRoundNameInput = null
    addRoundDescriptionInput = null

    addRoundClick() {
        const {
            addRoundName: name,
            addRoundDescription: description,
            selectedEvent: { id: eventid }
        } = this.state;
        const { roundAdded } = this.props;
        const body = {
            name, description, eventid
        };
        api.championship.addRound(body)(() =>
            this.setState({ selectedEvent: null }, roundAdded({ eventid, name, description }))
        )
    }

    renderAddRoundForm() {
        const { addRoundName: name, addRoundDescription: description } = this.state;
        return (
            <div>
                <Form.Item label="Név" help="A mező megadása kötelező" required>
                    <Input
                        value={name}
                        ref={e => this.addRoundNameInput = e}
                        onChange={e => this.setState({ addRoundName: e.target.value })} />
                </Form.Item>
                <Form.Item label="Leírás" help="A mező megadása kötelező" required>
                    <Input
                        value={description}
                        ref={e => this.addRoundDescriptionInput = e}
                        onChange={e => this.setState({ addRoundDescription: e.target.value })} />
                </Form.Item>
            </div>
        )
    }

    render() {
        const { selectedEvent } = this.state;
        const { championship: {
            startDate,
            endDate,
            event: events
        } } = this.props;
        return (
            <div>
                <Breadcrumb style={{ marginBottom: 20 }}>
                    <Breadcrumb.Item>
                        {startDate || 'Nincs megadva kezdő dátum'}&nbsp;|&nbsp;
                        {endDate || 'Nincs megadva befejező dátum'}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Table
                    columns={eventColumns}
                    dataSource={events.map(x => ({
                        ...x,
                        key: x.id,
                        id: x.id,
                        sportName: x.sport && x.sport.name,
                        specializationName: x.specialization && x.specialization.name,
                        roundNames: x.round.map(({ name }) => name).join(', ')
                    }))}
                    onRow={selectedEvent => ({
                        style: { cursor: 'pointer' },
                        onClick: () => console.log(selectedEvent) || this.setState({ selectedEvent }, () => console.log(this.state.selectedEvent))
                    })}
                />
                <Modal
                    title={selectedEvent && `Új forduló (${selectedEvent.sportName})`}
                    visible={!!selectedEvent}
                    onCancel={() => this.setState({ selectedEvent: null })}
                    width={selectedEvent ? '85%' : undefined}
                    footer={(
                        <Button
                            type="primary"
                            onClick={() => this.addRoundClick()}
                        >
                            Mentés
                        </Button>
                    )}
                >
                    {this.renderAddRoundForm()}
                </Modal>
            </div>
        )
    }
}