import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import OpenAI from 'openai'
import 'dotenv/config'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
        
    
        const stream = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: `You are ${character} answer this qustion as this character. ${question}. In 50 words.` }],
            stream: true,
        });
        
        for await (const part of stream) {
            process.stdout.write(part.choices[0]?.delta?.content || '');
            res.write(`data: ${part.choices[0]?.delta?.content || ''}\n\n`);
        }

        res.write(`data: ${'END'}\n\n`);

        res.end();
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
});

app.listen(process.env.PORT, () => console.log(`Server ready at port : ${process.env.PORT}`));