export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const userInput = req.body.userRequest?.utterance || "안녕하세요";

  // Gemini 호출
  const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: userInput }
          ]
        }
      ]
    })
  });

  const geminiData = await geminiRes.json();
  const aiText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "답변을 생성하지 못했어요.";

  // 카카오 응답
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: aiText
          }
        }
      ]
    }
  });
}
