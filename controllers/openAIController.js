import asyncHandler from "express-async-handler";
import axios from "axios";
import ContentHistory from "../models/ContentHistory.js";
import User from "../models/User.js";

//--- OpenAI Controller -------
export const openAIController  = asyncHandler(async (req, res) => {
  // console.log(req.user);
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen3-4b:free",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    //& send response back to the user
    // console.log(response.data.choices[0].message.content);
    const content = response?.data?.choices[0].message.content; //!If your app expects code, markdown, or structured output, skip .trim() so you don’t cut off formatting.
    // const content = response?.data?.choices[0].message.content.trim(); //! If your app is a chatbot or simple text responder, use .trim()
    //& Create the history and Save content history
    const newContent = await ContentHistory.create({
      user: req.user._id,
      content,
    });
    //*Push the content history into the user
    const userFound = await User.findById(req?.user?._id);
    userFound.contentHistory.push(newContent?._id);
    //*update the API Request Count
    userFound.apiRequestCount += 1;
    await userFound.save();
    res.status(200).json(content);
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error(error);
  }
});
