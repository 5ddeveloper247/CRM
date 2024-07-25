$("#add_task_btn").click(function () {
    window.location = "/admin/tasks/add";
});

$(document).on("click", ".delete_btn", function () {
    $("#delete_confirmed_btn").attr("data-id", "");
    $("#delete_confirmed_btn").attr("disabled", false);
    var del_id = $(this).attr("data-id");
    $("#delete_confirmed_btn").attr("data-id", del_id);
});

function formatDate(dateString) {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}
// close delete modal

$(document).on("click", "#close_delete_modal_btn", function () {
    $("#delete_confirmed_btn").attr("data-id", "");
    $(".clode_delete_modal_default_btn").click();
});

$("#building").change(function () {
    var building_id = $(this).val();
    let type = "POST";
    let url = "/admin/getAppartmentsList";
    let data = new FormData();
    data.append("building_id", building_id);
    SendAjaxRequestToServer(
        type,
        url,
        data,
        "",
        getAppartmentsListResponse,
        "",
        ""
    );
});

function getAppartmentsListResponse(response) {
    if (response.status == 200) {
        var appartments = response.appartment_list.appartment_list;
        $("#appartment").html('<option value="">Select State</option>');
        $.each(appartments, function (index, appartment) {
            $("#appartment").append(
                '<option value="' +
                    appartment.id +
                    '">' +
                    appartment.apartment_name +
                    "</option>"
            );
        });
    }
}

$("#task_form").submit(function (e) {
    e.preventDefault();

    let form = document.getElementById("task_form");
    let data = new FormData(form);
    let type = "POST";
    let url = "/admin/storeTask";
    SendAjaxRequestToServer(
        type,
        url,
        data,
        "",
        storeTaskResponse,
        "",
        "savebuildingbtn"
    );
});

function storeTaskResponse(response) {
    if (response.status == 200) {
        toastr.success(response.message, "", {
            timeOut: 3000,
        });

        setTimeout(function () {
            window.location = "/admin/tasks";
        }, 1000);
    }

    if (response.status == 402) {
        error = response.message;
    } else {
        error = response.responseJSON.message;
        var is_invalid = response.responseJSON.errors;

        var offset = 100;
        var firstInvalidFound = false;
        $.each(is_invalid, function (key) {
            var inputField = $('[name="' + key + '"]');
            inputField.addClass("is-invalid");
            if (!firstInvalidFound) {
                $("html, body").animate(
                    { scrollTop: inputField.offset().top - offset },
                    1000
                );
                firstInvalidFound = true;
            }
        });
    }
    toastr.error(error, "", {
        timeOut: 3000,
    });
}

