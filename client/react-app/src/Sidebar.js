import React from 'react';
import Select from 'react-select'
import { useState } from "react";

export default ({setSelectedDatabase}) => {
    const onDragStart = (event, nodeType) => {
        let label = "Frontend (HTML)"
        event.dataTransfer.setData('application/reactflow', nodeType);
        if(nodeType == "default"){
            label = "Web API (.NET)"
        }else if(nodeType == "output"){
            label = selected.value
        }
        event.dataTransfer.setData('label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    const options = [
        { value: 'postgres', label: 'PostgreSQL' },
        { value: 'sqlserver', label: 'SQLServer' },
        { value: 'mongodb', label: 'MongoDb' }
    ]

    const [selected, setSelected] = useState(options[0]);

    const handleChange = (selectedOption) => {
        setSelected(selectedOption);
        setSelectedDatabase(selectedOption.value);
        console.log(`Option selected:`, selectedOption);
    };

    return (
        <aside>
            <div className="description">You can drag these nodes to the pane on the left.</div>
            <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
                Frontend
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
                Web API (.NET)
            </div>
            <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
                <Select options={options} onChange={handleChange} value={selected}></Select>
            </div>
        </aside>
    );
};
