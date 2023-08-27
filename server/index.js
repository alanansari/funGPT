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
        "origin": "*",
        "methods": "GET",
    }
));

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: process.env.MAXREQ, // limit each IP to 3 requests per windowMs
	standardHeaders: true,
	legacyHeaders: false,
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.get('/customgpt', async (req, res) => {
    try {
        const { character, question } = req.query;
    
        const stream = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: `You are ${character} answer this qustion as this character. ${question}. In 50 words.` }],
            stream: true,
        });
        for await (const part of stream) {
            process.stdout.write(part.choices[0]?.delta?.content || '');
            res.write(part.choices[0]?.delta?.content || '');
        }

        res.end();
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
});

app.listen(process.env.PORT, () => console.log(`Server ready at port : ${process.env.PORT}`));