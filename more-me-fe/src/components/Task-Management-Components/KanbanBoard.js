
// import React, { useState, useEffect, useRef } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import './KanbanBoard.css';
// import { Button, Container } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { Helmet } from 'react-helmet-async';
// import { Grid } from "@mui/material";

// const initialData = {
//   columns: {
//     '1': {
//       name: 'To Do',
//       items: [
//         {
//           id: '1',
//           title: 'Design New Marketing Campaign',
//           image: 'https://via.placeholder.com/300x150',
//           comments: 1,
//           attachments: 4,
//           assignee: 'https://via.placeholder.com/32',
//         },
//         {
//           id: '2',
//           title: 'Analyze Customer Feedback',
//           image: '',
//           comments: 2,
//           attachments: 0,
//           assignee: 'https://via.placeholder.com/32',
//         },
//       ],
//     },
//     '2': {
//       name: 'In Progress',
//       items: [],
//     },
//     '3': {
//       name: 'Done',
//       items: [
//         {
//           id: '3',
//           title: 'Organize Team Meeting',
//           image: '',
//           comments: 0,
//           attachments: 0,
//           assignee: 'https://via.placeholder.com/32',
//         },
//       ],
//     },
//   },
// };

// function KanbanBoard() {
//   const [data, setData] = useState(initialData);
//   const [popupOpen, setPopupOpen] = useState(null); // Column ID for which popup is open
//   const [isAddingBoard, setIsAddingBoard] = useState(false);
//   const [newBoardName, setNewBoardName] = useState('');
//   const popupRef = useRef(null); // Ref for the popup menu

//   // Close the popup when clicking outside
//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         setPopupOpen(null);
//       }
//     };

//     if (popupOpen !== null) {
//       document.addEventListener('mousedown', handleOutsideClick);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleOutsideClick);
//     };
//   }, [popupOpen]);

//   const onDragEnd = (result) => {
//     const { source, destination } = result;

//     if (!destination) return;

//     const sourceColumn = data.columns[source.droppableId];
//     const destColumn = data.columns[destination.droppableId];
//     const sourceItems = [...sourceColumn.items];
//     const destItems = [...destColumn.items];

//     const [movedItem] = sourceItems.splice(source.index, 1);

//     if (source.droppableId === destination.droppableId) {
//       sourceItems.splice(destination.index, 0, movedItem);
//       setData({
//         ...data,
//         columns: {
//           ...data.columns,
//           [source.droppableId]: {
//             ...sourceColumn,
//             items: sourceItems,
//           },
//         },
//       });
//     } else {
//       destItems.splice(destination.index, 0, movedItem);
//       setData({
//         ...data,
//         columns: {
//           ...data.columns,
//           [source.droppableId]: {
//             ...sourceColumn,
//             items: sourceItems,
//           },
//           [destination.droppableId]: {
//             ...destColumn,
//             items: destItems,
//           },
//         },
//       });
//     }
//   };

//   const renameColumn = (columnId) => {
//     const newName = prompt('Enter new column name:');
//     if (newName) {
//       setData({
//         ...data,
//         columns: {
//           ...data.columns,
//           [columnId]: {
//             ...data.columns[columnId],
//             name: newName,
//           },
//         },
//       });
//     }
//     setPopupOpen(null);
//   };

//   const clearColumn = (columnId) => {
//     setData({
//       ...data,
//       columns: {
//         ...data.columns,
//         [columnId]: {
//           ...data.columns[columnId],
//           items: [],
//         },
//       },
//     });
//     setPopupOpen(null);
//   };

//   const deleteColumn = (columnId) => {
//     const updatedColumns = { ...data.columns };
//     delete updatedColumns[columnId];
//     setData({
//       ...data,
//       columns: updatedColumns,
//     });
//     setPopupOpen(null);
//   };

//   const addNewBoard = () => {
//     if (!newBoardName.trim()) return;

