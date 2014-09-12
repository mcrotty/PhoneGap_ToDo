var todo = {};
/** Read the new task and add it to the list */
todo.add = function(event) {
    // Read the task from the input
    var task=$('input').val();
    if (task) {
        // Add the task to array and refresh list
        todo.list[todo.list.length] = task;
        todo.refresh_list();
        // Clear the input
        $('input').val('');
    }
    event.prevetodoefault();
};
/** Remove the task which was marked as selected */
todo.remove = function() {
    // Remove from array and refresh list
    todo.list.splice(todo.selected,1);
    todo.refresh_list();
};
/** Recreate the entire list from the available list of tasks */
todo.refresh_list = function() {
    var $tasks = $('#task_list'), i;
    // Clear the existing task list
    $tasks.empty();
    if (todo.list.length) {
        // Add the header
        $tasks.append('<li data-role="list-divider">To Do&#39;s</li>');
        for (var i=0;i<todo.list.length;i++){
            // Append each task
            var li = '<li><a data-rel="dialog" data-task="' + i
                    + '" href="#confirm">' + todo.list[i] + '</a></li>'
            $tasks.append(li);
        }
    }
    // Add the header for addition of new tasks
    $tasks.append('<li data-role="list-divider">Add a task</li>');
    // Use jQuery Mobile's listview method to refresh
    $tasks.listview('refresh');
    // Store back the list
    localStorage.todo_list = JSON.stringify(todo.list || []);
};

// Initialize the index page
$(document).delegate('#index','pageinit', function() {
    // If no list is already present, initialize it
    if (!localStorage.todo_list) {
        localStorage.todo_list = "[]";
    }
    // Load the list by parsing the JSON from localStorage
    todo.list = JSON.parse(localStorage.todo_list);
    $('#add').bind('vclick', todo.add);
    $('#task_list').on('vclick', 'li a', function() {
        todo.selected = $(this).data('task');
    });
    // Refresh the list everytime the page is reloaded
    $('#index').bind('pagebeforeshow', todo.refresh_list);
});

// Bind the 'Done' and 'Not Done' buttons to task removal
$(document).delegate('#confirm', 'pageinit', function(){
    $('.remove_task').bind('vclick', todo.remove);
});

// Make the transition in reverse for the buttons on the done and notdone pages
$(document).delegate('#done, #notdone', 'pageinit', function(){
    // We reverse transition for any button linking to index page
    $('[href="#index"]').attr('data-direction','reverse');
})
