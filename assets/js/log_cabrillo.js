export const generate_log_cabrillo = function() {
    let log = "START-OF-LOG: 3.0\n";
    log = log.concat("CONTEST: ", (localStorage['Contest']) ? localStorage['Contest'] : '', "\n");
    log = log.concat("GRID-LOCATOR: ", (localStorage['PWWLo']) ? localStorage['PWWLo'].toUpperCase() : '', "\n");
    log = log.concat("CALLSIGN: ", (localStorage['PCall']) ? localStorage['PCall'].toUpperCase() : '', "\n");
    log = log.concat("NAME: ", (localStorage['RName']) ? localStorage['RName'] : '', "\n");
    log = log.concat("ADDRESS: ", (localStorage['Address']) ? localStorage['Address'] : '', "\n");
    log = log.concat("EMAIL: ", (localStorage['Email']) ? localStorage['Email'].toLowerCase() : '', "\n");
    log = log.concat("CREATED-BY: BBQLog-SWFD - https://es1bbq.github.io/shortwave-fd/", "\n");

    /**
     QSO: 7005 CW 2009-05-30 0002 AA1ZZZ 599 1 S50A 599 4
     QSO: 7006 CW 2009-05-30 0015 AA1ZZZ 599 2 EF8M 599 34
     */

    log = log.concat("END-OF-LOG:", "\n");

    document.getElementById('log_cabrillo').value = log;
};