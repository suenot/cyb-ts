import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ForceGraph3D, ForceGraph2D } from 'react-force-graph';
// import { useSubscription } from '@apollo/react-hooks';
// import gql from 'graphql-tag';
import { getGraphQLQuery } from '../../utils/search/utils';
import { Loading } from '../../components';

// const GET_CYBERLINKS = `
// query Cyberlinks {
//   cyberlink(limit: 420, order_by: {height: desc}, where: {subject: {_eq: "cyber12u6qgyrdsy4xmw04vfkkkh9a9tqzw66gsay86k"}}) {
//     object_from
//     object_to
//     subject
//     txhash
//   }
// }
// `;

// query Cyberlinks {
//   cyberlink(limit: 1000, where: {object_from: {_eq: "QmPLSA5oPqYxgc8F7EwrM8WS9vKrr1zPoDniSRFh8HSrxx"}}) {
//     object_to
//     subject
//   }
// }

// const CYBERLINK_SUBSCRIPTION = gql`
//   subscription newCyberlinkLink {
//     cyberlink(limit: 1, order_by: { height: desc }) {
//       object_from
//       object_to
//       subject
//       txhash
//     }
//   }
// `;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const ForceGraph = ({ match }) => {
  let graph;
  const { agent } = match.params;
  const [data, setItems] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const fgRef = useRef();

  var limit = 1024
  var where
  useEffect(() => {
    const feachData = async () => {
      if (typeof(agent) != "undefined") {
        where = `{subject: {_eq: "${agent}"}}`
      } else { 
        where = "{}"
      }
      var GET_CYBERLINKS_NEW = `
      query Cyberlinks {
        cyberlink(limit: ${String(limit)}, order_by: {height: desc}, where: ${where}) {
          object_from
          object_to
          subject
          txhash
        }
      }
      `;
      const { cyberlink } = await getGraphQLQuery(GET_CYBERLINKS_NEW);
      const from = cyberlink.map((a) => a.object_from);
      const to = cyberlink.map((a) => a.object_to);
      const set = new Set(from.concat(to));
      const object = [];
      set.forEach(function (value) {
        object.push({ id: value });
      });

      for (let i = 0; i < cyberlink.length; i++) {
        cyberlink[i] = {
          source: cyberlink[i].object_from,
          target: cyberlink[i].object_to,
          name: cyberlink[i].txhash,
          subject: cyberlink[i].subject,
          // curvative: getRandomInt(20, 500) / 1000,
        };
      }
      graph = {
        nodes: object,
        links: cyberlink,
      };
      setItems(graph);
      setLoading(false);
    };
    feachData();
  }, []);

  const handleNodeClick = useCallback(
    (node) => {
      const distance = 300;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        5000
      );
    },
    [fgRef]
  );

  const handleLinkClick = useCallback(
    (link) => {
      const node = link.target;
      const distance = 300;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        5000
      );
    },
    [fgRef]
  );

  const handleNodeRightClick = useCallback(
    (node) => {
      window.open(`https://cyber.page/ipfs/${node.id}`, '_blank');
    },
    [fgRef]
  );

  const handleLinkRightClick = useCallback(
    (link) => {
      window.open(`https://cyber.page/network/euler/tx/${link.name}`, '_blank');
    },
    [fgRef]
  );

  const handleEngineStop = useCallback(() => {
    console.log('engine stopped!');
  });

  // const handleNewLink = useCallback(subscription => {
  //   let link = subscription["subscriptionData"].data["cyberlink"][0]
  //     let { nodes, links } = data;
  //     let l = {
  //       source: link["object_from"],
  //       target: link["object_to"],
  //       name: link["txhash"]
  //     }

  //     if (!nodes.some(node => node["id"] == l["source"])) {
  //       nodes.push({id: l["source"]})
  //     }

  //     if (!nodes.some(node => node["id"] == l["target"])) {
  //       nodes.push({id: l["target"]})
  //     }

  //     setItems({
  //         nodes: [...nodes],
  //         links: [...links, {
  //           source: l["source"],
  //           target: l["target"],
  //           name: l["name"],
  //           curvative: getRandomInt(20,500)/1000
  //         }]
  //     })
  // }, [data])

  // const { loading: loadingLinks, data: dataNew } = useSubscription(CYBERLINK_SUBSCRIPTION, {
  //   onSubscriptionData: handleNewLink
  // });

  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          height: '50vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Loading />
      </div>
    );
  }

  var pocket
  if (localStorage.getItem('pocket') != null) {
    var localStoragePocketData = JSON.parse(localStorage.getItem('pocket'));
    var keyPocket = Object.keys(localStoragePocketData)[0];
    pocket = localStoragePocketData[keyPocket]["cyber"].bech32
  }

  return (
    <div>
      <ForceGraph3D
        graphData={data}
        ref={fgRef}
        showNavInfo
        backgroundColor="#000000"
        warmupTicks={420}
        cooldownTicks={0}
        // cooldownTime={2000}
        enableNodeDrag={false}
        enablePointerInteraction
        // nodeId="object"
        nodeLabel="id"
        nodeColor={() => 'rgba(0,100,235,1)'}
        nodeOpacity={1.0}
        nodeRelSize={6}
        // linkSource="object_from"
        // linkTarget="object_to"
        // linkLabel="txhash"
        // linkColor={() => 'rgba(9,255,13,1)'}
        linkColor={(link) =>
          localStorage.getItem('pocket') != null ?
          link.subject == pocket
            ? 'red'
            : 'rgba(9,255,13,1)'
        : 'rgba(9,255,13,1)' }
        linkWidth={3}
        linkCurvature={0.2}
        linkOpacity={0.25}
        linkDirectionalParticles={1}
        linkDirectionalParticleWidth={3}
        linkDirectionalParticleSpeed={0.02}

        onNodeClick={handleNodeRightClick}
        onNodeRightClick={handleNodeClick}
        onLinkClick={handleLinkRightClick}
        onLinkRightClick={handleLinkClick}
        // onBackgroundClick={handleBackgroundClick}
        onEngineStop={handleEngineStop}
      />
    </div>
  );
};

export default ForceGraph;