function getTaskList() {
    let type = "GET";
    let url = "/admin/getTasksList";
    SendAjaxRequestToServer(type, url, "", "", getTaskListResponse, "", "");
}
function getTaskListResponse(response) {
    var taskTableBody = $("#tasks_table_body");
    var donetaskTableBody = $("#done_tasks_table_body");
    var cancelledtaskTableBody = $("#cancelled_tasks_table_body");
    taskTableBody.empty();
    donetaskTableBody.empty();
    cancelledtaskTableBody.empty();
    var tasks = response.tasks_list.tasks_list;
    var done_tasks_list = response.tasks_list.done_tasks_list;
    var cancelled_tasks_list = response.tasks_list.cancelled_tasks_list;
    var total_tasks = response.tasks_list.total_tasks;
    var assigned_tasks = response.tasks_list.assigned_tasks;
    var hold_tasks = response.tasks_list.hold_tasks;
    var done_tasks = response.tasks_list.done_tasks;
    var cancelled_tasks = response.tasks_list.cancelled_tasks;
    var stuck_tasks = response.tasks_list.stuck_tasks;
    var working_on_tasks = response.tasks_list.working_on_tasks;
    if (
        cancelled_tasks < 1 ||
        cancelled_tasks == null ||
        cancelled_tasks == ""
    ) {
        $("#cancelled_tab_btn").addClass("d-none");
    } else {
        $("#cancelled_tab_btn").removeClass("d-none");
    }
    $("#cancelled_tasks").text(cancelled_tasks);
    $("#total_tasks").text(total_tasks);
    $("#assigned_tasks").text(assigned_tasks);
    $("#hold_tasks").text(hold_tasks);
    $("#done_tasks").text(done_tasks);
    $("#stuck_tasks").text(stuck_tasks);
    $("#working_on_tasks").text(working_on_tasks);

    $.each(tasks, function (index, task) {
        var priority = task.priority;
        if (priority == "0" || priority == 0) {
            priority = "Low";
        }
        if (priority == "1" || priority == 1) {
            priority = "Medium";
        }
        if (priority == "2" || priority == 2) {
            priority = "Urgent";
        }
        var document_typeTxt = "";
        var document_type = task.document_type;
        if (document_type == 0 || document_type == "0") {
            document_typeTxt = "Section 8";
        }
        if (document_type == 1 || document_type == "1") {
            document_typeTxt = "HPD";
        }
        if (document_type == 2 || document_type == "2") {
            document_typeTxt = "Work Order";
        }
        if (document_type == 3 || document_type == "3") {
            document_typeTxt = "Other";
        }

        var statusTxt = "";
        var notification_dot_color = "";
        var status = task.status;
        if (status == 0 || status == "0") {
            statusTxt = "Draft";
            notification_dot_color = "transparent";
        }
        if (status == 1 || status == "1") {
            statusTxt = "Assigned";
            notification_dot_color = "transparent";
        }
        if (status == 2 || status == "2") {
            statusTxt = "Working On it";
            notification_dot_color = "green";
        }
        if (status == 3 || status == "3") {
            statusTxt = "Hold";
            notification_dot_color = "blue";
        }
        if (status == 4 || status == "4") {
            statusTxt = "Stuck";
            notification_dot_color = "yellow";
        }
        if (status == 5 || status == "5") {
            statusTxt = "Done";
            notification_dot_color = "transparent";
        }
        if (status == 6 || status == "6") {
            statusTxt = "Cancelled";
            notification_dot_color = "red";
        }
        var taskRow = `<tr class="align-items-center identify">
                                <td class="nowrap">${index + 1}</td>
                                <td class="nowrap grid-p-searchby">
                                <div title="${statusTxt}" style="position: relative; width: 20px; height: 20px; display:inline;margin-right:15px;">
                                <span style="position: absolute; top: 0; right: 0; width: 10px; height: 10px; background-color: ${notification_dot_color}; border-radius: 50%; display: inline-block;"></span>
                            </div>${formatDate(task.created_at)}</td>
                                <td class="nowrap grid-p-searchby">${
                                    task.task_title
                                }</td>
                                <td class="nowrap grid-p-searchby">${
                                    task.building && task.building.building_name
                                        ? task.building.building_name
                                        : "Deleted"
                                }</td>

                                <td class="nowrap grid-p-searchby">${
                                    task.appartment &&
                                    task.appartment.apartment_name
                                        ? task.appartment.apartment_name
                                        : "Deleted"
                                }</td>
                                <td class="nowrap grid-p-searchby" >${
                                    task.manager && task.manager.first_name
                                        ? task.manager.first_name +
                                          " " +
                                          task.manager.last_name
                                        : "Deleted"
                                }</td>
                                <td>${priority}</td>
                               
                                <td class="nowrap grid-p-searchby" >${document_typeTxt}</td>
                                <td class="nowrap grid-p-searchby" >${
                                    task.document_status == 1
                                        ? "Viewed"
                                        : "Uploaded"
                                }</td>
                                <td class="nowrap grid-p-searchby">${statusTxt}</td>
                                
                               
                                <td class="nowrap" >
                                    <div class="act_btn">
                                    <button type="button" class="pop_btn viewdetailsbtn" title="View Timeline" data-id = "${
                                        task.id
                                    }" data-popup="viewdetailspopup"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/></svg></button>

                                    <a href="/admin/tasks/${
                                        task.id
                                    }/edit" class="edit  edit_btn" title="Edit"></a>
                                   
                                    <button type="button" class="del pop_btn delete_btn" title="Delete" data-id = "${
                                        task.id
                                    }" data-popup="delete-data-popup"></button>
                                    </div>
                                </td>
                            </tr>`;
        taskTableBody.append(taskRow);
    });
    $.each(done_tasks_list, function (index, task) {
        var priority = task.priority;
        if (priority == "0" || priority == 0) {
            priority = "Low";
        }
        if (priority == "1" || priority == 1) {
            priority = "Medium";
        }
        if (priority == "2" || priority == 2) {
            priority = "Urgent";
        }
        var document_typeTxt = "";
        var document_type = task.document_type;
        if (document_type == 0 || document_type == "0") {
            document_typeTxt = "Section 8";
        }
        if (document_type == 1 || document_type == "1") {
            document_typeTxt = "HPD";
        }
        if (document_type == 2 || document_type == "2") {
            document_typeTxt = "Work Order";
        }
        if (document_type == 3 || document_type == "3") {
            document_typeTxt = "Other";
        }

        var statusTxt = "";
        var notification_dot_color = "";
        var status = task.status;
        if (status == 0 || status == "0") {
            statusTxt = "Draft";
            notification_dot_color = "transparent";
        }
        if (status == 1 || status == "1") {
            statusTxt = "Assigned";
            notification_dot_color = "transparent";
        }
        if (status == 2 || status == "2") {
            statusTxt = "Working On it";
            notification_dot_color = "green";
        }
        if (status == 3 || status == "3") {
            statusTxt = "Hold";
            notification_dot_color = "blue";
        }
        if (status == 4 || status == "4") {
            statusTxt = "Stuck";
            notification_dot_color = "yellow";
        }
        if (status == 5 || status == "5") {
            statusTxt = "Done";
            notification_dot_color = "transparent";
        }
        if (status == 6 || status == "6") {
            statusTxt = "Cancelled";
            notification_dot_color = "red";
        }
        var taskRow = `<tr class="align-items-center identify1">
                                <td class="nowrap">${index + 1}</td>
                                <td class="nowrap grid-p-searchby"><div title="${statusTxt}" style="position: relative; width: 20px; height: 20px; display:inline;margin-right:15px;">
                                <span style="position: absolute; top: 0; right: 0; width: 10px; height: 10px; background-color: ${notification_dot_color}; border-radius: 50%; display: inline-block;"></span>
                            </div>${formatDate(task.created_at)}</td>
                                <td class="nowrap grid-p-searchby">${
                                    task.task_title
                                }</td>
                                <td class="nowrap grid-p-searchby">${
                                    task.building && task.building.building_name
                                        ? task.building.building_name
                                        : "Deleted"
                                }</td>
                                <td class="nowrap grid-p-searchby">${
                                    task.appartment &&
                                    task.appartment.apartment_name
                                        ? task.appartment.apartment_name
                                        : "Deleted"
                                }</td>
                                <td class="nowrap grid-p-searchby" data-center>${
                                    task.manager.first_name
                                }</td>
                                <td>${priority}</td>
                               
                                <td class="nowrap grid-p-searchby" data-center>${document_typeTxt}</td>
                                <td class="nowrap grid-p-searchby" >${
                                    task.document_status == 1
                                        ? "Viewed"
                                        : "Uploaded"
                                }</td>
                                <td class="nowrap grid-p-searchby">${statusTxt}</td>
                                
                               
                                <td class="nowrap" data-center>
                                    <div class="act_btn">
                                    <button type="button" class="pop_btn viewdetailsbtn" title="View Timeline" data-id = "${
                                        task.id
                                    }" data-popup="viewdetailspopup"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/></svg></button>
                                    <a href="/admin/tasks/${
                                        task.id
                                    }/edit" class="edit  edit_btn" title="Edit"></a>
                                       <button type="button" class="del pop_btn delete_btn" title="Delete" data-id = "${
                                           task.id
                                       }" data-popup="delete-data-popup"></button>
                                       </div>
                                </td>
                            </tr>`;
        donetaskTableBody.append(taskRow);
    });
    $.each(cancelled_tasks_list, function (index, task) {
        var priority = task.priority;
        if (priority == "0" || priority == 0) {
            priority = "Low";
        }
        if (priority == "1" || priority == 1) {
            priority = "Medium";
        }
        if (priority == "2" || priority == 2) {
            priority = "Urgent";
        }
        var document_typeTxt = "";
        var document_type = task.document_type;
        if (document_type == 0 || document_type == "0") {
            document_typeTxt = "Section 8";
        }
        if (document_type == 1 || document_type == "1") {
            document_typeTxt = "HPD";
        }
        if (document_type == 2 || document_type == "2") {
            document_typeTxt = "Work Order";
        }
        if (document_type == 3 || document_type == "3") {
            document_typeTxt = "Other";
        }

        var statusTxt = "";
        var notification_dot_color = "";
        var status = task.status;
        if (status == 0 || status == "0") {
            statusTxt = "Draft";
            notification_dot_color = "transparent";
        }
        if (status == 1 || status == "1") {
            statusTxt = "Assigned";
            notification_dot_color = "transparent";
        }
        if (status == 2 || status == "2") {
            statusTxt = "Working On it";
            notification_dot_color = "green";
        }
        if (status == 3 || status == "3") {
            statusTxt = "Hold";
            notification_dot_color = "blue";
        }
        if (status == 4 || status == "4") {
            statusTxt = "Stuck";
            notification_dot_color = "yellow";
        }
        if (status == 5 || status == "5") {
            statusTxt = "Done";
            notification_dot_color = "transparent";
        }
        if (status == 6 || status == "6") {
            statusTxt = "Cancelled";
            notification_dot_color = "red";
        }
        var taskRow = `<tr class="align-items-center identify1">
                                <td class="nowrap">${index + 1}</td>
                                <td class="nowrap grid-p-searchby"><div title="${statusTxt}" style="position: relative; width: 20px; height: 20px; display:inline;margin-right:15px;">
                                <span style="position: absolute; top: 0; right: 0; width: 10px; height: 10px; background-color: ${notification_dot_color}; border-radius: 50%; display: inline-block;"></span>
                            </div>${formatDate(task.created_at)}</td>
                                <td class="nowrap grid-p-searchby">${
                                    task.task_title
                                }</td>
                                <td class="nowrap grid-p-searchby">${
                                    task.building && task.building.building_name
                                        ? task.building.building_name
                                        : "Deleted"
                                }</td>
                                <td class="nowrap grid-p-searchby">${
                                    task.appartment &&
                                    task.appartment.apartment_name
                                        ? task.appartment.apartment_name
                                        : "Deleted"
                                }</td>
                                <td class="nowrap grid-p-searchby" data-center>${
                                    task.manager.first_name
                                }</td>
                                <td>${priority}</td>
                               
                                <td class="nowrap grid-p-searchby" data-center>${document_typeTxt}</td>
                                <td class="nowrap grid-p-searchby" >${
                                    task.document_status == 1
                                        ? "Viewed"
                                        : "Uploaded"
                                }</td>
                                <td class="nowrap grid-p-searchby">${statusTxt}</td>
                                
                               
                                <td class="nowrap" data-center>
                                    <div class="act_btn">
                                    <button type="button" class="pop_btn viewdetailsbtn" title="View Timeline" data-id = "${
                                        task.id
                                    }" data-popup="viewdetailspopup"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/></svg></button>
                                    <a href="/admin/tasks/${
                                        task.id
                                    }/edit" class="edit  edit_btn" title="Edit"></a>
                                       <button type="button" class="del pop_btn delete_btn" title="Delete" data-id = "${
                                           task.id
                                       }" data-popup="delete-data-popup"></button>
                                    
                                       </div>
                                </td>
                            </tr>`;
        cancelledtaskTableBody.append(taskRow);
    });
}