//     const newColumnId = `${Date.now()}`;
//     setData({
//       ...data,
//       columns: {
//         ...data.columns,
//         [newColumnId]: {
//           name: newBoardName,
//           items: [],
//         },
//       },
//     });
//     setNewBoardName('');
//     setIsAddingBoard(false);
//   };

//   const addNewTask = (columnId) => {
//     const newTaskTitle = prompt('Enter task title:');
//     if (newTaskTitle) {
//       const newTask = {
//         id: `${Date.now()}`, // Unique ID for the new task
//         title: newTaskTitle,
//         image: '', // Optional: Add default image URL if needed
//         comments: 0,
//         attachments: 0,
//         assignee: '', // Optional: Add default assignee if needed
//       };

//       const updatedColumn = {
//         ...data.columns[columnId],
//         items: [...data.columns[columnId].items, newTask],
//       };

//       setData({
//         ...data,
//         columns: {
//           ...data.columns,
//           [columnId]: updatedColumn,
//         },
//       });
//     }
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Task Management | Hr.System</title>
//       </Helmet>

//       <Container maxWidth="xl">
//         <Grid container alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
//           <Button
//             onClick={() => setIsAddingBoard(!isAddingBoard)}
//             size="large"
//             variant="contained"
//             startIcon={<AddIcon />}
//             sx={{ marginLeft: '20px' }}
//           >
//             Add New Board
//           </Button>
//         </Grid>
//         {isAddingBoard && (
//           <div style={{ position: 'relative' }}>
//             <div className="add-board-input-container">
//               <input
//                 type="text"
//                 className="add-board-input"
//                 placeholder="Enter board name"
//                 value={newBoardName}
//                 onChange={(e) => setNewBoardName(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') addNewBoard();
//                 }}
//               />
//               <Button onClick={addNewBoard}>
//                 Add
//               </Button>
//             </div>
//           </div>
//         )}
//       </Container>

//       <div className="kanban-container">
//         <DragDropContext onDragEnd={onDragEnd}>
//           {Object.entries(data.columns).map(([columnId, column]) => (
//             <div className="kanban-column" key={columnId}>
//               <div className="kanban-column-header">
//                 <h3 className="kanban-column-title">{column.name}</h3>
//                 <button
//                   className="kanban-header-menu"
//                   onClick={() =>
//                     setPopupOpen(popupOpen === columnId ? null : columnId)
//                   }
//                 >
//                   ⋮
//                 </button>
//                 {popupOpen === columnId && (
//                   <div className="popup-menu" ref={popupRef}>
//                     <button
//                       className="popup-menu-item"
//                       onClick={() => addNewTask(columnId)}
//                     >
//                       🆕 New Task
//                     </button>
//                     <button
//                       className="popup-menu-item"
//                       onClick={() => renameColumn(columnId)}
//                     >
//                       ✏️ Rename
//                     </button>
//                     <button
//                       className="popup-menu-item"
//                       onClick={() => clearColumn(columnId)}
//                     >
//                       🧹 Clear
//                     </button>
//                     <button
//                       className="popup-menu-item delete"
//                       onClick={() => deleteColumn(columnId)}
//                     >
//                       🗑️ Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//               <Droppable droppableId={columnId}>
//                 {(provided) => (
//                   <div
//                     className="kanban-column-items"
//                     {...provided.droppableProps}
//                     ref={provided.innerRef}
//                   >
//                     {column.items.map((item, index) => (
//                       <Draggable key={item.id} draggableId={item.id} index={index}>
//                         {(provided) => (
//                           <div
//                             className="kanban-card"
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                           >
//                             {item.image && (
//                               <img
//                                 src={item.image}
//                                 alt={item.title}
//                                 className="kanban-card-image"
//                               />
//                             )}
//                             <h4 className="kanban-card-title">{item.title}</h4>
//                             <div className="kanban-card-meta">
//                               <span>💬 {item.comments}</span>
//                               <span>📎 {item.attachments}</span>
//                               {item.assignee && (
//                                 <img
//                                   src={item.assignee}
//                                   alt="assignee"
//                                   className="kanban-card-assignee"
//                                 />
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//             </div>
//           ))}
//         </DragDropContext>
//       </div>
//     </>
//   );
// }

