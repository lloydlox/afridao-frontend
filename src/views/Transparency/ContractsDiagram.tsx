import { Container, Grid, Typography, useTheme } from "@material-ui/core";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import { useEffect, useState } from "react";
import ReactFlow from "react-flow-renderer";
import BackButton from "src/components/BackButton";
import { BottomMultipleHandleNode } from "src/components/Transparency/CustomNode";

import { initialEdges, initialNodes } from "./contractNodes";

export const ContractsDiagram = (): JSX.Element => {
  const theme = useTheme();
  const [nodes, setNodes] = useState(initialNodes(theme));
  const [edges, setEdges] = useState(initialEdges(theme));

  useEffect(() => {
    setNodes(initialNodes(theme));
    setEdges(initialEdges(theme));
  }, [theme]);

  const edgeTypes = {
    smartBezier: SmartBezierEdge,
  };

  const nodeTypes = {
    bottomMultiple: BottomMultipleHandleNode,
  };

  // TODO fix incompatibility with Paper from component-library (but not MUI) which results in the edge paths not being positioned correctly

  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <BackButton />
          </Grid>
          <Grid item xs={10} />
          <Grid item xs={12}>
            <Typography variant="h2">Treasury Contracts</Typography>
          </Grid>
          <Grid item xs={12}>
            {/* We wrap the ReactFlow component with a container that specifies the height,
             * as passing the height to the Paper component does not work (since it has child
             * components).
             */}
            <Container style={{ height: "60vh", width: "100vw" }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodesDraggable={false}
                nodesConnectable={false}
                edgeTypes={edgeTypes}
                nodeTypes={nodeTypes}
                fitView
              />
            </Container>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};