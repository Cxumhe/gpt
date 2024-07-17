<script setup>
import { ref, watch } from "vue";
const message = ref("");
const textareaDOM = ref(null);
//不要使用解构，会丢失响应性
const props = defineProps(["isdone"]);
const emit = defineEmits(["sendMessage", "cancelFetch"]);

function emitMessage() {
    console.log(props.isdone);
    if (props.isdone && message.value) {
        emit("sendMessage", message.value);
        message.value = "";
    }
}
let padding = 20;
watch(
    [message, textareaDOM],
    () => {
        textareaDOM.value.style.height = "20px";
        textareaDOM.value.style.height =
            textareaDOM.value.scrollHeight - padding + "px";
    },
    {
        flush: "post",
    }
);

//@keydown.enter="emitMessage"
</script>
<template>
    <div class="input-group-container">
        <div class="input-group mb-3">
            <textarea
                type="text"
                class="form-control"
                placeholder="给'GPT'发送消息"
                aria-label="message"
                aria-describedby="basic-addon1"
                v-model="message"
                rows="1"
                ref="textareaDOM"
            />
            <button
                class="btn btn-primary"
                :class="message ? '' : 'disabled'"
                v-if="props.isdone"
                @click="emitMessage"
            >
                ↑
            </button>
            <button
                v-else
                class="btn btn-secondary"
                @click="$emit('cancelFetch')"
            >
                ■
            </button>
        </div>
    </div>
</template>
<style scoped>
.input-group-container {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 10px;
}
.input-group {
    padding: 6px;
    width: 70%;
    display: flex;
    align-items: center;
    border-radius: 25px;
    /* border: 1px solid red; */
    overflow: hidden;
    background-color: var(--sidebar-surface-primary-darker);
}

textarea {
    padding: 10px 10px;
    /* height: 20px; */
    height: fit-content;
    width: 100%;
    font-size: 18px;
    border: none;
    background-color: transparent;
    resize: none;
    overflow-y: auto;
}

textarea:focus-visible {
    outline: none;
}

button {
    width: 40px;
    height: 40px;
    border-radius: 99999px;
    cursor: pointer;
    border: none;
    background-color: hsl(0, 0%, 85%);
    color: white;
    transition: 0.4s;
}
.btn-primary,
.btn-secondary {
    background-color: black;
}
.btn-primary.disabled {
    background-color: hsl(0, 0%, 85%);
    cursor: not-allowed;
}
</style>
