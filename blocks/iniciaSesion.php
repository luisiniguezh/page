<?php

$con=mysqli_connect("localhost","root","","db3d");
//$con = mysqli_connect("192.168.52.23","dbil3dxuser","1wdRZ=Na.0EkS","db3dprinter");

$salt = '$^R9F|GK5J#E6W!bj30ab-wi=6^7-T;IO[JNf4gaX7hjg4&j(7mk?/3d';
$email = $_POST['inputCorreo'];
$password = $_POST['inputPassword'];
$password = md5($salt.$password);

$sql = "SELECT * FROM t_usr WHERE email = '$email'";
$result = $con->query($sql);
if ($result->num_rows > 0) {
      // verifica que coincida con el passw
      while($row = $result->fetch_assoc()) {
	//si coincide con el password es correcta y existe
         if( $row["password"] == "$password")
              {
                  echo $row["username"];
              }
		//si el passw es nulo está registrado con redes sociales
          else if(is_null($row["password"]) )
              {
                  echo "redes";
              }
          else //si no coincide la contraseÃ±a
                echo "!passw";

      }
  }
else
{
	echo "!existe";
}


mysqli_close($con);

?>