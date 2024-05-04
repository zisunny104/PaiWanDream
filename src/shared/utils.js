/*exports.setCookie = function setCookie(cookieName, cookieValue, expiryDate) {
    var d = new Date();
    d.setTime(d.getTime() + (expiryDate * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + d.toUTCString();
    if (expiryDate == -1) {
        expires = "";
    }
    document.cookie = cookieName + "=" + cookieValue + expires + "; path=/";
}

exports.getCookie = function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

exports.clearAllCookie = function clearAllCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}*/

exports.getRandom = function getRandom(a, b) {
    let max = Math.max(a, b);
    let min = Math.min(a, b);
    return parseInt(Math.random() * (max - min)) + min;
}

exports.sleep = function sleep(millisecond) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, millisecond)
    })
}


/*

export function csvToArray(result) {
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

export function arrayToTable(result, keyName) {
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

export function createTable() {
    let csvFile = document.getElementById("csvFile");
    let reader = new FileReader();
    let f = csvFile.files[0];
    reader.onload = function (e) {
        document.getElementById("dataTable").innerHTML = arrayToTable(e.target.result, "data");
    };
    reader.readAsText(f);
}

export function filterTable(input, table, index) {
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

export function filterTable_data() {
    let input = document.getElementById("filterInput_data");
    let table = document.getElementById("dataTable");
    filterTable(input, table, 0);
}*/