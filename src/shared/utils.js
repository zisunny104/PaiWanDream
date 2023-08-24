function csvToArray(result) {
    let resultArray = [];
    result.split("\n").forEach(function (row) {
        if (row) {
            row = row.trimEnd();
            let rowArray = [];
            row.split(",").forEach(function (cell) {
                rowArray.push(cell);
            });
            resultArray.push(rowArray);
        }
    });
    return resultArray;
}

function arrayToTable(result, keyName) {
    var array = csvToArray(result); //this is where the csv array will be
    let content = "";
    let count = 0;
    array.forEach(function (row) {
        if (count == 0) {
            content += "<thead><tr>";
            let count_cell = 0;
            row.forEach(function (cell) {
                content += "<th>" + cell + "</th>";
                count_cell = count_cell + 1;
            });
            content += "</tr></thead>";
            content += "<tbody>";
        } else {
            content += "<tr>";
            row.forEach(function (cell) {
                content += "<td>" + cell + "</td>";
            });
            content += "</tr>";
        }
        count = count + 1;
    });
    content += "</tbody>";
    return content;
}

function createTable() {
    let csvFile = document.getElementById("csvFile");
    let reader = new FileReader();
    let f = csvFile.files[0];
    reader.onload = function (e) {
        document.getElementById("dataTable").innerHTML = arrayToTable(e.target.result, "data");
    };
    reader.readAsText(f);
}

function filterTable(input, table, index) {
    // Declare variables
    let filter, tr, td, i, txtValue;
    filter = input.value;
    tr = table.getElementsByTagName("tr");
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[index];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function filterTable_data() {
    let input = document.getElementById("filterInput_data");
    let table = document.getElementById("dataTable");
    filterTable(input, table, 0);
}