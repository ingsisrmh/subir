var cajadatos;

function iniciar()
{
	cajadatos = document.getElementById('cajadatos');
	cajadatos.addEventListener('dragenter', function(e)
											{
												e.preventDefault();
											});
	cajadatos.addEventListener('dragover', function(e)
											{
												e.preventDefault();
											});
	cajadatos.addEventListener('drop', soltar);
}

function soltar(e)
{
	e.preventDefault();
	
	var archivos = e.dataTransfer.files;

	if(archivos.length)
	{
		var lista = '';
		
		for(var f=0; f<archivos.length; f++)
		{
			var archivo = archivos[f];

			lista += '<div>archivo: ' + archivo.name;
			lista += '<br><span><progress> value="0" max="100">0%</progress></span>';
			lista += '</div>';
		}
		
		cajadatos.innerHTML = lista;

		var contar=0;
		var cargar=function()
					{
						var miarchivo=archivos[contar];
						var data = new FormData();

						data.append('archivo', miarchivo);
						
						var url = "process.php";
						var solicitud = new XMLHttpRequest();
						var xmlcargar = solicitud.upload;
						
						xmlcargar.addEventListener('progress', function(e)
																{
																	if(e.lengthComputable)
																	{
																		var child = contar+1;
																		var per = parseInt(e.loaded / e.total * 100);
																		var barraprogreso = cajadatos.querySelector("div:nth-child("+child+")>span>progress");
																		barraprogreso.value = per;
																		barraprogreso.innerHTML = per + '%';
																	}
																});
						solicitud.addEventListener('load', function()
															{
																var child = contar+1;
																var elem = cajadatos.querySelector("div:nth-child("+child+")>span");
																elem.innerHTML = 'Hecho';
																contar++;
																if(contar<archivos.length)
																{
																	cargar();
																}
															});
						solicitud.open("POST", url, true);
						solicitud.send(data);
					}
					cargar();
	}
}
addEventListener('load', iniciar);