$(document).on("click", "#delete_confirmed_btn", function () {
    var del_id = $(this).attr("data-id");
    let url = "/admin/deleteTask";
    let type = "POST";
    let data = new FormData();
    data.append("del_id", del_id);
    SendAjaxRequestToServer(
        type,
        url,
        data,
        "",
        deleteTaskResponse,
        "",
        "#delete_confirmed_btn"
    );
});

function deleteTaskResponse(response) {
    if (response.status == 200) {
        toastr.success(response.message, "", {
            timeOut: 3000,
        });
        $("#uiBlocker").hide();

        getTaskList();
        $("#close_delete_modal_btn").click();
    }

    if (response.status == 402) {
        $("#close_delete_modal_btn").click();

        error = response.message;
    } else {
        $("#close_delete_modal_btn").click();

        error = response.responseJSON.message;
    }
    toastr.error(error, "", {
        timeOut: 3000,
    });
}

// to view to do list and status timeline

$(document).on("click", ".viewdetailsbtn", function () {
    var task_id = $(this).attr("data-id");
    let data = new FormData();
    data.append("task_id", task_id);
    let type = "POST";
    let url = "/admin/gettimelinesdetail";
    SendAjaxRequestToServer(
        type,
        url,
        data,
        "",
        gettimelinesdetailResponse,
        "",
        ""
    );
});

