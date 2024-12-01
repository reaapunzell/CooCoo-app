import React from 'react';
import TaskItem from './TaskItems';
import './Calendar.css';

const TaskList = ({tasks, onCompleteTask}) => {

    return (
       <div className="task-list">
        {tasks.map((task)=>(
            <TaskItem key={task.id} task={task} onComplete={() => onCompleteTask(task.id)} />
        ))}
       </div> 
    );
};

export default TaskList;