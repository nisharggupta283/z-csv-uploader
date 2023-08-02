var pageNo = 1;

function callNextPage() {
    pageNo++;
    callAjexMethod();
    if (pageNo > 1)
        $('#previous').removeAttr('class').attr('class', 'page-item');
    else
        $("#previous").attr("class", 'disabled');
}
function callPrevPage() {
    pageNo--;
    callAjexMethod();
    if (pageNo > 1)
        $('#previous').removeAttr('class').attr('class', 'page-item');
    else
        $("#previous").attr("class", 'disabled page-item');
}
function populateData(data) {
    $('#to-delete').remove();
    tbody = $('<tbody/>', { id: 'to-delete' });

    let count = '';
    for (let i = 0; i < data.length; i++) {
        count = count == 'active-row' ? '' : 'active-row';
        tr = $('<tr/>', { class: count });
        for (x of data[i]) {
            tr.append($('<td/>', { text: x }));
        }
        tbody.append(tr);
    }
    $('#to-append').append(tbody);
    $('#page-no').text('Page No:' + pageNo);
}
function callAjexMethod() {
    $.ajax({
        type: "GET",
        url: "/csv/csvdata?id=" + id + "&pageNo=" + pageNo + "&flag=" + 1,
        dataType: "JSON",
        cache: false,
        async: false,
        error: function (err) {
            alert('Error occured see console to check more');
            console.log(err);
        },
        success: function (data) {
            console.log(data);
            data = JSON.parse(JSON.stringify(data));
            populateData(data);
        },
    });
}

function goToPage(id) {
    location.href = '/csv/csvdata?id=' + id + '&random=' + Math.random();
}

function validateFileType() {
    const filename = $('#data');
    const extension = filename.val().substring(filename.val().lastIndexOf('.') + 1);
    console.log(extension);
    if (extension == 'csv') {
        document.my_form.submit();
    } else {
        $('#data').attr('class', 'form-control is-invalid');
        $('#invalid-file-type').text('Invalid File type please upload .csv file only');
        return;
    }
}
var callAutoFillMethod = function (e, flag = 1,val='') {

    let filter=e.value;
    if(val)
    filter=val;

    if (filter && filter.length >= 2) {
        $.ajax({
            type: "GET",
            url: "/csv/filter?id=" + id + "&pageNo=" + pageNo + "&flag=" + 1 + '&select=' + $('#select-filter').val() + '&input=' + filter + '&typedef=' + flag,
            dataType: "JSON",
            cache: false,
            async: false,
            error: function (err) {
                alert('Error occured see console to check more');
                console.log(err);
            },
            success: function (data) {
                console.log(data);
                data = JSON.parse(JSON.stringify(data));
                if (flag == 1)
                    recordAutoFill(data);
                else
                    populateData(data);
            },
        });
    }
}
function recordAutoFill(data) {
    $("#filter-input").autocomplete({
        source: data,
        select: callAfterAutoSelection,
    });
}
function callAfterAutoSelection(event, ui) {
    console.log(event.target);
    console.log(ui.item.value);
    callAutoFillMethod(event.target,2,ui.item.value);
}