function gettimelinesdetailResponse(response) {
    var status_timeline_details = response.data.status_timeline_details;

    $("#status_timeline_detailsdiv").empty();

    if (status_timeline_details.length < 1) {
        $("#status_timeline_detailsdiv").text("No Data Available");
    } else {
        var status_timeline_details_div = document.getElementById(
            "status_timeline_detailsdiv"
        );
        var html = "";

        $.each(status_timeline_details, function (index, item) {
            var isEven = index % 2 === 0;
            var alignmentClass = isEven ? "" : "timeline-inverted";
            var statusText = getStatusText(item.task_status);

            html += `${
                item.created_by == 1
                    ? `<li>
                <div class="cd-timeline-block">
                    <div class="cd-timeline-img cd-picture">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-linecap="square" stroke-linejoin="round" stroke-width="2" d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879l-.707-.707m5.656 5.656l-.707-.707m-4.242 0l-.707.707m5.656-5.656l-.707.707M12 8a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"/></svg>
                    </div>
                    <div class="cd-timeline-content">
                        <p>
                            <strong>Action:</strong> ${item.action}
                            ${
                                item.task_status == 1 && (item.comment=='Task Assigned to' || item.comment =='Manager Changed to ')
                                    ? `<button class="btn btn-sm bg-transparent" style="background:transparent;" data-toggle="tooltip" data-placement="top" title="${
                                          item.comment
                                      } ${
                                          item.manager.first_name +
                                          " " +
                                          item.manager.last_name
                                      }">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                                        <path fill="#0078b9" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z"/>
                                    </svg>
                                </button>`
                                    : `<button class="btn btn-sm bg-transparent" style="background:transparent;" data-toggle="tooltip" data-placement="top" title="${item.comment}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                                        <path fill="#0078b9" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z"/>
                                    </svg>
                                </button>`
                            }
                        </p>
                        <p><strong>Status:</strong> ${statusText}</p>
                        ${
                            item.attachment != null
                                ? `<a href="${item.attachment}" download="attachment" class="btn btn-primary btn-sm" style="border-radius: 5px; font-size: 9px;" title="download attachment">Download</a>`
                                : ""
                        }
                        <span class="cd-date-right">${formatDate(
                            item.created_at
                        )}</span>
                    </div>
                </div>
            </li>`
                    :
                     `<li>
                <div class="cd-timeline-block">
                    <div class="cd-timeline-img cd-picture">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><circle cx="12" cy="7.5" r="3"/><path d="M19.5 20.5c-.475-9.333-14.525-9.333-15 0"/><path d="M11.192 17.565c.394-.21.591-.315.808-.315c.217 0 .414.105.808.315l.134.072c.394.21.591.315.7.488c.108.173.108.383.108.804v.142c0 .42 0 .63-.108.804c-.109.173-.306.278-.7.488l-.134.072c-.394.21-.591.315-.808.315c-.217 0-.414-.105-.808-.315l-.134-.072c-.394-.21-.591-.315-.7-.488c-.108-.173-.108-.383-.108-.804v-.142c0-.42 0-.63.108-.804c.109-.173.306-.278.7-.488z"/></g></svg>
                    </div>
                    <div class="cd-timeline-content">
                    <div class="cd-date">
                        <p>
                            <strong>Action:</strong> ${item.action}
                            ${
                                item.task_status == 1
                                    ? `<button class="btn btn-sm bg-transparent" style="background:transparent;" data-toggle="tooltip" data-placement="top" title="${
                                          item.comment
                                      } ${
                                          item.manager.first_name +
                                          " " +
                                          item.manager.last_name
                                      }">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                                        <path fill="#0078b9" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z"/>
                                    </svg>
                                </button>`
                                    : `<button class="btn btn-sm bg-transparent" style="background:transparent;" data-toggle="tooltip" data-placement="top" title="${item.comment}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                                        <path fill="#0078b9" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z"/>
                                    </svg>
                                </button>`
                            }
                        </p>
                        <p><strong>Status:</strong> ${statusText}</p>
                        ${
                            item.attachment != null
                                ? `<a href="${item.attachment}" download="attachment" class="btn btn-primary btn-sm" style="border-radius: 5px; font-size: 9px;" title="download attachment">Download</a>`
                                : ""
                        }
                        </div>
                        <span class="cd-date-left">${formatDate(item.created_at)}</span>
                    </div>
                </div>
            </li>`
            }`;
        });

        status_timeline_details_div.innerHTML = `<ul class="timeline">${html}</ul>`;

        function getStatusText(status) {
            switch (status) {
                case 0:
                    return "Draft";
                case 1:
                    return "Assigned";
                case 2:
                    return "Working on it";
                case 3:
                    return "On hold";
                case 4:
                    return "Stuck";
                case 5:
                    return "Done";
                case 6:
                    return "Cancelled";
                case 11:
                    return "Reassigned";
                case 22:
                    return "Reopened";
                default:
                    return "Unknown status";
            }
        }
    }
}

