 //import OpenAI from "openai";  수정
const ENG_TYPE = {
    level1: "You are my English teacher. My level is Beginner and I have learned English, but I am not good at using it yet.",

    level2: "You are my English teacher. The level is intermediate and I can ask questions in my daily life, but it is difficult to answer questions when I receive them.",
    level3: "You are my English teacher. My English skill level is advanced and I am not fluent, but I can talk freely with foreigners. And I have the ability to join a foreign university.",

};

//필요한 도구들(ai/프로젝트 구조 생성엔진/키config/다른출처 통신 리소스 공유)
const OpenAI = require("openai");
const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

//api 키 가져오기 
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({apikey: OPENAI_API_KEY});
//chat 로 통신
app.post("/chat", async(req,res)=>{
  
    try {
        //프론트앤드에서 들고온 메시지 받아서 
        const{message,engType} = req.body;
        //console.log("type", engType);
        //챗gpt에 전달
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: ENG_TYPE[engType] 
                },
                {
                    role: "user",
                    content: message,
                },
            ],
        });
        console.log(completion.choices[0].message);
        const reply = completion.choices[0].message;
        res.status(200).json({reply});
    } catch (error) {
        res.status(400).json({error: "api request fail", rawError:error});
        
    }
});


// 포트 열어주기
app.listen(5001,()=>{
    console.log("server is running on 5001");

});
