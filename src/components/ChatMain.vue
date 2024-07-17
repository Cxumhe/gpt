<script setup>
import { marked } from "marked";
import ChatInput from "./ChatInput.vue";
import { ref, watchEffect, watch, onMounted, inject } from "vue";

const historyCleanIndicator = inject("historyCleanIndicator");

const props = defineProps(["currentChat"]);
const emit = defineEmits(["toactivateDisplaytextHandler"]);

const results = ref([]);
const isdone = ref(true);
const neededDOM = ref(null);
const mainDOM = ref(null);

//执行清除历史记录
watch(
    historyCleanIndicator,
    () => {
        results.value = [];
    },
    {}
);

// 取消fetch请求
let controller;

watchEffect(() => {
    results.value = JSON.parse(localStorage.getItem(props.currentChat));
});
watchEffect(() => {
    const data = JSON.stringify(results.value);
    localStorage.setItem(props.currentChat, data);
    emit("toactivateDisplaytextHandler");
});

// function sendMessage(message) {
//     console.log(isdone.value);
//     results.value.push({
//         role: "user",
//         content: message,
//     });
//     if (!isdone.value) {
//         return;
//     }
//     isdone.value = !isdone.value;
//     console.log(message);
//     const url =
//         "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/yi_34b_chat?access_token=24.9690dec67054dc980f564d9c852a3699.2592000.1723432199.282335-94067888";
//     async function getResponse() {
//         controller = new AbortController();
//         const resp = await fetch(url, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 messages: results.value,
//                 stream: true,
//             }),
//             signal: controller.signal,
//         });
//         const reader = resp.body.getReader();
//         const textDecoder = new TextDecoder();
//         results.value.push({
//             role: "assistant",
//             content: "",
//         });

//         while (1) {
//             const { done, value } = await reader.read();
//             if (done) {
//                 isdone.value = !isdone.value;
//                 break;
//             }
//             let str = textDecoder.decode(value);
//             str = str.slice(6);
//             const data = JSON.parse(str);
//             results.value[results.value.length - 1].content =
//                 results.value[results.value.length - 1].content + data.result;
//         }
//     }

//     getResponse();
// }
function sendMessage(message) {
    console.log(isdone.value);
    results.value.push({
        role: "user",
        content: message,
    });
    if (!isdone.value) {
        return;
    }
    isdone.value = !isdone.value;
    console.log(message);
    const apiKey = "sk-OSVnKZwvIwasLAz60VdThQ74UKJs5Nvt11S1zk1OJrGW9tDY";
    const url = "https://api.deepbricks.ai/v1/chat/completions";
    async function getResponse() {
        controller = new AbortController();
        const resp = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: results.value,
                stream: true,
            }),
            signal: controller.signal,
        });
        const reader = resp.body.getReader();
        const textDecoder = new TextDecoder();
        results.value.push({
            role: "assistant",
            content: "",
        });

        label: while (1) {
            const { done, value } = await reader.read();
            // if (done) {
            //     isdone.value = !isdone.value;
            //     break;
            // }
            let strs = textDecoder.decode(value);
            console.log(strs);
            strs = strs.split("data: ");

            console.log(strs);
            for (const str of strs) {
                if (str) {
                    if (str.includes("DONE")) {
                        isdone.value = !isdone.value;
                        break label;
                    }
                    const data = JSON.parse(str);
                    results.value[results.value.length - 1].content +=
                        data.choices[0].delta.content;
                }
            }
        }
    }

    getResponse();
}
function cancelFetch() {
    if (controller) {
        controller.abort();
        isdone.value = true;
    }
}

watch(props, () => {
    // console.log("触发了取消的watch");
    cancelFetch();
});
//需要neededDOM，用于监听第一次DOM加载完成
//不能immediate会执行到watch时立即执行一次，
watch(
    [props, neededDOM],
    () => {
        if (neededDOM.value) {
            for (let i = 0; i < neededDOM.value.length - 1; i++) {
                neededDOM.value[i].innerHTML = marked.parse(
                    neededDOM.value[i].textContent
                );
            }
        }
    },
    {
        flush: "post",
        deep: true,
    }
);

watch(
    [results, neededDOM],
    () => {
        // console.log("触发了最后回答的DOM更新");
        if (
            results.value.length !== 0 &&
            results.value[results.value.length - 1].role === "assistant"
        ) {
            // console.log("触发了最后回答的DOM更新的if里");
            neededDOM.value[neededDOM.value.length - 1].innerHTML =
                marked.parse(
                    neededDOM.value[neededDOM.value.length - 1].textContent
                );
        }
        mainDOM.value?.scrollTo(0, mainDOM.value.scrollHeight);
    },
    {
        flush: "post",
        deep: true,
    }
);
</script>
<template>
    <div class="main" ref="mainDOM">
        <div class="header">
            <span>ChatGPT</span>
        </div>
        <div class="content-container">
            <div
                v-for="result in results"
                :class="result.role === 'user' ? 'user-container' : ''"
            >
                <div class="res-content user" v-if="result.role === 'user'">
                    {{ result.content }}
                </div>
                <div v-else class="res-content result" ref="neededDOM">
                    {{ result.content }}
                </div>
            </div>
        </div>

        <ChatInput
            @sendMessage="sendMessage"
            :isdone="isdone"
            @cancelFetch="cancelFetch"
        ></ChatInput>
    </div>
</template>
<style scoped>
.main {
    height: 100vh;
    width: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}
.res-content {
}

.result {
    /* color: rebeccapurple; */
}
.header {
    position: sticky;
    padding: 10px;
    top: 0px;
    height: fit-content;
    background-color: white;
    /* border: 1px solid red; */
}

.header span {
    color: var(--text-primary);
    font-size: 18px;
    font-weight: 700;
    display: block;
    width: fit-content;
    padding: 5px 10px;
    border-radius: 10px;
    cursor: pointer;
}

.header span:hover {
    background-color: rgba(244, 244, 244, 0.8);
}

.user {
    /* color: white; */
    width: fit-content;
    max-width: 70%;
    background-color: rgba(244, 244, 244, 1);
    padding: 15px 30px;
    border-radius: 30px;
    right: 0px;
}
.user-container {
    display: flex;
    justify-content: right;
}
.content-container {
    margin: 0 100px;
    /* height: 100%; */
    flex-grow: 1;
}
</style>
