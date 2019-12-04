import { Form, Icon, Radio, Select, Table, Tooltip } from 'antd';
import _ from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';

import { IDispatch, IRootState } from '#assets/store';

import './Tag.less';

const mapState = (state: IRootState) => {
  const activeVertexIndex = state.importData.activeVertexIndex;
  const vertex = state.importData.vertexesConfig[activeVertexIndex];

  return {
    // each tag only one configed in per vertex
    tags: _.difference(state.nebula.tags, vertex.tags.map(tag => tag.name)),
    host: state.nebula.host,
    username: state.nebula.username,
    password: state.nebula.password,
    currentSpace: state.nebula.currentSpace,
  };
};

const mapDispatch = (dispatch: IDispatch) => ({
  asyncUpdateTagConfig: dispatch.importData.asyncUpdateTagConfig,
  refresh: dispatch.importData.refreshVertexesConfig,
});

interface IProps
  extends ReturnType<typeof mapState>,
    ReturnType<typeof mapDispatch> {
  data: any;
  index: number;
}

const FormItem = Form.Item;
const Option = Select.Option;

class Tag extends React.Component<IProps> {
  handleTagChange = async tag => {
    const {
      host,
      username,
      password,
      currentSpace: space,
      index: tagIndex,
    } = this.props;
    await this.props.asyncUpdateTagConfig({
      host,
      username,
      password,
      space,
      tagIndex,
      tag,
    });
  };

  handlePropChange = (index, field, value) => {
    const { data } = this.props;
    switch (field) {
      case 'idHash':
        data.props[index].idHash = value;
        break;
      case 'setId':
        data.props.forEach(prop => (prop.setId = false));
        data.props[index].setId = true;
        break;
    }

    this.props.refresh();
  };

  renderTableTitle = (title, desc) => {
    return (
      <p className="title-content">
        {title}
        <Tooltip title={desc}>
          <Icon type="info-circle" />
        </Tooltip>
      </p>
    );
  };

  renderPropsTable = (props, tag) => {
    const render = this.renderTableTitle;
    const columns = [
      {
        title: render(
          intl.get('import.prop'),
          intl.get('import.propTip', { tag }),
        ),
        dataIndex: 'prop',
      },
      {
        title: render(
          intl.get('import.mapping'),
          intl.get('import.mappingTip'),
        ),
        dataIndex: 'mapping',
        render: () => 1,
      },
      {
        title: render(intl.get('import.type'), intl.get('import.typeTip')),
        dataIndex: 'type',
        render: value => (
          <Select value={value} disabled={true}>
            <Option value={value}>{value}</Option>
          </Select>
        ),
      },
      {
        title: render(
          intl.get('import.setVertexId'),
          intl.get('import.setVertexIdTip'),
        ),
        dataIndex: 'setId',
        render: (value, _, index) => (
          <Radio
            checked={value}
            onChange={() => this.handlePropChange(index, 'setId', true)}
          />
        ),
      },
      {
        title: render(intl.get('import.idHash'), intl.get('import.idHashTip')),
        dataIndex: 'idHash',
        render: (value, record, index) => {
          if (record.setId) {
            return (
              <Select
                value={value}
                onChange={v => this.handlePropChange(index, 'idHash', v)}
              >
                <Option value="unset">{intl.get('import.unset')}</Option>
                <Option value="uuid">{intl.get('import.uuid')}</Option>
                <Option value="hash">{intl.get('import.hash')}</Option>
              </Select>
            );
          } else {
            return '-';
          }
        },
      },
    ];

    return (
      <Table
        className="props-table"
        dataSource={props}
        columns={columns}
        rowKey="prop"
        pagination={false}
      />
    );
  };

  render() {
    const { index, tags, data } = this.props;

    return (
      <div className="tag-config">
        <h3>TAG{index}</h3>
        <FormItem label="TAG">
          <Select
            className="tag-select"
            value={data.name}
            onChange={this.handleTagChange}
          >
            {tags.map(t => (
              <Option value={t} key={t}>
                {t}
              </Option>
            ))}
          </Select>
        </FormItem>
        {this.renderPropsTable(data.props, data.name)}
      </div>
    );
  }
}

export default connect(
  mapState,
  mapDispatch,
)(Tag);
