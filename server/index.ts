import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { GoogleGenerativeAI } from '@google/generative-ai'
import 'dotenv/config'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const app = express();

app.use(cors(
    {
        origin: "*",
        methods: "GET",
    }
));

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: Number(process.env.MAXREQ),
	standardHeaders: true,
	legacyHeaders: false,
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.get('/customgpt', async (req:any, res:any) => {
    try {
        const { character, question } = req.query;

        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };

        res.writeHead(200, headers);

        const prompt = `You are ${character} answer this qustion as this character. ${question}. In 100 words.`;
        const result = await model.generateContentStream(prompt);

        for await (const chunk of result.stream) {
            const text = chunk.text();
            process.stdout.write(text);
            res.write(`data: ${text}\n\n`);
        }

        res.write(`data: ${'END'}\n\n`);

        res.end();
    } catch (error) {
        console.log(error);
        res.send(error instanceof Error ? error.message : String(error));
    }
});

app.listen(process.env.PORT, () => console.log(`Server ready at port : ${process.env.PORT}`));
