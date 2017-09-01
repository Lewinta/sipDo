// Copyright (c) 2017, Lewin Villar and contributors
// For license information, please see license.txt

frappe.ui.form.on('Empresa', {
	refresh: function(frm) {

	},
	tipo: function(frm) {
		if (frm.doc.tipo == "ARS")
			frm.set_value("naming_series", "ARS-.######")
		
		if (frm.doc.tipo == "CLINICA")
			frm.set_value("naming_series", "CLI-.######")

		if (frm.doc.tipo == "HOSPITAL")
			frm.set_value("naming_series", "HOS-.######")
	},
	nombre: function(frm) {
		if (frm.doc.nombre)
			frm.set_value("nombre", frm.doc.nombre.trim().toUpperCase())
	},
	rnc: function(frm) {
		frm.set_value("rnc", mask_ced_pas_rnc(frm.doc.rnc))
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