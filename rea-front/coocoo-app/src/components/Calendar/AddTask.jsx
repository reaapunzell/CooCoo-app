import react from 'react';

const AddTaskButton = ({onAddTask}) => {

    return (
        <button className='add-task-btn' onClick={onAddTask}>
            + 
        </button>
    )
}

export default AddTaskButton