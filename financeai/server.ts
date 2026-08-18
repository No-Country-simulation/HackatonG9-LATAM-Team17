import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini client lazily
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // In-memory persistent database for the session
  let userProfile = {
    name: "Alex Doe",
    email: "alex@example.com",
    monthlyIncome: 5200,
    totalDebts: 875000,
    monthlyDebtPayment: 350000,
    savingsFrequency: "Mensual",
    emergencyFund: 1500000,
    budgetGoal: 3000000,
    subscriptionsCount: 3,
    debtRatio: 35,
  };

  let transactions = [
    { id: "tx-1", description: "Alquiler de departamento", amount: 1200, category: "Vivienda", date: "2024-10-14", type: "gasto" },
    { id: "tx-2", description: "Supermercado semanal", amount: 420, category: "Alimentación", date: "2024-10-13", type: "gasto" },
    { id: "tx-3", description: "Gasolina y transporte público", amount: 300, category: "Transporte", date: "2024-10-12", type: "gasto" },
    { id: "tx-4", description: "Luz, agua e internet fibra", amount: 150, category: "Servicios", date: "2024-10-10", type: "gasto" },
    { id: "tx-5", description: "Farmacia y vitaminas", amount: 80, category: "Salud", date: "2024-10-09", type: "gasto" },
    { id: "tx-6", description: "Suscripciones streaming y cine", amount: 40, category: "Entretenimiento", date: "2024-10-08", type: "gasto" },
  ];

  let analysisHistory = [
    {
      id: "an-1",
      date: "24 Oct, 2023",
      timestamp: 1698144000000,
      totalSpent: 12450,
      healthScore: 92,
      status: "Saludable",
      encouragingMessage: "¡Excelente disciplina! Has mantenido tus gastos esenciales controlados y aumentaste tu tasa de ahorro.",
      weeklyAchievement: {
        title: "¡Ahorraste 18% más que el mes anterior!",
        percentageGain: 18,
        hoursLeft: 36,
      },
      categoryDistribution: [
        { category: "Vivienda", amount: 1200, percentage: 26.7, color: "#4648d4" },
        { category: "Alimentación", amount: 420, percentage: 9.3, color: "#fd933d" },
        { category: "Transporte", amount: 300, percentage: 6.7, color: "#712ae2" },
        { category: "Servicios", amount: 150, percentage: 3.3, color: "#38bdf8" },
        { category: "Salud", amount: 80, percentage: 1.8, color: "#10b981" },
        { category: "Entretenimiento", amount: 40, percentage: 0.9, color: "#ef4444" },
      ],
      recommendations: [
        {
          id: "rec-1",
          title: "Mantén el ritmo de ahorro",
          description: "Continúa aportando $200 mensuales a tu fondo de ahorro para imprevistos.",
          category: "Ahorro",
          impact: "+$2,400 al año",
          actionLabel: "Ver reportes",
          statusType: "success",
        },
      ],
    },
    {
      id: "an-2",
      date: "15 Sep, 2023",
      timestamp: 1694774400000,
      totalSpent: 11200,
      healthScore: 82,
      status: "En observación",
      encouragingMessage: "¡Vamos a mejorar tu salud financiera! Pequeños ajustes en gastos hormiga marcarán una gran diferencia.",
      weeklyAchievement: {
        title: "¡Ahorraste 15% más que la semana pasada!",
        percentageGain: 15,
        hoursLeft: 48,
      },
      categoryDistribution: [
        { category: "Vivienda", amount: 1200, percentage: 26.7, color: "#4648d4" },
        { category: "Alimentación", amount: 420, percentage: 9.3, color: "#fd933d" },
        { category: "Transporte", amount: 300, percentage: 6.7, color: "#712ae2" },
        { category: "Servicios", amount: 150, percentage: 3.3, color: "#38bdf8" },
        { category: "Salud", amount: 80, percentage: 1.8, color: "#10b981" },
        { category: "Entretenimiento", amount: 40, percentage: 0.9, color: "#ef4444" },
      ],
      recommendations: [
        {
          id: "rec-2",
          title: "Reduce entretenimiento",
          description: "Monitorear gastos recurrentes de streaming y suscripciones olvidadas.",
          category: "Entretenimiento",
          impact: "Ahorra $40/mes",
          actionLabel: "Ver detalles",
          statusType: "danger",
        },
        {
          id: "rec-3",
          title: "Aumenta ahorro",
          description: "Reserva +200 pesos mensuales al inicio de mes.",
          category: "Ahorro",
          impact: "+$2,400 al año",
          actionLabel: "Configurar",
          statusType: "warning",
        },
      ],
    },
    {
      id: "an-3",
      date: "02 Ago, 2023",
      timestamp: 1690972800000,
      totalSpent: 14800,
      healthScore: 68,
      status: "Riesgo",
      encouragingMessage: "No te desanimes, ¡cada paso cuenta! Ajustando el plan de liquidación de deudas volverás a la senda verde.",
      weeklyAchievement: {
        title: "Fondo de emergencia iniciado con éxito",
        percentageGain: 8,
        hoursLeft: 72,
      },
      categoryDistribution: [
        { category: "Vivienda", amount: 1200, percentage: 25.0, color: "#4648d4" },
        { category: "Alimentación", amount: 550, percentage: 11.5, color: "#fd933d" },
        { category: "Transporte", amount: 400, percentage: 8.3, color: "#712ae2" },
        { category: "Servicios", amount: 200, percentage: 4.2, color: "#38bdf8" },
        { category: "Salud", amount: 150, percentage: 3.1, color: "#10b981" },
        { category: "Entretenimiento", amount: 180, percentage: 3.8, color: "#ef4444" },
      ],
      recommendations: [
        {
          id: "rec-4",
          title: "Refinancia deudas de alto interés",
          description: "Consolida tus pasivos para reducir el costo financiero mensual.",
          category: "Deudas",
          impact: "Reduce 12% intereses",
          actionLabel: "Plan de pago",
          statusType: "danger",
        },
      ],
    },
  ];

  // API: Get Profile
  app.get("/api/profile", (req, res) => {
    res.json(userProfile);
  });

  // API: Update Profile
  app.put("/api/profile", (req, res) => {
    const updates = { ...req.body };
    if (updates.monthlyIncome !== undefined) updates.monthlyIncome = Math.max(0, Number(updates.monthlyIncome) || 0);
    if (updates.totalDebts !== undefined) updates.totalDebts = Math.max(0, Number(updates.totalDebts) || 0);
    if (updates.monthlyDebtPayment !== undefined) updates.monthlyDebtPayment = Math.max(0, Number(updates.monthlyDebtPayment) || 0);
    if (updates.emergencyFund !== undefined) updates.emergencyFund = Math.max(0, Number(updates.emergencyFund) || 0);
    if (updates.budgetGoal !== undefined) updates.budgetGoal = Math.max(0, Number(updates.budgetGoal) || 0);
    if (updates.subscriptionsCount !== undefined) updates.subscriptionsCount = Math.max(0, Number(updates.subscriptionsCount) || 0);
    if (updates.debtRatio !== undefined) updates.debtRatio = Math.max(0, Number(updates.debtRatio) || 0);
    
    userProfile = { ...userProfile, ...updates };
    res.json({ success: true, profile: userProfile });
  });

  // API: Delete Account
  app.delete("/api/account", (req, res) => {
    userProfile = {
      name: "Usuario",
      email: "",
      monthlyIncome: 0,
      totalDebts: 0,
      monthlyDebtPayment: 0,
      savingsFrequency: "Mensual",
      emergencyFund: 0,
      budgetGoal: 0,
      subscriptionsCount: 0,
      debtRatio: 0,
    };
    transactions = [];
    analysisHistory = [];
    res.json({ success: true, message: "Cuenta y datos eliminados correctamente", profile: userProfile });
  });

  // API: Categorize Transaction with AI (El Experto Alentador)
  app.post("/api/categorize", async (req, res) => {
    try {
      const { description } = req.body;
      if (!description || typeof description !== "string") {
        return res.json({ category: "Otros", confidence: 0, failed: true });
      }

      const validCategories = [
        "Vivienda",
        "Alimentación",
        "Transporte",
        "Servicios",
        "Salud",
        "Entretenimiento",
        "Otros",
      ];

      const ai = getAiClient();
      if (ai) {
        try {
          const prompt = `Clasifica la siguiente descripción de gasto financiero en EXACTAMENTE UNA de estas categorías:
Categorías válidas: Vivienda, Alimentación, Transporte, Servicios, Salud, Entretenimiento, Otros.

Descripción: "${description}"

Si no estás seguro o la descripción no tiene sentido financiero (por ejemplo letras aleatorias o caracteres extraños), asigna "Otros" y marca failed = true.`;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  category: {
                    type: Type.STRING,
                    enum: validCategories,
                  },
                  confidence: {
                    type: Type.NUMBER,
                    description: "Score between 0 and 1",
                  },
                  failed: {
                    type: Type.BOOLEAN,
                    description: "True if model failed to identify a clear specific category",
                  },
                },
                required: ["category", "confidence", "failed"],
              },
            },
          });

          if (response.text) {
            const parsed = JSON.parse(response.text);
            return res.json(parsed);
          }
        } catch (err) {
          console.error("AI categorization error, fallback to keyword:", err);
        }
      }

      // Keyword fallback
      const descLower = description.toLowerCase();
      let cat = "Otros";
      let failed = true;

      if (/renta|alquiler|casa|depa|mantenimiento/.test(descLower)) { cat = "Vivienda"; failed = false; }
      else if (/super|comida|restaurante|cafe|cena|almuerzo|rappi|uber\s*eats/.test(descLower)) { cat = "Alimentación"; failed = false; }
      else if (/gasolina|uber|taxi|metro|bus|pasaje|peaje/.test(descLower)) { cat = "Transporte"; failed = false; }
      else if (/luz|agua|gas|internet|telefono|fibra|wifi/.test(descLower)) { cat = "Servicios"; failed = false; }
      else if (/farmacia|medico|doctor|clinica|salud|medicamento/.test(descLower)) { cat = "Salud"; failed = false; }
      else if (/cine|netflix|spotify|disney|juego|salida|bar/.test(descLower)) { cat = "Entretenimiento"; failed = false; }

      res.json({ category: cat, confidence: failed ? 0.3 : 0.95, failed });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to categorize" });
    }
  });

  // API: Get Transactions
  app.get("/api/transactions", (req, res) => {
    res.json(transactions);
  });

  // API: Add Transaction
  app.post("/api/transactions", (req, res) => {
    const { description, amount, category, type, autoCategorized, categorizationFailed } = req.body;
    const newTx = {
      id: `tx-${Date.now()}`,
      description: description || "Gasto manual",
      amount: Math.max(0, Number(amount) || 0),
      category: category || "Otros",
      date: new Date().toISOString().split("T")[0],
      type: type || "gasto",
      autoCategorized: autoCategorized !== undefined ? autoCategorized : true,
      categorizationFailed: categorizationFailed || false,
    };
    transactions.unshift(newTx);
    res.json({ success: true, transaction: newTx, transactions });
  });

  // API: Delete Transaction
  app.delete("/api/transactions/:id", (req, res) => {
    transactions = transactions.filter((t) => t.id !== req.params.id);
    res.json({ success: true, transactions });
  });

  // API: Get Analysis History
  app.get("/api/history", (req, res) => {
    res.json(analysisHistory);
  });

  // API: Generate AI Analysis with Gemini (El Experto Alentador)
  app.post("/api/analyze", async (req, res) => {
    try {
      const {
        monthlyIncome = userProfile.monthlyIncome,
        totalDebts = userProfile.totalDebts,
        savingsFrequency = userProfile.savingsFrequency,
        budgetGoal = userProfile.budgetGoal,
        monthlyDebtPayment = userProfile.monthlyDebtPayment,
        subscriptionsCount = userProfile.subscriptionsCount,
        emergencyFund = userProfile.emergencyFund,
        recentTransactions = transactions,
      } = req.body;

      const safeMonthlyIncome = Math.max(0, Number(monthlyIncome) || 0);
      const safeTotalDebts = Math.max(0, Number(totalDebts) || 0);
      const safeBudgetGoal = Math.max(0, Number(budgetGoal) || 0);
      const safeMonthlyDebtPayment = Math.max(0, Number(monthlyDebtPayment) || 0);
      const safeSubscriptionsCount = Math.max(0, Number(subscriptionsCount) || 0);
      const safeEmergencyFund = Math.max(0, Number(emergencyFund) || 0);

      // Calculate base financial aggregates
      const totalExpense = recentTransactions
        .filter((t: any) => t.type === "gasto")
        .reduce((sum: number, t: any) => sum + Math.max(0, Number(t.amount || 0)), 0);

      // Category breakdown
      const categoryTotals: Record<string, number> = {};
      recentTransactions.forEach((t: any) => {
        const cat = t.category || "Otros";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.max(0, Number(t.amount || 0));
      });

      const colorsMap: Record<string, string> = {
        Vivienda: "#4648d4",
        Alimentación: "#fd933d",
        Transporte: "#712ae2",
        Servicios: "#38bdf8",
        Salud: "#10b981",
        Entretenimiento: "#ef4444",
        Otros: "#64748b",
      };

      const categoryDistribution = Object.entries(categoryTotals).map(([cat, amt]) => ({
        category: cat,
        amount: amt,
        percentage: totalExpense > 0 ? Number(((amt / totalExpense) * 100).toFixed(1)) : 0,
        color: colorsMap[cat] || "#4648d4",
      }));

      // Try Gemini AI generation with structured schema
      const ai = getAiClient();
      let aiResult: any = null;

      if (ai) {
        try {
          const prompt = `Eres 'El Experto Alentador' de FinanceAI, un coach financiero con inteligencia de datos, tono súper motivador, empático, positivo y claro.
Analiza la siguiente situación financiera del usuario Alex:
- Ingreso Mensual Total: $${safeMonthlyIncome}
- Valor Total Deudas: $${safeTotalDebts}
- Pago Mensual de Deuda: $${safeMonthlyDebtPayment}
- Frecuencia de Ahorro: ${savingsFrequency}
- Objetivo de Presupuesto: $${safeBudgetGoal}
- Cantidad de Suscripciones: ${safeSubscriptionsCount}
- Fondo de Emergencia: $${safeEmergencyFund}
- Gastos Recientes Totales: $${totalExpense}
- Detalle de categorías de gasto: ${JSON.stringify(categoryTotals)}

Calcula un puntaje de salud financiera (0 a 100), estado ('Saludable', 'En observación' o 'Riesgo'), un mensaje motivador y alentador con emojis y calidez, un logro semanal motivacional, y 2 a 3 recomendaciones prácticas y accionables con su impacto proyectado.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  healthScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
                  status: {
                    type: Type.STRING,
                    description: "Saludable, En observación, or Riesgo",
                  },
                  encouragingMessage: {
                    type: Type.STRING,
                    description: "Short friendly cheering message, e.g. ¡Vamos a mejorar tu salud financiera! 💪",
                  },
                  narrativeSummary: {
                    type: Type.STRING,
                    description: "A 2-sentence encouraging summary of their current financial status and next win.",
                  },
                  weeklyAchievement: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: "e.g. ¡Ahorraste 15% más que la semana pasada! 🎉" },
                      percentageGain: { type: Type.NUMBER },
                      hoursLeft: { type: Type.INTEGER },
                    },
                    required: ["title", "percentageGain", "hoursLeft"],
                  },
                  recommendations: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        category: { type: Type.STRING },
                        impact: { type: Type.STRING },
                        actionLabel: { type: Type.STRING },
                        statusType: { type: Type.STRING, description: "danger, warning, info, or success" },
                      },
                      required: ["title", "description", "category", "impact", "actionLabel", "statusType"],
                    },
                  },
                },
                required: [
                  "healthScore",
                  "status",
                  "encouragingMessage",
                  "narrativeSummary",
                  "weeklyAchievement",
                  "recommendations",
                ],
              },
            },
          });

          if (response.text) {
            aiResult = JSON.parse(response.text);
          }
        } catch (err) {
          console.error("Gemini analysis error, using smart rule engine fallback:", err);
        }
      }

      // Fallback or smart synthesis
      const debtToIncome = monthlyIncome > 0 ? (monthlyDebtPayment / monthlyIncome) * 100 : 40;
      let computedScore = aiResult?.healthScore || Math.max(50, Math.min(95, Math.round(100 - debtToIncome * 0.6 - (totalExpense > monthlyIncome ? 20 : 5))));
      let computedStatus = aiResult?.status || (computedScore >= 85 ? "Saludable" : computedScore >= 70 ? "En observación" : "Riesgo");

      const todayStr = new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date());

      const newReport = {
        id: `an-${Date.now()}`,
        date: todayStr,
        timestamp: Date.now(),
        totalSpent: totalExpense || 2190,
        healthScore: computedScore,
        status: computedStatus,
        encouragingMessage: aiResult?.encouragingMessage || "¡Vamos a mejorar tu salud financiera! 💪",
        aiNarrative: aiResult?.narrativeSummary || "Tus patrones de gasto muestran consistencia. Con pequeñas optimizaciones en servicios y suscripciones, acelerarás tu meta de ahorro.",
        weeklyAchievement: aiResult?.weeklyAchievement || {
          title: "¡Ahorraste 15% más que la semana pasada! 🎉",
          percentageGain: 15,
          hoursLeft: 48,
        },
        categoryDistribution: categoryDistribution.length > 0 ? categoryDistribution : [
          { category: "Vivienda", amount: 1200, percentage: 54.8, color: "#4648d4" },
          { category: "Alimentación", amount: 420, percentage: 19.2, color: "#fd933d" },
          { category: "Transporte", amount: 300, percentage: 13.7, color: "#712ae2" },
          { category: "Servicios", amount: 150, percentage: 6.8, color: "#38bdf8" },
          { category: "Salud", amount: 80, percentage: 1.8, color: "#10b981" },
          { category: "Entretenimiento", amount: 40, percentage: 1.8, color: "#ef4444" },
        ],
        recommendations: aiResult?.recommendations?.map((r: any, idx: number) => ({ ...r, id: `rec-${Date.now()}-${idx}` })) || [
          {
            id: `rec-${Date.now()}-1`,
            title: "Reduce entretenimiento",
            description: "Monitorear gastos recurrentes de streaming",
            category: "Entretenimiento",
            impact: "Ahorra $40/mes",
            actionLabel: "Ver detalles",
            statusType: "danger",
          },
          {
            id: `rec-${Date.now()}-2`,
            title: "Aumenta ahorro",
            description: "Reserva +200 pesos mensuales",
            category: "Ahorro",
            impact: "+$2,400 al año",
            actionLabel: "Configurar",
            statusType: "warning",
          },
        ],
        inputs: {
          income: Number(monthlyIncome),
          debts: Number(totalDebts),
          savingsFreq: savingsFrequency,
          budgetGoal: Number(budgetGoal),
          debtPayment: Number(monthlyDebtPayment),
          subscriptions: Number(subscriptionsCount),
          emergencyFund: Number(emergencyFund),
          transactionsCount: recentTransactions.length,
        },
      };

      // Add to front of history
      analysisHistory.unshift(newReport);

      res.json({ success: true, report: newReport });
    } catch (error: any) {
      console.error("Analysis generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate analysis" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FinanceAI Server running on http://localhost:${PORT}`);
  });
}

startServer();