$("#searchInListing").on("keyup", function (e) {
    var tr = $(".identify");

    if ($(this).val().length >= 1) {
        //character limit in search box.
        var noElem = true;
        var val = $.trim(this.value).toLowerCase();
        el = tr.filter(function () {
            return $(this)
                .find(".grid-p-searchby")
                .text()
                .toLowerCase()
                .match(val);
        });
        if (el.length >= 1) {
            noElem = false;
        }
        tr.not(el).hide();
        el.fadeIn().show();
    } else {
        tr.fadeIn().show();
    }
});

$("#searchInListing1").on("keyup", function (e) {
    var tr = $(".identify1");

    if ($(this).val().length >= 1) {
        //character limit in search box.
        var noElem = true;
        var val = $.trim(this.value).toLowerCase();
        el = tr.filter(function () {
            return $(this)
                .find(".grid-p-searchby")
                .text()
                .toLowerCase()
                .match(val);
        });
        if (el.length >= 1) {
            noElem = false;
        }
        tr.not(el).hide();
        el.fadeIn().show();
    } else {
        tr.fadeIn().show();
    }
});

$(".advance-search").hide();
$(".advance-minus-icon").hide();
$(".advance-plus-icon").show();
$(".advance-search-btn").click(function () {
    $(".advance-search").toggle();
    if ($(".advance-search").is(":visible")) {
        $(".advance-minus-icon").show();
        $(".advance-plus-icon").hide();
    } else {
        $(".advance-minus-icon").hide();
        $(".advance-plus-icon").show();
    }
});

