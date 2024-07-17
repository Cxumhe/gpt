const apiKey = "sk-OSVnKZwvIwasLAz60VdThQ74UKJs5Nvt11S1zk1OJrGW9tDY";
const baseURL = "https://api.deepbricks.ai/v1/chat/completions";
let results = "";
async function getResponse() {
    const resp = await fetch(baseURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: "你好",
                },
            ],
            stream: true,
        }),
    });

    const reader = resp.body.getReader();
    const textDecoder = new TextDecoder();
    while (1) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        let str = textDecoder.decode(value);
        if (str.includes("DONE")) {
            break;
        }
        str = str.slice(6);
        const data = JSON.parse(str);
        results += data.choices[0].delta.content;
        console.log(results);
    }
}
getResponse();
