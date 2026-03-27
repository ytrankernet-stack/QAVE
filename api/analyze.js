const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const uploadResponse = await fileManager.uploadFile(req.body.fileUrl, {
      mimeType: req.body.mimeType,
      displayName: "QA Analysis",
    });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent([
      { fileData: { mimeType: uploadResponse.file.mimeType, fileUri: uploadResponse.file.uri } },
      { text: "Perform professional video/text QA. Return JSON." },
    ]);

    return res.status(200).json(JSON.parse(result.response.text()));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
