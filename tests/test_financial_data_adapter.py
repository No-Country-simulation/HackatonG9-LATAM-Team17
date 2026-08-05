"""
Pruebas del adaptador de datos financieros.

Autor: Mauricio Medina
"""

from src.financial_data_adapter import adapt


def test_calcula_meses_reserva():
    financial_data = {
        "ingreso_mensual": 5000,
        "gasto_mensual_total": 4000,
        "gastos_esenciales": 3000,
        "fondo_emergencia": 6000,
        "servicios_suscripcion": 250,
    }

    resultado = adapt(financial_data)

    assert resultado["meses_reserva"] == 2.0


def test_calcula_ratio_suscripciones():
    financial_data = {
        "ingreso_mensual": 5000,
        "gasto_mensual_total": 4000,
        "gastos_esenciales": 3000,
        "fondo_emergencia": 6000,
        "servicios_suscripcion": 250,
    }

    resultado = adapt(financial_data)

    assert resultado["ratio_suscripciones"] == 0.05


def test_calcula_ahorro_real():
    financial_data = {
        "ingreso_mensual": 5000,
        "gasto_mensual_total": 4200,
        "gastos_esenciales": 3000,
        "fondo_emergencia": 6000,
        "servicios_suscripcion": 200,
    }

    resultado = adapt(financial_data)

    assert resultado["ahorro_real"] == 800