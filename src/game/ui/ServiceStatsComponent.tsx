import React from 'react';
import { useGetServiceStatsMap } from './selectors';
import { Button, Divider, Modal, Table } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '20%',
  },
  {
    title: 'Average',
    dataIndex: 'average',
    key: 'average',
    width: '20%',
    sorter: function(a: any, b: any) {
      return a.average.localeCompare(b);
    },
    // sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Current',
    dataIndex: 'current',
    key: 'current',
    width: '20%',
    sorter: function(a: any, b: any) {
      return a.average.localeCompare(b);
    },
  },
  {
    title: 'Min',
    dataIndex: 'min',
    key: 'min',
    width: '20%',
  },
  {
    title: 'Max',
    dataIndex: 'max',
    key: 'max',
    width: '20%',
  },
];

const totalColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '20%',
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    width: '20%',
  },
];

export function ServiceStatsComponent() {
  let serviceStatsMap = useGetServiceStatsMap();
  let [show, setShow] = React.useState(false);

  let dataSource = Object.values(serviceStatsMap).map(stat => {
    return {
      name: stat.name,
      key: stat.name,
      min: `${stat.min.toFixed(2)}ms`,
      max: `${stat.max.toFixed(2)}ms`,
      average: `${stat.average.toFixed(2)}ms`,
      current: `${stat.current.toFixed(2)}ms`,
    };
  });

  let total = Object.values(serviceStatsMap).reduce((total, next) => total + next.current, 0);

  let totalDataSource = [
    {
      name: 'Total',
      key: 'Total',
      total: `${total.toFixed(2)}ms`,
    },
  ];

  return (
    <div style={{ cursor: 'pointer' }}>
      <Divider />
      <Button onClick={() => setShow(true)} type={'primary'}>
        Show stats
      </Button>
      <Modal
        title={'Stats'}
        visible={show}
        onOk={() => setShow(false)}
        onCancel={() => setShow(false)}
        width={'90%'}
      >
        <Table columns={columns} dataSource={dataSource} size={'small'} pagination={false} />
        <Table
          columns={totalColumns}
          dataSource={totalDataSource}
          size={'small'}
          pagination={false}
        />
      </Modal>
    </div>
  );
}
