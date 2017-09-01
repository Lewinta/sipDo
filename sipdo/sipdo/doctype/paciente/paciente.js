// Copyright (c) 2017, Lewin Villar and contributors
// For license information, please see license.txt

frappe.ui.form.on('Paciente', {
	refresh: function(frm) {
		//El usuario solo puede agregar la ARS al crear el paciente, luego solo las ARS pueden modificar estos campos 
		if (!frm.doc.__islocal){
			/*frm.set_df_property("nss","read_only",1)
			frm.set_df_property("ars","read_only",1)*/
		}
		// Filtro solo para ver las ARS 
		frm.set_query("ars", function() {
            return {
                "filters": {
                    "tipo": "ARS"
                }
            }
        });
	},
	validate: function(frm){
		//Validar que si alguno de los dos tiene data, el otro tambien 
		if(frm.doc.ars || frm.doc.nss){
			frm.set_df_property("nss","reqd",1)
			frm.set_df_property("ars","reqd",1)
		}
		
		fields = ["dir_calle","dir_edificio","dir_numero","dir_apartamento","dir_sector","dir_provincia"]

		$.each(fields,function(key1, val1){
			if (frm.get_field(val1).value){
				$.each(fields,function(key2, val2){
					frm.set_df_property(val2, "reqd", 1)
				})
				return
			}
		})

		
		if (frm.doc.sexo == "-"){
			frappe.msgprint("Debes seleccionar el sexo del Paciente!")
			frappe.validated = false
			return 
		}	
	},
	primer_nombre: function(frm) {
		if (frm.doc.primer_nombre)
			frm.set_value("primer_nombre", frm.doc.primer_nombre.trim().toUpperCase())
			frm.trigger("nombre_completo")
	},
	segundo_nombre: function(frm) {
		if (frm.doc.segundo_nombre)
			frm.set_value("segundo_nombre", frm.doc.segundo_nombre.trim().toUpperCase())
			frm.trigger("nombre_completo")
	},
	apellido_materno: function(frm) {
		if (frm.doc.apellido_materno)
			frm.set_value("apellido_materno", frm.doc.apellido_materno.trim().toUpperCase())
			frm.trigger("nombre_completo")
	},
	apellido_paterno: function(frm) {
		if (frm.doc.apellido_paterno)
			frm.set_value("apellido_paterno", frm.doc.apellido_paterno.trim().toUpperCase())
			frm.trigger("nombre_completo")
	},
	nombre_completo: function(frm) {
		
		//Limpiamos el campo para garantizar integridad
		frm.doc.nombre_completo = ""
			
		if (frm.doc.primer_nombre){
			
			frm.doc.nombre_completo = frm.doc.primer_nombre
		
			if (frm.doc.segundo_nombre)
				frm.doc.nombre_completo += " "+frm.doc.segundo_nombre
			
			if (frm.doc.apellido_paterno)
				frm.doc.nombre_completo += " "+frm.doc.apellido_paterno
			
			if (frm.doc.apellido_materno)
				frm.doc.nombre_completo += " "+frm.doc.apellido_materno
		}
		
		refresh_field("nombre_completo")
	},
	cedula_pasaporte: function(frm){
		frm.set_value("cedula_pasaporte", mask_ced_pas_rnc(frm.doc.cedula_pasaporte))
	},
	correo_electronico: function(frm){
		if(frm.doc.correo_electronico && !valida_correo(frm.doc.correo_electronico)){
			frm.set_value("correo_electronico", "")
			frappe.msgprint("El correo electronico ingresado no es valido!")
		}
	},
	dir_calle: function(frm) {
		if (frm.doc.dir_calle)
			frm.set_value("dir_calle", frm.doc.dir_calle.trim().toUpperCase())
	},
	dir_edificio: function(frm) {
		if (frm.doc.dir_edificio)
			frm.set_value("dir_edificio", frm.doc.dir_edificio.trim().toUpperCase())
	},
	dir_apartamento: function(frm) {
		if (frm.doc.dir_apartamento)
			frm.set_value("dir_apartamento", frm.doc.dir_apartamento.trim().toUpperCase())
	},
	dir_sector: function(frm) {
		if (frm.doc.dir_sector)
			frm.set_value("dir_sector", frm.doc.dir_sector.trim().toUpperCase())
	}

});

frappe.ui.form.on("Telefonos", {
	telefono: function(frm, cdt, cdn){
		var row = locals[cdt][cdn]; 
		frappe.model.set_value(cdt, cdn, "telefono", mask_phone(row.telefono));
	}
})


function mask_ced_pas_rnc(input)
{
	input = input.trim().replace(/-/g,"")
	
	if (input.length == 11)
		return ("{0}{1}{2}-{3}{4}{5}{6}{7}{8}{9}-{10}".format(input));

	if (input.length == 9)
		return ("{0}-{1}{2}-{3}{4}{5}{6}{7}-{8}".format(input));
	
	return input
}

function mask_phone(phone)
{
	var pattern = new RegExp("((^[0-9]{3})[0-9]{3}[0-9]{4})$");
	var pattern1 = new RegExp("([(][0-9]{3}[)] [0-9]{3}-[0-9]{4})$");
	var pattern2 = new RegExp("([(][0-9]{3}[)][0-9]{3}-[0-9]{4})$");

	if(pattern.test(phone))
		return ("({0}{1}{2}) {3}{4}{5}-{6}{7}{8}{9}".format(phone));
	else if(pattern1.test(phone))
		return phone;
	else if(pattern2.test(phone))
		return ("{0}{1}{2}{3}{4} {5}{6}{7}{8}{9}{10}{11}{12}".format(phone));
}
function valida_correo(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}