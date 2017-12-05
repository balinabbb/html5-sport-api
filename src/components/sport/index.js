import React from 'react';
import { Table } from 'antd';
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
        items: []
    }

    componentWillMount() {
        api.sport.all()(items => this.setState({ items }))
    }

    render() {
        const { items } = this.state;
        return (
            <Table
                dataSource={items.map(x => ({ ...x, key: x.id }))}
                columns={columns} />
        )
    }
}