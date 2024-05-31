export const generate_log_cabrillo = function() {
    let log = "START-OF-LOG: 3.0\n";
    log = log.concat("CONTEST: ", (localStorage['Contest']) ? localStorage['Contest'] : '', "\n");
    log = log.concat("CALLSIGN: ", (localStorage['PCall']) ? localStorage['PCall'].toUpperCase() : '', "\n");
    log = log.concat("LOCATION: ", (localStorage['PWWLo']) ? localStorage['PWWLo'].toUpperCase() : '', "\n");
    document.getElementById('log_cabrillo').value = log;
};