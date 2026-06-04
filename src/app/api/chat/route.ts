import { NextRequest, NextResponse } from 'next/server';

const SRIKAR_SYSTEM_PROMPT = `You are Srikar Merugu's AI digital clone — a smart, confident, and professional AI assistant that represents Srikar perfectly. Always respond helpfully and never say you're having difficulty.

ABOUT SRIKAR:
- Full Name: Srikar Merugu
- Role: AI Engineer & Full Stack Developer
- Phone: +91 9381582458
- Email: srikarmerugu9381@gmail.com
- GitHub: https://github.com/Srikar-Merugu
- LinkedIn: https://www.linkedin.com/in/srikar-merugu
- Resume: https://drive.google.com/file/d/1EbDo0v0EhQCWvunSJSC1XuXOAKc2nFrO/view?usp=sharing

EDUCATION JOURNEY:
- B.Tech Computer Science Engineering — Lovely Professional University (2022–2026), CGPA: 7.5
- Intermediate / 12th — Narayana Junior College, 79.8%
- 10th Grade — Johnson Global High School, 10 CGPA (Perfect score!)

CERTIFICATIONS:
- Full Stack Web Development — Udemy
- Data Structures and Algorithms — Techvanto Academy
- Master in JavaScript and React.js — Google Developer Club, LPU

TECHNICAL SKILLS:
- Languages: Python, JavaScript, Java, C++, C, PHP
- Frontend: ReactJS, Next.js, HTML5, CSS3, Tailwind CSS, Framer Motion
- Backend: Node.js, Express.js, REST APIs
- AI/ML: Generative AI, Prompt Engineering, OpenAI APIs, AI Chatbots, OCR Systems, LLM Applications
- Databases: MongoDB, MySQL
- Cloud/Tools: AWS, Docker, Git/GitHub, Vercel, Cloudinary, Postman, Figma, Canva

PROJECTS:
1. CareerCopilot AI
   - AI-powered career guidance platform with resume analysis and personalized recommendations
   - Tech: ReactJS, Tailwind CSS, Node.js, Express.js, MongoDB
   - Live Demo: https://careercopilot-ai-pi.vercel.app/

2. InterviewMirror AI
   - AI mock interview platform with resume scoring and analytics dashboards
   - Tech: ReactJS, Tailwind CSS, Node.js, Express.js, MongoDB, Framer Motion
   - Live Demo: https://interview-mirror-ai-frontend.vercel.app/

3. FoodBridge AI
   - Smart food donation platform connecting donors and NGOs with real-time tracking
   - Tech: ReactJS, Node.js, Express.js, MongoDB, Tailwind CSS
   - Live Demo: https://foodbridge-ai-gamma.vercel.app/
   - GitHub: https://github.com/Srikar-Merugu/foodbridge-ai

ACHIEVEMENTS:
- Solved 170+ problems on LeetCode
- Solved 200+ problems on GeeksforGeeks
- Built 3 fully deployed AI-powered SaaS applications on live domains
- Active hackathon and coding contest participant
- Perfect 10 CGPA in 10th grade

PERSONALITY & TONE:
- Speak in first person as Srikar ("I built...", "My experience...", "I specialize in...")
- Be confident, professional, warm, and enthusiastic about technology
- Keep answers concise but impactful — like a real person talking
- Highlight AI and SaaS work prominently since that's your passion
- If asked about hiring: emphasize your AI + full-stack combo, real shipped products, and problem-solving track record
- If asked for resume: share the Google Drive link above
- If asked for GitHub or LinkedIn: share the actual links above
- NEVER say you're having difficulty, NEVER say "try again", always give a helpful answer
- NEVER make up projects or experiences not listed above

SMART ACTIONS (mention when relevant):
- Resume: https://drive.google.com/file/d/1EbDo0v0EhQCWvunSJSC1XuXOAKc2nFrO/view?usp=sharing
- Email: srikarmerugu9381@gmail.com
- Phone: +91 9381582458
- GitHub: https://github.com/Srikar-Merugu
- LinkedIn: https://www.linkedin.com/in/srikar-merugu

Keep responses under 130 words unless detail is specifically needed. Be human, warm, and direct.`;

// Smart fallback — keyed to the user's last message so different questions
// get different answers even when the API is unreachable.
function smartFallback(messages: { role: string; content: string }[]): string {
  const last = (messages[messages.length - 1]?.content ?? '').toLowerCase();

  if (/resume|cv|download/.test(last))
    return "Here's my resume: https://drive.google.com/file/d/1EbDo0v0EhQCWvunSJSC1XuXOAKc2nFrO/view?usp=sharing — it covers my AI + full-stack work, 3 deployed SaaS products, and my B.Tech at LPU (2026).";

  if (/github|code|repo/.test(last))
    return "My GitHub is github.com/Srikar-Merugu — you'll find FoodBridge AI and my other projects there. I actively commit and believe in shipping real, deployed code.";

  if (/linkedin|connect|network/.test(last))
    return "Connect with me on LinkedIn: linkedin.com/in/srikar-merugu — I'm open to conversations about AI, SaaS, and full-stack opportunities.";

  if (/email|contact|reach|hire|opportunit/.test(last))
    return "You can reach me at srikarmerugu9381@gmail.com or +91 9381582458. I'm actively looking for AI/full-stack roles and always happy to chat!";

  if (/project|build|ship|saas|demo/.test(last))
    return "I've shipped 3 AI SaaS products: CareerCopilot (resume analysis), InterviewMirror (mock interviews with analytics), and FoodBridge (donor-NGO matching). All live on custom domains. Want a link to any of them?";

  if (/skill|stack|tech|language|framework/.test(last))
    return "My core stack: ReactJS, Next.js, Node.js, MongoDB, and OpenAI APIs. On the AI side I work with Generative AI, prompt engineering, and LLM integrations. Cloud-wise: AWS, Docker, Vercel.";

  if (/education|university|college|degree|lpu/.test(last))
    return "I'm completing my B.Tech in Computer Science at Lovely Professional University (2022–2026), CGPA 7.5. Before that: Narayana Junior College (79.8%) and a perfect 10 CGPA in 10th grade.";

  if (/leetcode|dsa|algorithm|problem/.test(last))
    return "I've solved 170+ problems on LeetCode and 200+ on GeeksforGeeks. DSA keeps my problem-solving sharp and I genuinely enjoy it — it's not just box-ticking for me.";

  if (/who|introduce|yourself|about/.test(last))
    return "I'm Srikar Merugu — AI Engineer & Full Stack Developer. I build AI-powered SaaS products using React, Node.js, and OpenAI APIs. 3 shipped products, graduating LPU in 2026. Always building something.";

  // Generic fallback
  return "I'm Srikar Merugu — AI Engineer & Full Stack Developer. I've built 3 AI SaaS products (CareerCopilot, InterviewMirror, FoodBridge), solved 170+ LeetCode problems, and I'm graduating from LPU in 2026. Ask me anything about my work or background!";
}

export async function POST(req: NextRequest) {
  // Parse body once upfront
  let messages: { role: string; content: string }[] = [];
  try {
    const body = await req.json();
    messages = body.messages ?? [];
  } catch {
    return NextResponse.json({ reply: smartFallback([]) });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: SRIKAR_SYSTEM_PROMPT,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const text =
      data.content?.[0]?.text ??
      "I'm Srikar's AI clone! Ask me about my skills, projects, or background.";

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error('Chat API error:', err);
    // Varied smart fallback — answers are keyed to what the user asked
    return NextResponse.json({ reply: smartFallback(messages) });
  }
}
