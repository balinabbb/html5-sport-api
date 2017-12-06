import React from 'react';
import { Table, Breadcrumb } from 'antd';

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
]

export default class extends React.Component {
    state = {

    }
    render() {
        const {
            championship: {
                name, description, startDate, endDate,
            seria: { name: seriaName },
            season: { name: seasonName },
            event: events
            }
        } = this.props;
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
                    }))}
                />
            </div>
        )
    }
}