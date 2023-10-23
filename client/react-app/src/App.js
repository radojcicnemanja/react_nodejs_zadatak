import logo from './logo.svg';
import axios from "axios"
import fileDownload from "js-file-download"
import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';

import './index.css';
import './App.css';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input node' },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

function App() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [database, setDatabase] = useState("postgres");
  const handleSelectedDatabase = db => {
    console.log(db.value + "adsssssssssssss")
    setDatabase(db);
  };

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('label');
      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${label}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const download = (e) => {
    let frontend = false;
    let api = false;
    let base = false;
    let fileName = "";
    let databaseName = "";
    console.log(nodes)
    nodes.forEach(element => {
      if(element.type == "input"){
        frontend = true;
      }else if(element.type == "default"){
        api = true;
      }else {
        base = true;
        databaseName = element.data.label
      }
    });
    if(frontend){
      fileName = "frontend";
    }
    if(api){
      fileName = fileName + "api";
    }
    if(base){
      fileName = fileName + databaseName;
    }
    console.log(fileName)
    if(fileName == "frontend"){
      return
    }
    e.preventDefault();
    axios({
      url: "http://localhost:4000/"+fileName,
      method: "GET",
      responseType: "blob"
    }).then((res) => {
      console.log(res);
      fileDownload(res.data, `${fileName}.zip`);
    });
  };

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar setSelectedDatabase={handleSelectedDatabase} />
        <button onClick={download}>EXPORT</button>
      </ReactFlowProvider>
    </div>

  );
}

export default App;
