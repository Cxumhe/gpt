<script setup>
import { inject, watch, ref } from "vue";
const props = defineProps(["chat"]);
// const emit = defineEmits(["changeChat"]);
const changeChat = inject("changeChat");
const toactivateDisplaytext = inject("toactivateDisplaytext");
const currentChat = inject("currentChat");

const displayText = ref("");
watch(
    toactivateDisplaytext,
    () => {
        const data = JSON.parse(localStorage.getItem(props.chat));
        displayText.value = data[1] ? data[1].content.slice(0, 14) : "新对话";
    },
    {
        immediate: true,
    }
);
</script>
<template>
    <li>
        <button
            :class="currentChat === props.chat ? 'highlight' : ''"
            @click="changeChat(props.chat)"
        >
            {{ displayText }}
        </button>
    </li>
</template>
<style scoped>
li {
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
}
button {
    text-align: left;
    height: 40px;
    width: 220px;
    padding: 5px 10px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    background-color: var(--sidebar-surface-primary);
}
button:hover {
    background-color: rgb(229, 229, 229);
}

.highlight {
    background-color: rgb(229, 229, 229);
}
</style>
