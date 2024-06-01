export const generate_log_cabrillo = function() {
    let log = "START-OF-LOG: 3.0\n";
    log = log.concat("CONTEST: ", (localStorage['Contest']) ? localStorage['Contest'] : '', "\n");
    log = log.concat("GRID-LOCATOR: ", (localStorage['PWWLo']) ? localStorage['PWWLo'].toUpperCase() : '', "\n");
    log = log.concat("CALLSIGN: ", (localStorage['PCall']) ? localStorage['PCall'].toUpperCase() : '', "\n");
    log = log.concat("NAME: ", (localStorage['RName']) ? localStorage['RName'] : '', "\n");
    log = log.concat("ADDRESS: ", (localStorage['Address']) ? localStorage['Address'] : '', "\n");
    log = log.concat("EMAIL: ", (localStorage['Email']) ? localStorage['Email'].toLowerCase() : '', "\n");
    log = log.concat("CREATED-BY: BBQLog-SWFD - https://es1bbq.github.io/shortwave-fd/", "\n");

    const listQSORecords = function (i) {
        log = log + 'QSO:';
        log = log + spaces(' 3500', 5, true);                                                   // Frequency
        log = log + spaces(' '+i[0], 2);                                                             // Mode
        log = log + spaces(' ' + localStorage['TDate'],10);                                          // Date
        log = log + spaces(' ' + i[1],4);                                                            // Time
        log = log + spaces(' ' + i[2],10);                                                           // Sent Callsign
        log = log + spaces(' ' + i[3],3);                                                            // Sent Coefficient
        log = log + spaces(' ' + i[4],3);                                                            // Sent RST
        log = log + spaces(' ' + i[5],6);                                                            // Sent number
        log = log + spaces(' ' + i[6],10);                                                           // Received Callsign
        log = log + spaces(' ' + i[7],3);                                                            // Received Coefficient
        log = log + spaces(' ' + i[8],3);                                                            // Received RST
        log = log + spaces(' ' + i[9],6);                                                            // Received number
        log = log + "\n";
    };

    const QSORecords = JSON.parse(localStorage['QSORecords'] || "[]");
    QSORecords.forEach(x => listQSORecords(x));

    log = log.concat("END-OF-LOG:", "\n");
    document.getElementById('log_cabrillo').value = log;
}

const spaces = function (value,places, right=false) {
    var spaces = places - value.toString().length + 1;
    if (right)
        return Array(+(spaces > 0 && spaces)).join(" ") + value;
    else
        return value + Array(+(spaces > 0 && spaces)).join(" ");
}