// filters code

$("#building_filter").change(function () {
    var building_id = $(this).val();
    let type = "POST";
    let url = "/admin/getAppartmentsList";
    let data = new FormData();
    data.append("building_id", building_id);
    SendAjaxRequestToServer(
        type,
        url,
        data,
        "",
        getAppartmentsListResponse,
        "",
        ""
    );
});

function getAppartmentsListResponse(response) {
    if (response.status == 200) {
        var appartments = response.appartment_list.appartment_list;
        $("#appartment_filter").html(
            '<option value="">Select Appartment</option>'
        );
        $.each(appartments, function (index, appartment) {
            $("#appartment_filter").append(
                '<option value="' +
                    appartment.id +
                    '">' +
                    appartment.apartment_name +
                    "</option>"
            );
        });
    }
}

$("#advance_search_active_tasks_btn").click(function () {
    var building_filter = $("#building_filter").val();
    var appartment_filter = $("#appartment_filter").val();
    var priority_filter = $("#priority_filter").val();
    var doc_status_filter = $("#document_status_filter").val();
    var doc_type_filter = $("#document_type_filter").val();
    var task_status_filter = $("#task_status_filter").val();
    var manager_filter = $("#manager_filter").val();
    let data = new FormData();
    data.append("building_filter", building_filter);
    data.append("appartment_filter", appartment_filter);
    data.append("priority_filter", priority_filter);
    data.append("doc_status_filter", doc_status_filter);
    data.append("doc_type_filter", doc_type_filter);
    data.append("task_status_filter", task_status_filter);
    data.append("manager_filter", manager_filter);
    let type = "POST";
    let url = "/admin/getfilteredtasks";
    SendAjaxRequestToServer(
        type,
        url,
        data,
        "",
        get_filtered_tasksResponse,
        "",
        ""
    );
});

