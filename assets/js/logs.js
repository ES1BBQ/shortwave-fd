import {ch2faff, ch2nato} from "./fonetic.js";
import { generate_log_cabrillo } from "./log_cabrillo.js";

/** Method for updating log entries */
export const refreshLogsTable = function () {
    document.getElementById('log').innerHTML = '';

    let nr = 0;
    let _qsos = [];

    const genQSORecords = function (j) {
        let row = document.createElement('div');

        /* check for duplicates */
        _qsos.push(j[1]);
        let _c = {}, i, value;
        for (i = 0; i < _qsos.length; i++) {
            value = _qsos[i];
            if (typeof _c[value] === "undefined") {
                _c[value] = 1;
            } else {
                _c[value]++;
            }
        }

        if(_c[j[1]]>1)
            row.className = "logRow logRowDuplicate"
        else
            row.className = "logRow"

        /* Add row numbers */
        nr+=1;
        let nrc = document.createElement('div');
        nrc.innerHTML = nr;
        row.appendChild(nrc);

        for (let i = 0; i < j.length; i++) {
            let cell = document.createElement('div');
            cell.innerHTML = j[i];
            row.appendChild(cell);
        }
        let cell = document.createElement('div');

        let editBut = document.createElement('button');
        editBut.innerHTML = '&#9998;';
        editBut.classList.add("short","green");
        editBut.addEventListener('click', editLog);
        cell.appendChild(editBut);

        let delBut = document.createElement('button');
        delBut.innerHTML = '&cross;';
        delBut.classList.add("short","red");
        delBut.addEventListener('click', clearLog);
        cell.appendChild(delBut);


        row.appendChild(cell);
        document.getElementById('log').appendChild(row);
    };
    const QSORecords = JSON.parse(localStorage['QSORecords'] || "[]");
    QSORecords.forEach(x => genQSORecords(x));
}

export const updatePage = function () {

    let loc = '';

    /** Update my callsign value */
    loc = '';
    for (let i = 0; i < localStorage['PCall'].length; i++) {
        loc = loc.concat((i === 0) ? '' : ' ', (localStorage['finnish_fonetics'] == 1) ? ch2faff(localStorage['PCall'].toLowerCase().charAt(i)) : ch2nato(localStorage['PCall'].toLowerCase().charAt(i)) )
    }
    document.getElementById('my_callsign').innerHTML = localStorage['PCall'].toUpperCase();
    document.getElementById('my_callsign_fonetic').innerHTML = loc;

    /** Update my coefficient value */
    loc = '';
    let coefficient = (localStorage['Coefficient']) ? localStorage['Coefficient'] : document.getElementById('Coefficient').value;
    for (let i = 0; i < coefficient.length; i++) {
        loc = loc.concat((i === 0) ? '' : ' ', (localStorage['finnish_fonetics'] == 1) ? ch2faff(coefficient.toLowerCase().charAt(i)) : ch2nato(coefficient.toLowerCase().charAt(i)) )
    }
    document.getElementById('my_coefficient').innerHTML = coefficient.toUpperCase();
    document.getElementById('my_coefficient_fonetic').innerHTML = loc;

    /** Update my next number value */
    const QSORecords = JSON.parse(localStorage['QSORecords'] || "[]");
    let next_number = QSORecords.length+1;
    document.getElementById('my_next_number').innerHTML = leadingZeros(next_number,3);

    const listQSORecords = function (i) {
        finalEDI = finalEDI.concat("\n" + localStorage['TDate'].substring(2).replace(/-/g, '') + ";" + i[0] + ";" + i[1] + ";" + i[3] + ";" + i[4] + ";;" + i[5] + ";;;" + i[2] + ";0;;N;N;");
    };

    let finalEDI = "[REG1TEST;1]\n";
    finalEDI = finalEDI.concat("[Remarks]\n", (localStorage['remarks'] && localStorage['remarks'].length > 1) ? localStorage['remarks'] + "\n" : "");

    finalEDI = finalEDI + "[QSORecords;" + QSORecords.length + "]";
    QSORecords.forEach(x => listQSORecords(x));
    document.getElementById('finalEDI').value = finalEDI;
    generate_log_cabrillo();
};

