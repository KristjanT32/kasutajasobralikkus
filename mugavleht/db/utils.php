<?php

$db = "sbepank";
$user = "sbe";
$password = "imeI0yk*_zkxmgu_iq3VeXs£M8;KCVkorxS=QK<055&IDn^:PJ";
$host = "152.70.50.137";

function connect() {
    global $db, $user, $password, $host;
    return mysqli_connect($host, $user, $password);
}

function test_connect() {
    $con = connect();
    if (!$con) {
        die("Fuck. The shit's broken.");
    } else {
        echo "Cool beans.";
    }
}
