// Using IIFE design pattern.
var ToDoListApp = (function(){
    // array for adding task object.
    let tasks = [];
    // Used for giving dark color to currently clicked items and rest will be grey.
    let prevTarget = null;
    // Element objects stored inside variables by selecting them from the html file based on id.
    const taskList = document.getElementById('list');
    const addTaskInput = document.getElementById('newTask');
    const tasksCounter = document.getElementById('tasks-counter');
    // Task object passed to add it to the list and setting inner html.
    function addTaskToDOM(task){
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="radio" id="${task.id}" ${task.done? 'checked' : ''} class ="custom-checkbox">
            <label for="${task.id}" class="taskDesc">${task.text}</label>
            <i class="fa-regular fa-trash-can" id="delete" data-id="${task.id}"/></i> 
        `;
        taskList.append(li);
    }
    // Function used to show the added task after clicking enter.
    function renderList (newTasks) {
        taskList.innerHTML = '';
        // Adding all tasks to the unorderd list in html.
        for(let i=0;i<newTasks.length;i++)
        {
            addTaskToDOM(newTasks[i]);
        }
        // Filtering out the incomplete tasks. 
        const incompleteTasks = tasks.filter((task)=>{
            return task.done == false;
        });
        // Displaying total incomplete tasks.
        tasksCounter.innerHTML = incompleteTasks.length;
    }

    // For togggling task as done or undone when clicking on checkbox.
    function toggleTask (taskId) {
        // Filter out specific task object based on Id which was clicked.
        const task = tasks.filter((task)=>{
            return task.id === taskId
        });
        // Changing property "done" to true of a task object.
        if(task.length>0)
        {
            const currentTask = task[0];
            currentTask.done = !currentTask.done;
            renderList(tasks);
            return;
        }
        showNotification("Some Internal Error Occured");
    }
    // Based on task Id remove that task from "tasks" array.
    function deleteTask (taskId) {
        const newTasks = tasks.filter((task)=>{
            return task.id !== taskId;
        })

        tasks = newTasks;
        renderList(tasks);
        return;
    }
    // Add new task by pushing new task object into "tasks" array.
    function addTask (task) {
        if(task){
            tasks.push(task);
            renderList(tasks);
            return;
        }
    }

    function showNotification(text) {
        window.alert(text);
    }
    // For each keypress we need to handle for different keys.
    function handleInputKeypress(e) {
        // If key is enter then create new task object and add it to the task array.
        if(e.key === 'Enter')
        {
            const text = e.target.value;
            if(!text){
                showNotification("Hey Lazy!!! Task is Empty");
                return;
            }
            // Creating new object.
            const task ={
                text,
                id: Date.now().toString(),
                done: false
            }
            // Clearing value inside text area.
            e.target.value = '';
            // Add new object to "tasks" array.
            addTask(task);
            // Adding visibility of circle-plus element based on state of text box.
            document.getElementById('circle-plus').style.visibility = "hidden";
        }
        else{
            document.getElementById('circle-plus').style.visibility = "visible";
        }
    }
    // Function for handling clicks on different parts of the appplication.
    function handleClickListener(e){
        // Setting color of previuously clicked Element to grey
        if(prevTarget != null)
        {
            prevTarget.style.color = "dimgray";
        }
        // Setting color of target clicked to black.
        let target = e.target;
        target.style.color = "black";
        prevTarget = target;
        // If clicked on delete button.
        if(target.className === 'fa-regular fa-trash-can')
        {
            const taskId = target.dataset.id;
            deleteTask(taskId);
            return;
        }
        else if(target.className === 'custom-checkbox')//If clicked on checkbox.
        {   
            const taskId = target.id;
            toggleTask(taskId);
            return;
        }
        else if(target.className === 'complete-tasks')//If clicked on complete all tasks.
        {   
            const newTasks = tasks.filter((task)=>{
                return task.done === false;
            })
            for(let task of newTasks){
                toggleTask(task.id);
            }
            return;
        }
        else if(target.className === 'clear-completed')//If clicked on Clear Completed tasks.
        {
            const newTasks = tasks.filter((task)=>{
                return task.done === false;
            })
            tasks = newTasks
            renderList(newTasks)
        }
        else if(target.className === 'all-select')//If clicked on All tasks button.
        {   
            renderList(tasks)
        }
        else if(target.className === 'incomplete-select')//If clicked on incomplete tasks button.
        {   
            let prevTasks = tasks;
            let newTasks = tasks.filter((task)=>{
                return task.done === false;
            })
            renderList(newTasks)
            tasks = prevTasks;
        }
        else if(target.className === 'complete-select')//If clicked on complete tasks button.
        {
            let newTasks = tasks.filter((task)=>{
                return task.done === true;
            })
            renderList(newTasks)
        }
        else if(target.className === "fa-solid fa-circle-plus")//If clicken on circle-plus icon while typing task in text box.
        {
            let text = document.getElementById('newTask').value;
            if(!text){
                showNotification("Hey Lazy!!! Task is Empty");
                return;
            }
            // Creating new task object.
            const task ={
                text,
                id: Date.now().toString(),
                done: false
            }

            // Clearing value inside text area.
            document.getElementById('newTask').value = '';
            // Add new object to "tasks" array.
            addTask(task);
            // Adding visibility of circle-plus element based on state of text box.
            document.getElementById('circle-plus').style.visibility = "hidden";
        }
    }

    function initializeApp(){
        // Declaring event listeners on document window and elements.
        addTaskInput.addEventListener('keyup', handleInputKeypress);
        document.addEventListener('click', handleClickListener);
        document.addEventListener('mouseover', handleHoverEvent);
    }
    return{
        initialize: initializeApp,
    };
})()