const leadingZeros = function (num,places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

/** Method to mark missing input */
const markInputs = function() {
    document.querySelectorAll('.missing').forEach(x => x.classList.remove('missing'));
    if (0 < document.getElementById('log_time').value.length && document.getElementById('log_time').value.length < 4) document.getElementById('log_time').classList.add('missing');
    if (document.getElementById('log_callsign').value.length === 0) document.getElementById('log_callsign').classList.add('missing');
    if (document.getElementById('log_mode').value.length === 0) document.getElementById('log_mode').classList.add('missing');
    if (document.getElementById('log_tx_rst').value.length === 0) document.getElementById('log_tx_rst').classList.add('missing');
    if (document.getElementById('log_loc').value.length === 0) document.getElementById('log_loc').classList.add('missing');
    if (document.getElementById('log_rx_rst').value.length === 0) document.getElementById('log_rx_rst').classList.add('missing');
}

/** Method for adding log entries */
const addLog = function () {
    const QSORecords = JSON.parse(localStorage['QSORecords'] || "[]");

    if (document.getElementById('log_time').value.length <= 0) {
        let ct = new Date();
        document.getElementById('log_time').value = ct.toISOString().match(/\d\d:\d\d/).toString().replace(/[^0-9]/g, '');
    } else {
        document.getElementById('log_time').value = document.getElementById('log_time').value.replace(/[^0-9]/g, '').substring(0,4);
    }

    markInputs();

    if (
        document.getElementById('log_time').value.length === 4 &&
        document.getElementById('log_callsign').value.length > 0 &&
        document.getElementById('log_mode').value.length > 0 &&
        document.getElementById('log_tx_rst').value.length > 0 &&
        document.getElementById('log_loc').value.length > 0 &&
        document.getElementById('log_rx_rst').value.length > 0
    ) {
        if (document.getElementById('log_edit').value != 0) {
            let e = document.getElementById('log_edit').value;
            QSORecords[e-1] = [
                document.getElementById('log_time').value.replace(/[^0-9]/g, ''),
                document.getElementById('log_callsign').value.toUpperCase(),
                document.getElementById('log_loc').value.toUpperCase(),
                document.getElementById('log_mode').value,
                document.getElementById('log_tx_rst').value,
                document.getElementById('log_rx_rst').value
            ];
        } else {
            QSORecords.push([
                document.getElementById('log_time').value.replace(/[^0-9]/g, ''),
                document.getElementById('log_callsign').value.toUpperCase(),
                document.getElementById('log_loc').value.toUpperCase(),
                document.getElementById('log_mode').value,
                document.getElementById('log_tx_rst').value,
                document.getElementById('log_rx_rst').value
            ]);
        }
        localStorage['QSORecords'] = JSON.stringify(QSORecords);

        /* Reset form values */
        document.getElementById('log_edit').value = 0;
        document.getElementById('log_time').value = '';
        document.getElementById('log_callsign').value = '';
        document.getElementById('log_loc').value = '';
        document.getElementById('log_callsign').focus();
    }

    refreshLogsTable();
    updatePage();
}

/** Method to edit a log entry */
const editLog = function(e) {
    let d = e.target.parentNode.parentNode.children;
    document.getElementById('log_edit').value = d[0].textContent;
    document.getElementById('log_time').value = d[1].textContent;
    document.getElementById('log_callsign').value = d[2].textContent;
    document.getElementById('log_loc').value = d[3].textContent;
    document.getElementById('log_tx_rst').value = d[5].textContent;
    document.getElementById('log_rx_rst').value = d[6].textContent;

    let s = document.getElementById('log_mode');
    let opts = s.options;
    for (let opt, j = 0; opt = opts[j]; j++) {
        if (opt.value === d[4].textContent) {
            s.selectedIndex = j;
            break;
        }
    }
}

/** Method to clear a log entry */
const clearLog = function (e) {
    const QSORecords = JSON.parse(localStorage['QSORecords'] || "[]");
    let d = e.target.parentNode.parentNode.firstChild.textContent;
    QSORecords.splice(d-1, 1);
    localStorage['QSORecords'] = JSON.stringify(QSORecords);
    refreshLogsTable();
    updatePage();
}

/** Method to clear all logs */
const clearLogs = function () {
    let r = confirm("Do you really want to clear the log?");
    if (r === true) {
        localStorage['QSORecords'] = JSON.stringify([]);
        refreshLogsTable();
        updatePage();
    }
}

/** Log input enter magic */
document.getElementById('log_time').addEventListener("keydown", function (event) {
    if ((event.key === 'Enter')||(event.key === 'Tab')) {
        event.preventDefault();
        if (this.value.length > 0) {
            this.classList.remove('missing');
        } else {
            let ct = new Date();
            document.getElementById('log_time').value = ct.toISOString().match(/\d\d:\d\d/).toString().replace(/:/g, '').replace(/\./g, '');
        }
        document.getElementById("log_callsign").focus();
    }
});

document.getElementById('log_callsign').addEventListener("keydown", function (event) {
    if (this.value.length > 0) this.classList.remove('missing');
    if (event.key === 'Enter') {
        event.preventDefault();
        if (this.value.length > 0) document.getElementById("log_loc").focus();
    }
});

document.getElementById('log_loc').addEventListener("keydown", function (event) {
    if (this.value.length > 0) this.classList.remove('missing');
    if (event.key === 'Enter') {
        event.preventDefault();
        if (this.value.length > 0) document.getElementById("log_mode").focus();
    }
});

document.getElementById('log_mode').addEventListener("keydown", function (event) {
    if (this.value.length > 0) this.classList.remove('missing');
    if (event.key === 'Enter') {
        event.preventDefault();
        if (this.value.length > 0) document.getElementById("log_tx_rst").focus();
    }
});

document.getElementById('log_tx_rst').addEventListener("keydown", function (event) {
    if ((event.key === 'Enter')||(event.key === 'Tab')) {
        event.preventDefault();
        if (this.value.length === 0) {
            this.value = '59';
            this.classList.remove('missing');
        }
        document.getElementById("log_rx_rst").focus();
    }
});

document.getElementById('log_rx_rst').addEventListener("keydown", function (event) {
    if ((event.key === 'Enter')||(event.key === 'Tab')) {
        event.preventDefault();
        if (this.value.length === 0) this.value = '59';
        addLog();
    }
});

/** Add and Clear Logs */
document.getElementById('log_reset').addEventListener('click', clearLogs);
document.getElementById('log_write').addEventListener('click', addLog);