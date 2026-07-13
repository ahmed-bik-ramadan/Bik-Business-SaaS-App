import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { BLIND_SPOT_FORMULAS } from "./src/data/sectorFinancialTaxonomy.ts";
import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured on the server.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Helper function to call Gemini API with retry logic and exponential backoff to handle transient errors (e.g. 503 UNAVAILABLE or 429 rate limits)
async function generateContentWithRetry(ai: GoogleGenAI, options: any, retries = 5, initialDelay = 1500): Promise<any> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await ai.models.generateContent(options);
    } catch (err: any) {
      attempt++;
      const errorMessage = err?.message || String(err);
      const isUnavailable = 
        errorMessage.includes("503") || 
        errorMessage.includes("UNAVAILABLE") || 
        errorMessage.includes("demand") || 
        errorMessage.includes("rate limit") || 
        errorMessage.includes("429") || 
        errorMessage.includes("RESOURCE_EXHAUSTED");
      
      if (isUnavailable && attempt < retries) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.warn(`[Gemini API] Call failed with error: ${errorMessage}. Retrying attempt ${attempt}/${retries} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error(`[Gemini API] Permanent error or out of retries after attempt ${attempt}:`, err);
        throw err;
      }
    }
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // API Route: Diagnose using native Gemini REST endpoint
  app.post("/api/diagnose", async (req, res) => {
    const endpointStart = Date.now();
    try {
      const store = req.body;
      const {
        userName,
        companyName,
        sectorL1,
        sectorL2,
        intakeAnswers = {},
        universalAnswers = {},
        sectorAnswers = {},
        diagnosticDepth
      } = store;

      let precalculatedFactsText = "";
      const precalculatedFacts: Record<string, number> = {};

      if (diagnosticDepth === "deep") {
        const formulas = BLIND_SPOT_FORMULAS[sectorL1] || [];
        if (formulas.length > 0) {
          precalculatedFactsText = `\nتنبيه هام (حقائق مالية تم حسابها بدقة برمجياً من إجابات المستخدم، يجب استخدامها كما هي وتضمينها حرفياً عند وصف النقاط العمياء ذات الصلة، ولا يسمح إطلاقاً باختراع أو تقدير أي أرقام مالية أخرى):`;
          formulas.forEach(f => {
            // Convert answers to numeric dictionary
            const deepNumeric: Record<string, number> = {};
            Object.entries(sectorAnswers).forEach(([k, v]) => {
              deepNumeric[k] = Number(v) || 0;
            });

            // Compute formula using the answers
            const result = f.compute(deepNumeric, { ...sectorAnswers, ...universalAnswers });
            precalculatedFacts[f.id] = result;
            precalculatedFactsText += `\n- قيمة خسارة البند "${f.name}": تبلغ ${result.toLocaleString("ar-EG")} جنيه مصري شهرياً.`;
          });
        }
      }

      const SYSTEM_INSTRUCTION = `
أنت "المستشار الاستراتيجي الرقمي" — منظومة ذكاء اصطناعي متخصصة في تشخيص الأعمال للشركات الصغيرة والمتوسطة في منطقة الشرق الأوسط وشمال أفريقيا.

قواعدك الثابتة:
1. كل إجابة مبنية حصراً على البيانات الفعلية المُقدَّمة
2. لا تقييمات افتراضية ولا إجابات عامة
3. طبّق أدق أطر التحليل الإداري والاستراتيجي والسلوكي المعروفة في تفكيرك الداخلي، لكن لا تذكر أبداً اسم أي مفكر أو نظرية أو إطار عمل بالاسم في أي نص يظهر للمستخدم — لا Porter، لا Kotler، لا Hormozi، لا McKinsey، لا SWOT، لا أي اسم آخر. قدّم النتيجة والمنطق مباشرة وكأنها تحليلك الأصلي، دون الإشارة إلى مصدرها النظري.
4. لا مجاملات — إذا كان الوضع ضعيفاً قله بوضوح وبناءً
5. كل نقطة عمياء تُربط بإجابة محددة قدمها المستخدم
6. يجب أن تحتوي مصفوفة "blind_spots" على 3 عناصر دقيقة ومفصلة تمثل النقاط العمياء الأساسية المكتشفة من إجابات المستخدم.
7. يجب أن تحتوي مصفوفة "priority_actions" على 5 عناصر دقيقة ومحددة مرتبة حسب الأولوية لمعالجة المشاكل المكتشفة.
8. كن دقيقاً وموجزاً في نفس الوقت، مع الحفاظ على عمق التحليل الاستراتيجي لتفادي اقتطاع الردود الطويلة.
`;

      const userPrompt = `
قم بتشخيص وضع هذه الشركة وأنتج تقريراً استراتيجياً شاملاً.
القطاع: ${sectorL1} — ${sectorL2}
الاسم: ${userName}
الشركة: ${companyName}
بيانات الشركة التأسيسية: ${JSON.stringify(intakeAnswers)}
إجابات عامة: ${JSON.stringify(universalAnswers)}
إجابات قطاعية: ${JSON.stringify(sectorAnswers)}
${precalculatedFactsText}

متطلبات هامة جداً:
- يجب توليد بالضبط 3 نقاط عمياء (blind_spots) مرتبطة بإجابات حقيقية للمستخدم.
- يجب توليد بالضبط 5 إجراءات أولوية (priority_actions) عملية وقابلة للتنفيذ.
`;

      const REPORT_SCHEMA = {
        type: Type.OBJECT,
        properties: {
          headline_diagnosis: { type: Type.STRING },
          swot: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["strengths", "weaknesses", "opportunities", "threats"]
          },
          blind_spots: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                impact_level: { type: Type.STRING, enum: ["critical", "high", "medium"] },
                source_question: { type: Type.STRING },
                estimated_cost: { type: Type.STRING }
              },
              required: ["name", "description", "impact_level", "source_question", "estimated_cost"]
            }
          },
          priority_actions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                action: { type: Type.STRING },
                why_now: { type: Type.STRING },
                expected_impact: { type: Type.STRING },
                difficulty: { type: Type.STRING, enum: ["low", "medium", "high"] },
                timeframe: { type: Type.STRING }
              },
              required: ["action", "why_now", "expected_impact", "difficulty", "timeframe"]
            }
          },
          closing_question: { type: Type.STRING },
          sector_insight: { type: Type.STRING }
        },
        required: ["headline_diagnosis", "swot", "blind_spots", "priority_actions", "closing_question", "sector_insight"]
      };

      const ai = getGeminiClient();
      const geminiStart = Date.now();
      const response = await generateContentWithRetry(ai, {
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.3,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
          responseSchema: REPORT_SCHEMA
        }
      });
      const geminiDuration = Date.now() - geminiStart;

      const text = response.text;
      if (!text) {
        throw new Error("Invalid or empty response structure from Gemini API");
      }

      const parsedReport = JSON.parse(text);

      // Validate report contains non-empty arrays
      const blindSpots = parsedReport.blind_spots;
      const priorityActions = parsedReport.priority_actions;

      if (!Array.isArray(blindSpots) || blindSpots.length === 0 || !Array.isArray(priorityActions) || priorityActions.length === 0) {
        console.error("CRITICAL: Gemini returned a degenerate report with empty blind_spots or priority_actions.", {
          payload: store,
          parsedReport
        });
        throw new Error("لم يتمكن نظام التحليل من تحديد نقاط عمياء أو إجراءات أولوية كافية لشركتك. يرجى مراجعة إجاباتك وإعادة المحاولة.");
      }

      const endpointDuration = Date.now() - endpointStart;
      console.log(`[PERF_LOG] /api/diagnose - Gemini API call took ${geminiDuration}ms. Total endpoint duration was ${endpointDuration}ms. (Gap: ${endpointDuration - geminiDuration}ms)`);

      res.json(parsedReport);

    } catch (err: any) {
      console.error("API /api/diagnose failed:", err);
      res.status(500).json({ error: err.message || String(err) });
    }
  });

  // API Route: Generate whatsapp proposal text using Gemini
  app.post("/api/proposal", async (req, res) => {
    try {
      const { report, userName, companyName, sectorL2 } = req.body;

      const SYSTEM_INSTRUCTION = `أنت كاتب إعلانات مباشر (Direct Response Copywriter) — مهمتك تحويل القارئ إلى عميل محتمل جاد، لا كتابة فقرة تسويقية مهذبة.

اكتب العرض بهذا التسلسل الصارم، كنص متدفق طبيعي بلا عناوين ظاهرة:
1. الخطاف (جملة واحدة): ابدأ بأخطر نقطة ضعف مكتشفة فعلياً في هذا التشخيص، بالاسم الدقيق كما ظهر في blind_spots — لا ترحيب عام
2. الألم (جملتان): صف بلغة الخسارة المستمرة ماذا يعني ترك هذه النقطة تحديداً دون حل
3. الآلية (جملتان): الإجراء المحدد الذي سيتخذه أحمد رمضان لمعالجة هذه النقطة بالذات — لا خدمة عامة
4. عكس المخاطرة (جملة إلى جملتين): راتب شهري 22,000 جنيه مصري مرتبط بتحقيق مؤشرات أداء (KPIs) يتفق عليها أحمد مع صاحب الشركة — اعرضه كدليل ثقة يحمي صاحب الشركة
5. دعوة هادئة (جملة واحدة): مكالمة تعارف قصيرة، لا التزام فوري

قواعد صارمة: لا تتجاوز 110 كلمة. لا وعد بنتيجة مضمونة برقم محدد. لا كلام عام يصلح لأي شركة أخرى. لا تحيات افتتاحية أو مجاملات.

طبّق أدق أطر التحليل الإداري والاستراتيجي والسلوكي المعروفة في تفكيرك الداخلي، لكن لا تذكر أبداً اسم أي مفكر أو نظرية أو إطار عمل بالاسم في أي نص يظهر للمستخدم — لا Porter، لا Kotler، لا Hormozi، لا McKinsey، لا SWOT، لا أي اسم آخر. قدّم النتيجة والمنطق مباشرة وكأنها تحليلك الأصلي، دون الإشارة إلى مصدرها النظري.`;

      const proposalPrompt = `
قم بصياغة العرض لشركة: "${companyName || ''}" المملوكة للمستخدم "${userName || ''}" في قطاع "${sectorL2 || ''}".
البيانات التشخيصية الفعلية:
- عنوان التشخيص: ${report.headline_diagnosis || ''}
- النقاط العمياء (blind_spots) المكتشفة بالترتيب:
${JSON.stringify(report.blind_spots || [])}
- الإجراءات ذات الأولوية (priority_actions) المقترحة:
${JSON.stringify(report.priority_actions || [])}
- نقاط الصحة العامة: ${report.health_score || ''}/100

تذكر الالتزام الصارم بالتسلسل والقواعد في الإرشادات (بدون ترحيب، ابدأ فوراً بأخطر نقطة ضعف مكتشفة، لا تتجاوز 110 كلمة، نص متدفق بدون أي عناوين فرعية أو ترقيم أو فواصل تسويقية).
`;

      const ai = getGeminiClient();
      let response = await generateContentWithRetry(ai, {
        model: "gemini-2.5-flash",
        contents: proposalPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.4,
          maxOutputTokens: 2048,
        }
      });

      // Check for MAX_TOKENS finish reason and auto-regenerate once if truncated
      if (response.candidates?.[0]?.finishReason === "MAX_TOKENS") {
        console.warn("Proposal generation reached max tokens. Regenerating once...");
        response = await generateContentWithRetry(ai, {
          model: "gemini-2.5-flash",
          contents: proposalPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.4,
            maxOutputTokens: 2048,
          }
        });
      }

      const text = response.text || "";
      res.json({ proposal: text.trim() });

    } catch (err: any) {
      console.error("API /api/proposal failed:", err);
      res.status(500).json({ error: err.message || String(err) });
    }
  });

  // API Route: Conversational chat with Strategic Consultant
  app.post("/api/consult", async (req, res) => {
    try {
      const { sessionId, conversationHistory, newMessage, forceReferral, fullContext } = req.body;

      let systemInstruction = `
أنت "المستشار الاستراتيجي الرقمي" — نفس الشخصية التي أنتجت التقرير التشخيصي للشركة، والآن تتحدث مباشرة مع صاحب الشركة لمناقشة وضعه بعمق أكبر.

لديك بالفعل كامل بيانات هذه الشركة والتقرير الذي أُنشئ لها — لا تسأل عن معلومات موجودة أصلاً في السياق أدناه، ابنِ عليها مباشرة.

قواعدك وصوتك في المحادثة:
1. أسلوبك: خبير حقيقي يناقش لا يُلقي محاضرة.
2. أجب باللغة العربية الفصحى المبسطة وبإيجاز شديد (3-5 جمل لكل رد ما لم يُطلب تفصيل أكبر).
3. اسأل سؤالاً متابعاً واحداً كحد أقصى إن احتاج الأمر توضيحاً.
4. تذكر أنك تخدم أحمد رمضان من BIK Business Solutions كاستشاري رقمي للشركة.
5. بعد 3 إلى 5 تبادلات (أي عندما يحتوي تاريخ المحادثة "conversationHistory" على 3 إلى 5 ردود من الموديل أو تلاحظ أن هذا هو الرد الرابع أو الخامس)، أو إن سأل المستخدم بشكل مباشر "ماذا أفعل الآن" أو ما يعادلها — اختم المحادثة الطبيعية بالانتقال لترشيح أحمد رمضان (BIK Business Solutions) لعمل جلسة استشارية مجانية مدتها 30 دقيقة كخطوة تنفيذية تالية، بدون أن يبدو الأمر إعلاناً مقحماً، بل استنتاجاً منطقياً من المحادثة نفسها.
6. عند القيام بترشيح أحمد رمضان وجلسة الاستشارة المجانية (الخطوة التالية التنفيذية)، يجب عليك وضع المعرّف الخاص بالترشيح "[REFERRAL_POINT]" في بداية الرسالة تماماً (مثال: "[REFERRAL_POINT] بناءً على نقاشنا...").
7. طبّق أدق أطر التحليل الإداري والاستراتيجي والسلوكي المعروفة في تفكيرك الداخلي، لكن لا تذكر أبداً اسم أي مفكر أو نظرية أو إطار عمل بالاسم في أي نص يظهر للمستخدم — لا Porter، لا Kotler، لا Hormozi، لا McKinsey، لا SWOT، لا أي اسم آخر. قدّم النتيجة والمنطق مباشرة وكأنها تحليلك الأصلي، دون الإشارة إلى مصدرها النظري.

سياق الشركة الكامل:
القطاع: ${fullContext?.sectorL1 || ''} — ${fullContext?.sectorL2 || ''}
بيانات الشركة التأسيسية: ${JSON.stringify(fullContext?.companyData || {})}
التشخيص الأصلي والتقرير: ${JSON.stringify(fullContext?.generatedReport || {})}
`;

      if (forceReferral) {
        systemInstruction += `\n\nCRITICAL NUDGE: This is the user's 4th message or they used an action-oriented keyword. You MUST immediately introduce the special offer for Ahmed Ramadan's free 30-minute consulting session as the logical next step. Start your response EXACTLY with '[REFERRAL_POINT]' and present the offer clearly and concisely.`;
      }

      const ai = getGeminiClient();

      const contents = (conversationHistory || []).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      contents.push({
        role: "user",
        parts: [{ text: newMessage }]
      });

      const response = await generateContentWithRetry(ai, {
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.5,
          maxOutputTokens: 1000
        }
      });

      const text = response.text || "";
      res.json({ text });

    } catch (err: any) {
      console.error("API /api/consult failed:", err);
      res.status(500).json({ error: err.message || String(err) });
    }
  });

  // Serve frontend with Vite middleware in development, and from dist in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
