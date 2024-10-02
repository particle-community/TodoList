let tasks = [];

// TODO: separate render methods from Task
class Task {
    constructor(description, isCompleted = false) {
        this.description = description;
        this.isCompleted = isCompleted;
    }

    render() {
        const taskArticle = document.createElement('article');
        this.#updateArticleStyle(taskArticle);
        taskArticle.classList.add('task');

        const descriptionParagraph = this.#createDescriptionParagraph();
        taskArticle.appendChild(descriptionParagraph);

        const buttonContainer = this.#createButtonContainer(taskArticle, descriptionParagraph);
        taskArticle.appendChild(buttonContainer);

        return taskArticle;
    }

    #createDescriptionParagraph() {
        const descriptionParagraph = document.createElement('p');
        descriptionParagraph.textContent = this.description;
        this.#updateDescriptionStyle(descriptionParagraph);
        return descriptionParagraph;
    }

    #updateDescriptionStyle(descriptionParagraph) {
        descriptionParagraph.style.textDecoration = this.isCompleted ? 'line-through' : 'none';
        descriptionParagraph.style.color = this.isCompleted ? getPropertyValue('--disabled-color') : getPropertyValue('--paragraph-color');
    }

    #updateArticleStyle(article) {
        article.style.borderColor = this.isCompleted ? getPropertyValue('--disabled-color') : getPropertyValue('--paragraph-color');
    }

    #createButtonContainer(article, descriptionParagraph) {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const completeButton = this.#createCompleteButton(article, descriptionParagraph);
        buttonContainer.appendChild(completeButton);

        const deleteButton = this.#createDeleteButton();
        buttonContainer.appendChild(deleteButton);

        return buttonContainer;
    }

    #createCompleteButton(article, descriptionParagraph) {
        const completeButton = document.createElement('button');
        completeButton.textContent = this.isCompleted ? "Undo" : "Complete";
        completeButton.classList.add('complete-task-button');

        completeButton.onclick = () => {
            this.isCompleted = !this.isCompleted;
            this.#updateDescriptionStyle(descriptionParagraph);
            this.#updateArticleStyle(article);
            completeButton.textContent = this.isCompleted ? "Undo" : "Complete";
            saveTasks();
        };

        return completeButton;
    }

    #createDeleteButton() {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-task-button');

        let deleteIcon = document.createElement('img');
        deleteIcon.src = 'icons/delete.svg';
        deleteIcon.alt = 'Delete';
        deleteButton.appendChild(deleteIcon);

        deleteButton.onclick = () => {
            removeTask(this);
        };

        return deleteButton;
    }
}

function getPropertyValue(propName) {
    return getComputedStyle(document.documentElement).getPropertyValue(propName);
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = savedTasks.map(taskData => {
        const task = new Task(taskData.description, taskData.isCompleted);
        document.getElementById('tasklist-section').appendChild(task.render());
        return task;
    });
}

function removeTask(task) {
    const index = tasks.indexOf(task);
    if (index > -1) {
        tasks.splice(index, 1);
        saveTasks();
        document.getElementById('tasklist-section').innerHTML = '';
        loadTasks();
    }
}

function addNewTask(description) {
    const task = new Task(description);
    tasks.unshift(task);

    const taskListSection = document.getElementById('tasklist-section');
    taskListSection.insertBefore(task.render(), taskListSection.firstChild);
    saveTasks();
}

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();

    const createTaskInput = document.getElementById('create-task-input');
    
    document.getElementById('create-task-form').addEventListener('submit', (e) => e.preventDefault());

    document.getElementById('create-task-button').onclick = () => {
        const description = createTaskInput.value;
        if (!description || description.trim() === '') {
            alert('Invalid task description!');
        }
        else {
            addNewTask(description);
        }
        createTaskInput.value = '';
    };
});