// export default KanbanBoard;


import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './KanbanBoard.css';
import {
  Button,
  Container,
  Modal,
  Box,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Helmet } from 'react-helmet-async';

const initialData = {
  columns: {
    '1': {
      name: 'To Do',
      items: [
        {
          id: '1',
          title: 'Design New Marketing Campaign',
          image: 'https://via.placeholder.com/300x150',
          comments: 1,
          attachments: 4,
          assignee: ['https://via.placeholder.com/32'],
          description: 'Create a new marketing strategy.',
        },
        {
          id: '2',
          title: 'Analyze Customer Feedback',
          image: '',
          comments: 2,
          attachments: 0,
          assignee: [],
          description: 'Review feedback from Q4.',
        },
      ],
    },
    '2': { name: 'In Progress', items: [] },
    '3': {
      name: 'Done',
      items: [
        {
          id: '3',
          title: 'Organize Team Meeting',
          image: '',
          comments: 0,
          attachments: 0,
          assignee: ['https://via.placeholder.com/32'],
          description: 'Plan and execute the team meeting.',
        },
      ],
    },
  },
};

function KanbanBoard() {
  const [data, setData] = useState(initialData);
  const [popupOpen, setPopupOpen] = useState(null); // Column ID for which popup is open
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [selectedCard, setSelectedCard] = useState(null); // Card modal state
  const popupRef = useRef(null);

  // Close the popup when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupOpen(null);
      }
    };

    if (popupOpen !== null) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [popupOpen]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = data.columns[source.droppableId];
    const destColumn = data.columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];

    const [movedItem] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItem);
      setData({
        ...data,
        columns: {
          ...data.columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
        },
      });
    } else {
      destItems.splice(destination.index, 0, movedItem);
      setData({
        ...data,
        columns: {
          ...data.columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems,
          },
        },
      });
    }
  };

  const renameColumn = (columnId) => {
    const newName = prompt('Enter new column name:');
    if (newName) {
      setData({
        ...data,
        columns: {
          ...data.columns,
          [columnId]: {
            ...data.columns[columnId],
            name: newName,
          },
        },
      });
    }
    setPopupOpen(null);
  };

  const clearColumn = (columnId) => {
    setData({
      ...data,
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          items: [],
        },
      },
    });
    setPopupOpen(null);
  };

  const deleteColumn = (columnId) => {
    const updatedColumns = { ...data.columns };
    delete updatedColumns[columnId];
    setData({
      ...data,
      columns: updatedColumns,
    });
    setPopupOpen(null);
  };

  const addNewBoard = () => {
    if (!newBoardName.trim()) return;

    const newColumnId = `${Date.now()}`;
    setData({
      ...data,
      columns: {
        ...data.columns,
        [newColumnId]: {
          name: newBoardName,
          items: [],
        },
      },
    });
    setNewBoardName('');
    setIsAddingBoard(false);
  };

  const addNewTask = (columnId) => {
    const newTaskTitle = prompt('Enter task title:');
    if (newTaskTitle) {
      const newTask = {
        id: `${Date.now()}`, // Unique ID for the new task
        title: newTaskTitle,
        image: '',
        comments: 0,
        attachments: 0,
        assignee: [],
        description: '',
      };

      const updatedColumn = {
        ...data.columns[columnId],
        items: [...data.columns[columnId].items, newTask],
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [columnId]: updatedColumn,
        },
      });
    }
  };

  const handleCardClick = (card, columnId) => {
    setSelectedCard({ ...card, columnId });
  };

  const handleCardModalClose = () => {
    setSelectedCard(null);
  };

  const handleCardSave = () => {
    const { columnId, id, title, assignee, description, image } = selectedCard;

    const updatedItems = data.columns[columnId].items.map((item) =>
      item.id === id ? { id, title, assignee, description, image } : item
    );

    setData({
      ...data,
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          items: updatedItems,
        },
      },
    });

    setSelectedCard(null);
  };

  return (
    <>
      <Helmet>
        <title>Task Management | Hr.System</title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Button
            onClick={() => setIsAddingBoard(!isAddingBoard)}
            size="large"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add New Board
          </Button>
        </Grid>
        {isAddingBoard && (
          <div style={{ position: 'relative' }}>
            <div className="add-board-input-container">
              <input
                type="text"
                className="add-board-input"
                placeholder="Enter board name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addNewBoard();
                }}
              />
              <Button onClick={addNewBoard}>Add</Button>
            </div>
          </div>
        )}
      </Container>

      <div className="kanban-container">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(data.columns).map(([columnId, column]) => (
            <div className="kanban-column" key={columnId}>
              <div className="kanban-column-header">
                <h3 className="kanban-column-title">{column.name}</h3>
                <button
                  className="kanban-header-menu"
                  onClick={() =>
                    setPopupOpen(popupOpen === columnId ? null : columnId)
                  }
                >
                  ⋮
                </button>
                {popupOpen === columnId && (
                  <div className="popup-menu" ref={popupRef}>
                    <button
                      className="popup-menu-item"
                      onClick={() => addNewTask(columnId)}
                    >
                      🆕 New Task
                    </button>
                    <button
                      className="popup-menu-item"
                      onClick={() => renameColumn(columnId)}
                    >
                      ✏️ Rename
                    </button>
                    <button
                      className="popup-menu-item"
                      onClick={() => clearColumn(columnId)}
                    >
                      🧹 Clear
                    </button>
                    <button
                      className="popup-menu-item delete"
                      onClick={() => deleteColumn(columnId)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    className="kanban-column-items"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            className="kanban-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleCardClick(item, columnId)}
                          >
                            {item.image && (
                              <img src={item.image} alt={item.title} className="kanban-card-image" />
                            )}
                            <h4 className="kanban-card-title">{item.title}</h4>
                            <div className="kanban-card-meta">
                              {item.assignee.map((img, idx) => (
                                <img key={idx} src={img} alt="Assignee" />
                              ))}
                              <p>{item.description}</p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>

      {selectedCard && (
        <Modal open={!!selectedCard} onClose={handleCardModalClose}>
          <Box className="task-modal">
            <TextField
              label="Task Title"
              value={selectedCard.title}
              onChange={(e) => setSelectedCard({ ...selectedCard, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={selectedCard.description}
              onChange={(e) => setSelectedCard({ ...selectedCard, description: e.target.value })}
              fullWidth
              multiline
              rows={4}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Image URL"
              value={selectedCard.image}
              onChange={(e) => setSelectedCard({ ...selectedCard, image: e.target.value })}
              fullWidth
              sx={{ mt: 2 }}
            />
            <div>
              <h4>Team Members</h4>
              {[1, 2, 3].map((id) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCard.assignee.includes(`https://via.placeholder.com/32/${id}`)}
                      onChange={(e) => {
                        const newAssignee = e.target.checked
                          ? [...selectedCard.assignee, `https://via.placeholder.com/32/${id}`]
                          : selectedCard.assignee.filter((img) => img !== `https://via.placeholder.com/32/${id}`);
                        setSelectedCard({ ...selectedCard, assignee: newAssignee });
                      }}
                    />
                  }
                  label={`Member ${id}`}
                  key={id}
                />
              ))}
            </div>
            <Button onClick={handleCardSave} variant="contained" sx={{ mt: 2 }}>
              Save
            </Button>
          </Box>
        </Modal>
      )}
    </>
  );
}

export default KanbanBoard;