function get_filtered_tasksResponse(response) {
    if (response.status == 200) {
        var tasks = response.tasks;
        if (tasks.length > 0) {
            $("#tasks_table_body").empty();

            $.each(tasks, function (index, task) {
                var priority = task.priority;
                if (priority == "0" || priority == 0) {
                    priority = "Low";
                }
                if (priority == "1" || priority == 1) {
                    priority = "Medium";
                }
                if (priority == "2" || priority == 2) {
                    priority = "Urgent";
                }
                var document_typeTxt = "";
                var document_type = task.document_type;
                if (document_type == 0 || document_type == "0") {
                    document_typeTxt = "Section 8";
                }
                if (document_type == 1 || document_type == "1") {
                    document_typeTxt = "HPD";
                }
                if (document_type == 2 || document_type == "2") {
                    document_typeTxt = "Work Order";
                }
                if (document_type == 3 || document_type == "3") {
                    document_typeTxt = "Other";
                }

                var statusTxt = "";
                var notification_dot_color = "";
                var status = task.status;
                if (status == 0 || status == "0") {
                    statusTxt = "Draft";
                    notification_dot_color = "transparent";
                }
                if (status == 1 || status == "1") {
                    statusTxt = "Assigned";
                    notification_dot_color = "transparent";
                }
                if (status == 2 || status == "2") {
                    statusTxt = "Working On it";
                    notification_dot_color = "green";
                }
                if (status == 3 || status == "3") {
                    statusTxt = "Hold";
                    notification_dot_color = "blue";
                }
                if (status == 4 || status == "4") {
                    statusTxt = "Stuck";
                    notification_dot_color = "yellow";
                }
                if (status == 5 || status == "5") {
                    statusTxt = "Done";
                    notification_dot_color = "transparent";
                }
                var taskRow = `<tr class="align-items-center identify">
                                        <td class="nowrap">${index + 1}</td>
                                        <td class="nowrap grid-p-searchby"><div title="${statusTxt}" style="position: relative; width: 20px; height: 20px; display:inline;margin-right:15px;">
                                        <span style="position: absolute; top: 0; right: 0; width: 10px; height: 10px; background-color: ${notification_dot_color}; border-radius: 50%; display: inline-block;"></span>
                                    </div>${formatDate(task.created_at)}</td>
                                        <td class="nowrap grid-p-searchby">${
                                            task.task_title
                                        }</td>
                                        <td class="nowrap grid-p-searchby">${
                                            task.building.building_name
                                        }</td>
                                        <td class="nowrap grid-p-searchby">${
                                            task.appartment.apartment_name
                                        }</td>
                                        <td class="nowrap grid-p-searchby" data-center>${
                                            task.manager.first_name
                                        }</td>
                                        <td>${priority}</td>
                                       
                                        <td class="nowrap grid-p-searchby" data-center>${document_typeTxt}</td>
                                        <td class="nowrap grid-p-searchby" >${
                                            task.document_status == 1
                                                ? "Viewed"
                                                : "Uploaded"
                                        }</td>
                                        <td class="nowrap grid-p-searchby">${statusTxt}</td>
                                        
                                       
                                        <td class="nowrap" data-center>
                                            <div class="act_btn">
                                            <button type="button" class="pop_btn viewdetailsbtn" title="View" data-id = "${
                                                task.id
                                            }" data-popup="viewdetailspopup"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/></svg></button>
                                           
                                            <a href="/admin/tasks/${
                                                task.id
                                            }/edit" class="edit  edit_btn" title="Edit"></a>
                                            
                                            <button type="button" class="del pop_btn delete_btn" title="Delete" data-id = "${
                                                task.id
                                            }" data-popup="delete-data-popup"></button>
                                            </div>
                                        </td>
                                    </tr>`;
                $("#tasks_table_body").append(taskRow);
            });
        } else {
            $("#tasks_table_body").empty();
            var taskRow = ` <tr colspan="10" data-center><td class="nowrap" data-center colspan="10">No Data Available</td></tr>`;
            $("#tasks_table_body").append(taskRow);
        }
    } else {
        $("#tasks_table_body").empty();
        var taskRow = ` <tr colspan="10" data-center><td class="nowrap" data-center colspan="10">No Data Available</td></tr>`;
        $("#tasks_table_body").append(taskRow);
    }
}

$("#advance_search_active_tasks_reset_btn").click(function () {
    $("#search_all_tasks_form")[0].reset();
    getTaskList();
});

$("#building_filter1").change(function () {
    var building_id = $(this).val();
    let type = "POST";
    let url = "/admin/getAppartmentsList";
    let data = new FormData();
    data.append("building_id", building_id);
    SendAjaxRequestToServer(
        type,
        url,
        data,
        "",
        getAppartmentsListResponse1,
        "",
        ""
    );
});

function getAppartmentsListResponse1(response) {
    if (response.status == 200) {
        var appartments = response.appartment_list.appartment_list;
        $("#appartment_filter1").html(
            '<option value="">Select Appartment</option>'
        );
        $.each(appartments, function (index, appartment) {
            $("#appartment_filter1").append(
                '<option value="' +
                    appartment.id +
                    '">' +
                    appartment.apartment_name +
                    "</option>"
            );
        });
    }
}

// filter for done tasks

$("#advance_search_done_tasks_btn").click(function () {
    var building_filter = $("#building_filter1").val();
    var appartment_filter = $("#appartment_filter1").val();
    var priority_filter = $("#priority_filter1").val();
    var doc_status_filter = $("#document_status_filter1").val();
    var manager_filter = $("#manager_filter1").val();
    var doc_type_filter1 = $("#document_type_filter1").val();

    let data = new FormData();
    data.append("building_filter", building_filter);
    data.append("appartment_filter", appartment_filter);
    data.append("priority_filter", priority_filter);
    data.append("doc_status_filter", doc_status_filter);
    data.append("document_type_filter1", doc_type_filter1);

    data.append("manager_filter", manager_filter);

    let type = "POST";
    let url = "/admin/getfilteredcompletedtasks";
    SendAjaxRequestToServer(
        type,
        url,
        data,
        "",
        getfilteredcompletedtasksResponse,
        "",
        ""
    );
});

