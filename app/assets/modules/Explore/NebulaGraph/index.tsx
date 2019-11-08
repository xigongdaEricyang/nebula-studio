import React from 'react';
import { connect } from 'react-redux';

import { NebulaToD3Data } from '#assets/components';
import { IRootState } from '#assets/store';

import Panel from './Pannel';

const mapState = (state: IRootState) => ({
  nodes: state.explore.nodes,
  links: state.explore.links,
});

const mapDispatch = () => ({});

interface IProps {
  nodes: any[];
  links: any[];
}

const NebulaGraph = (props: IProps) => {
  const { nodes, links } = props;

  return (
    <div className="graph-wrap">
      <Panel />
      <NebulaToD3Data width={1200} height={900} data={{ nodes, links }} />;
    </div>
  );
};

export default connect(
  mapState,
  mapDispatch,
)(NebulaGraph);