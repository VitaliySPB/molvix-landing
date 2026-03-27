import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/company-lookup", async (req, res): Promise<void> => {
  const inn = String(req.query.inn ?? "").trim();

  if (!/^\d{10}$|^\d{12}$/.test(inn)) {
    res.status(400).json({ error: "ИНН должен содержать 10 или 12 цифр" });
    return;
  }

  try {
    const url = `https://api-fns.ru/api/egr?req=${inn}&key=free`;
    const response = await fetch(url, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      res.status(502).json({ error: "Не удалось получить данные от реестра" });
      return;
    }

    const data = await response.json() as {
      items?: Array<{
        ЮЛ?: { НаимСокрЮЛ?: string; НаимПолнЮЛ?: string };
        ИП?: { ФИОПолн?: string };
      }>;
    };

    const item = data?.items?.[0];
    if (!item) {
      res.status(404).json({ error: "Компания не найдена" });
      return;
    }

    const name =
      item.ЮЛ?.НаимСокрЮЛ ||
      item.ЮЛ?.НаимПолнЮЛ ||
      item.ИП?.ФИОПолн ||
      null;

    if (!name) {
      res.status(404).json({ error: "Компания не найдена" });
      return;
    }

    res.json({ inn, name });
  } catch {
    res.status(502).json({ error: "Не удалось подключиться к реестру" });
  }
});

export default router;
