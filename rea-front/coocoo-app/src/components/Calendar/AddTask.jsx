import react from 'react';
import TaskForm from './TaskForm';

const AddTaskButton = ({onAddTask}) => {

    return (
        <button className='add-task-btn' onClick={onAddTask}>
            + 
        </button>
    )
}

export default AddTaskButton