export default async function handler(req, res) {
  try {
    const { question } = req.body || {};

    if (!question) {
      return res.status(400).json({ answer: "ไม่มีคำถาม" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: "คุณคือ AI ของ NEXORA ช่วยตอบเกี่ยวกับการ์ด เกม และระบบแต้ม" },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();

    // 🔥 กันพังกรณี API error
    if (!response.ok) {
      console.error("OpenAI Error:", data);
      return res.status(500).json({
        answer: "AI มีปัญหา: " + (data.error?.message || "Unknown error")
      });
    }

    const answer = data?.choices?.[0]?.message?.content || "ไม่มีคำตอบ";

    res.status(200).json({ answer });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ answer: "ระบบมีปัญหา" });
  }
}
