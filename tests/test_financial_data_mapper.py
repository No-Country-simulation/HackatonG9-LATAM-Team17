"""
Pruebas del FinancialDataMapper.

Autor: Mauricio Medina
"""

from src.financial_data_mapper import FinancialDataMapper


def test_meses_reserva_uses_gastos_esenciales():
    raw = {
        "fondo_emergencia": 3000,
        "gastos_esenciales": 1000,
        "gasto_mensual_total": 2000,
    }

    result = FinancialDataMapper.map(raw)

    assert result["meses_reserva"] == 3.0


def test_meses_reserva_falls_back_to_gasto_mensual_total():
    raw = {
        "fondo_emergencia": 2000,
        "gastos_esenciales": 0,
        "gasto_mensual_total": 1000,
    }

    result = FinancialDataMapper.map(raw)

    assert result["meses_reserva"] == 2.0


def test_meses_reserva_is_zero_when_no_expense_data():
    raw = {"fondo_emergencia": 500}

    result = FinancialDataMapper.map(raw)

    assert result["meses_reserva"] == 0.0


def test_ahorro_real_is_preserved_when_present():
    raw = {
        "ingreso_mensual": 3000,
        "gasto_mensual_total": 2800,
        "ahorro_real": 350,  # ya incluye aportes a inversión, distinto del cálculo simple
    }

    result = FinancialDataMapper.map(raw)

    assert result["ahorro_real"] == 350


def test_ahorro_real_is_derived_when_missing():
    raw = {
        "ingreso_mensual": 3000,
        "gasto_mensual_total": 2800,
    }

    result = FinancialDataMapper.map(raw)

    assert result["ahorro_real"] == 200


def test_map_does_not_mutate_original_dict():
    raw = {"ingreso_mensual": 1000, "gasto_mensual_total": 900}
    raw_copy = dict(raw)

    FinancialDataMapper.map(raw)

    assert raw == raw_copy