function getfilteredcompletedtasksResponse(response) {
    if (response.status == 200) {
        var tasks = response.tasks;
        if (tasks.length > 0) {
            $("#done_tasks_table_body").empty();

            $.each(tasks, function (index, task) {
                var priority = task.priority;
                if (priority == "0" || priority == 0) {
                    priority = "Low";
                }
                if (priority == "1" || priority == 1) {
                    priority = "Medium";
                }
                if (priority == "2" || priority == 2) {
                    priority = "Urgent";
                }
                var document_typeTxt = "";
                var document_type = task.document_type;
                if (document_type == 0 || document_type == "0") {
                    document_typeTxt = "Section 8";
                }
                if (document_type == 1 || document_type == "1") {
                    document_typeTxt = "HPD";
                }
                if (document_type == 2 || document_type == "2") {
                    document_typeTxt = "Work Order";
                }
                if (document_type == 3 || document_type == "3") {
                    document_typeTxt = "Other";
                }

                var statusTxt = "";
                var notification_dot_color = "";
                var status = task.status;
                if (status == 0 || status == "0") {
                    statusTxt = "Draft";
                    notification_dot_color = "transparent";
                }
                if (status == 1 || status == "1") {
                    statusTxt = "Assigned";
                    notification_dot_color = "transparent";
                }
                if (status == 2 || status == "2") {
                    statusTxt = "Working On it";
                    notification_dot_color = "green";
                }
                if (status == 3 || status == "3") {
                    statusTxt = "Hold";
                    notification_dot_color = "blue";
                }
                if (status == 4 || status == "4") {
                    statusTxt = "Stuck";
                    notification_dot_color = "yellow";
                }
                if (status == 5 || status == "5") {
                    statusTxt = "Done";
                    notification_dot_color = "transparent";
                }
                var taskRow = `<tr class="align-items-center identify1">
                                        <td class="nowrap">${index + 1}</td>
                                        <td class="nowrap grid-p-searchby"><div title="${statusTxt}" style="position: relative; width: 20px; height: 20px; display:inline;margin-right:15px;">
                                        <span style="position: absolute; top: 0; right: 0; width: 10px; height: 10px; background-color: ${notification_dot_color}; border-radius: 50%; display: inline-block;"></span>
                                    </div>${formatDate(task.created_at)}</td>
                                        <td class="nowrap grid-p-searchby">${
                                            task.task_title
                                        }</td>
                                        <td class="nowrap grid-p-searchby">${
                                            task.building.building_name
                                        }</td>
                                        <td class="nowrap grid-p-searchby">${
                                            task.appartment.apartment_name
                                        }</td>
                                        <td class="nowrap grid-p-searchby" data-center>${
                                            task.manager.first_name
                                        }</td>
                                        <td class="grid-p-searchby">${priority}</td>
                                       
                                        <td class="nowrap grid-p-searchby" data-center>${document_typeTxt}</td>
                                        <td class="nowrap grid-p-searchby" >${
                                            task.document_status == 1
                                                ? "Viewed"
                                                : "Uploaded"
                                        }</td>
                                        <td class="nowrap grid-p-searchby">${statusTxt}</td>
                                        
                                       
                                        <td class="nowrap" data-center>
                                            <div class="act_btn">
                                            <button type="button" class="pop_btn viewdetailsbtn" title="View" data-id = "${
                                                task.id
                                            }" data-popup="viewdetailspopup"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/></svg></button>
                                            <a href="/admin/tasks/${
                                                task.id
                                            }/edit" class="edit  edit_btn" title="Edit"></a>
                                            <button type="button" class="del pop_btn delete_btn" title="Delete" data-id = "${
                                                task.id
                                            }" data-popup="delete-data-popup"></button>
                                            </div>
                                        </td>
                                    </tr>`;
                $("#done_tasks_table_body").append(taskRow);
            });
        } else {
            $("#done_tasks_table_body").empty();
            var taskRow = ` <tr colspan="10" data-center><td class="nowrap" data-center colspan="10">No Data Available</td></tr>`;
            $("#done_tasks_table_body").append(taskRow);
        }
    } else {
        $("#done_tasks_table_body").empty();
        var taskRow = ` <tr colspan="10" data-center><td class="nowrap" data-center colspan="10">No Data Available</td></tr>`;
        $("#done_tasks_table_body").append(taskRow);
    }
}

$("#advance_search_done_tasks_reset_btn").click(function () {
    $("#search_done_tasks_form")[0].reset();
    getTaskList();
});

$(document).ready(function () {
    getTaskList();
});
