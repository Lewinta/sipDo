import frappe
import datetime

def calcular_edades():
	pacientes = frappe.get_list("Paciente")
	for p in pacientes:
		paciente = frappe.get_doc("Paciente",p.name)
		paciente.edad = (datetime.date.today() - p.fecha_de_nacimiento).days/365
		paciente.db_update()